import { createCheckPackageWithWorkspaces } from 'check-package-dependencies';

await createCheckPackageWithWorkspaces()
  .checkRecommended({
    isLibrary: () => true,
    onlyWarnsForInMonorepoPackagesDependencies: {
      '@ornikar/babel-preset-kitt-universal': {
        'babel-plugin-styled-components': {
          // dont need to install styled-components in this config package
          missingPeerDependency: ['styled-components'],
        },
      },

      '@ornikar/jest-config-react-native': {
        '@testing-library/react-native': {
          // dont need to install react-native in this config package
          missingPeerDependency: ['react-native'],
        },
      },
    },
  })
  .run();
