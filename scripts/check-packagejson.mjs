import { createCheckPackageWithWorkspaces } from 'check-package-dependencies';

await createCheckPackageWithWorkspaces({
  isLibrary: () => true,
})
  .checkRecommended({
    onlyWarnsForInMonorepoPackagesDependencies: {
      '@ornikar/babel-preset-kitt-universal': {
        'babel-plugin-styled-components': {
          // dont need to install styled-components in this config package
          missingPeerDependency: ['styled-components'],
        },
      },
      '@ornikar/jest-config-react-native': {
        'jest-expo': {
          duplicateDirectDependency: ['react-test-renderer'],
        },
      },
    },
  })
  .run();
