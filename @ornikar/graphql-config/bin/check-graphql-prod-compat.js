#!/usr/bin/env node

'use strict';

/**
 * Checks that every GraphQL operation of the host repository validates against the
 * schema of a gateway repository checkout (typically its master branch, used as a
 * proxy for what is actually deployed in production).
 *
 * This catches PRs that add or update GraphQL operations ahead of the corresponding
 * gateway change being deployed: such a PR would pass codegen (consistent with the
 * introspection schema it ships) but break at runtime once released, since production
 * does not serve the new fields yet.
 *
 * Usage:
 *   ornikar-check-graphql-prod-compat <gateway-checkout-dir> \
 *     [--gateway-schema-glob 'src/webserver/**\/*.graphql'] \
 *     [--client-schema <path-to-apollo-client-typedefs>]... \
 *     [--documents <glob>]...
 */

const path = require('node:path');
const { parseArgs } = require('node:util');
const { removeClientSetsFromDocument } = require('@apollo/client/utilities');
const { CodeFileLoader } = require('@graphql-tools/code-file-loader');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
const { loadDocuments, loadSchema } = require('@graphql-tools/load');
const { Kind, NoUnusedFragmentsRule, specifiedRules, validate } = require('graphql');

// Every operation below is validated together with every fragment defined anywhere in
// the host codebase (simplest way to resolve fragments spread across files), so
// "fragment is never used" is expected noise rather than a real error here.
const VALIDATION_RULES = specifiedRules.filter((rule) => rule !== NoUnusedFragmentsRule);

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      'gateway-schema-glob': { type: 'string', default: 'src/webserver/**/*.graphql' },
      'client-schema': { type: 'string', multiple: true, default: [] },
      documents: { type: 'string', multiple: true, default: ['./@ornikar/*/src/**/*.ts'] },
    },
  });

  const [gatewayCheckoutDir] = positionals;
  if (!gatewayCheckoutDir) {
    console.error(
      'Usage: ornikar-check-graphql-prod-compat <gateway-checkout-dir> [--gateway-schema-glob <glob>] [--client-schema <path>]... [--documents <glob>]...',
    );
    process.exit(1);
  }

  const schema = await loadSchema(
    [path.join(gatewayCheckoutDir, values['gateway-schema-glob']), ...values['client-schema']],
    { loaders: [new GraphQLFileLoader(), new CodeFileLoader()] },
  );

  const sources = await loadDocuments(values.documents, { loaders: [new CodeFileLoader()] });

  const fragments = new Map();
  for (const { document } of sources) {
    for (const definition of document?.definitions ?? []) {
      if (definition.kind === Kind.FRAGMENT_DEFINITION) {
        fragments.set(definition.name.value, definition);
      }
    }
  }

  const errors = [];

  for (const { document, location } of sources) {
    for (const definition of document?.definitions ?? []) {
      if (definition.kind === Kind.OPERATION_DEFINITION) {
        // @client fields/fragments are resolved locally by Apollo and never sent to the
        // server, so they must be stripped before validating against the server schema
        // (same transform Apollo Client itself applies before issuing the network request).
        const operationDocument = removeClientSetsFromDocument({
          kind: Kind.DOCUMENT,
          definitions: [definition, ...fragments.values()],
        });
        if (operationDocument) {
          validate(schema, operationDocument, VALIDATION_RULES).forEach((error) =>
            errors.push({ file: location ?? 'unknown', message: error.message }),
          );
        }
      }
    }
  }

  if (errors.length > 0) {
    errors.forEach(({ file, message }) => console.error(`${file}\n  ${message}\n`));
    console.error(
      `${errors.length} opération(s) GraphQL incompatible(s) avec le schéma du gateway fourni.\n` +
        "Cela signifie probablement que cette PR dépend d'un changement de schéma pas encore déployé en production.",
    );
    process.exit(1);
  }

  console.log('Toutes les opérations GraphQL sont compatibles avec le schéma du gateway fourni.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
