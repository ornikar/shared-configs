# @ornikar/graphql-config

🧬 GraphQL config and checks.

## `ornikar-check-graphql-prod-compat`

Checks that every GraphQL operation of the host repository validates against the schema
of a gateway repository checkout (typically its `master` branch, used as a proxy for
what is actually deployed in production).

This catches PRs that add or update GraphQL operations ahead of the corresponding
gateway change being deployed: such a PR would pass codegen (consistent with the
introspection schema it ships) but break at runtime once released, since production
does not serve the new fields yet.

### Usage

Add `@ornikar/graphql-config` to the repository's devDependencies, then expose a yarn
script wiring the repository-specific globs:

```json
{
  "scripts": {
    "check:graphql-prod-compat": "ornikar-check-graphql-prod-compat --client-schema '@ornikar/learner-apps-shared/src/shared/apollo/typeDefs.ts' --documents './@ornikar/*/src/**/*.ts'"
  }
}
```

Then run it with a checkout of the gateway repository as positional argument:

```sh
git clone --depth 1 --branch master https://github.com/ornikar/learner-gateway.git /tmp/gateway-checkout
yarn check:graphql-prod-compat /tmp/gateway-checkout
```

### Options

| Option                   | Default                      | Description                                                                      |
| ------------------------ | ---------------------------- | -------------------------------------------------------------------------------- |
| `<gateway-checkout-dir>` | (required)                   | Path to a local checkout of the gateway repository                               |
| `--gateway-schema-glob`  | `src/webserver/**/*.graphql` | Glob (relative to the checkout) of the gateway SDL files                         |
| `--client-schema`        | (none, repeatable)           | Path(s) to Apollo Client local typeDefs merged into the schema before validation |
| `--documents`            | `./@ornikar/*/src/**/*.ts`   | Glob(s) of the files containing the GraphQL operations (repeatable)              |

Operations using the Apollo `@client` directive are stripped of their client-only
selections before validation (same transform Apollo Client applies before issuing
network requests), and fragments are resolved globally across all matched documents.

Exits with code 1 (and lists each offending file/operation) when at least one
operation is incompatible with the gateway schema.

### CI

Use the `frontend/check-graphql-prod-compat` job from the `ornikar/frontend-orb`
CircleCI orb, which clones the gateway repository and runs the repository's
`check:graphql-prod-compat` script.

### Peer dependencies

`graphql` and `@apollo/client` are peer dependencies: they are resolved from the host
repository's node_modules.
