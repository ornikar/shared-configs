# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [14.2.0](https://github.com/ornikar/shared-configs/compare/@ornikar/monorepo-config@14.1.0...@ornikar/monorepo-config@14.2.0) (2026-01-09)


### Features

* disable TS noEmitOnError [no issue] ([#1147](https://github.com/ornikar/shared-configs/issues/1147)) ([9d694a8](https://github.com/ornikar/shared-configs/commit/9d694a8f0456a2c2faa9eb4658c178ae63fb9f4e))



## [14.1.0](https://github.com/ornikar/shared-configs/compare/@ornikar/monorepo-config@14.0.0...@ornikar/monorepo-config@14.1.0) (2025-10-02)


### Features

* add noUncheckedIndexedAccess to tsconfig geenrator [no issue] ([#1131](https://github.com/ornikar/shared-configs/issues/1131)) ([e112104](https://github.com/ornikar/shared-configs/commit/e11210447cc68bc28d3bf16667d12b09f2a442cc))



## [14.0.0](https://github.com/ornikar/shared-configs/compare/@ornikar/monorepo-config@13.0.0...@ornikar/monorepo-config@14.0.0) (2025-07-10)


### ⚠ BREAKING CHANGES

* upgrade to Node 22 OSE-18334 (#1125)

### Features

* upgrade to Node 22 OSE-18334 ([#1125](https://github.com/ornikar/shared-configs/issues/1125)) ([7b3ccd1](https://github.com/ornikar/shared-configs/commit/7b3ccd13ec1cb1bce776a15f889039e70a47d72e))



## [13.0.0](https://github.com/ornikar/shared-configs/compare/@ornikar/monorepo-config@12.1.0...@ornikar/monorepo-config@13.0.0) (2023-12-20)


### ⚠ BREAKING CHANGES

* node 20 OSE-6084 (#1053)

### Features

* node 20 OSE-6084 ([#1053](https://github.com/ornikar/shared-configs/issues/1053)) ([a86e2ba](https://github.com/ornikar/shared-configs/commit/a86e2bad41fa2469a9b7bfcad8dbaf41224a30e2))



## [12.1.0](https://github.com/ornikar/shared-configs/compare/@ornikar/monorepo-config@12.0.1...@ornikar/monorepo-config@12.1.0) (2023-11-08)


### Features

* **deps:** update dependency @pob/pretty-eslint-config to v5 ([#1013](https://github.com/ornikar/shared-configs/issues/1013)) ([2005434](https://github.com/ornikar/shared-configs/commit/2005434f72851c4c2d174286821cb4cfdf36d6ca))



## [12.0.1](https://github.com/ornikar/shared-configs/compare/@ornikar/monorepo-config@12.0.0...@ornikar/monorepo-config@12.0.1) (2023-10-25)


### Bug Fixes

* dont spreaad pkg in getSyncWorkspaces ([b293c9b](https://github.com/ornikar/shared-configs/commit/b293c9b912d2be5355aa7eebcfe8e8cf19232f0a))



## 12.0.0 (2023-10-25)


### ⚠ BREAKING CHANGES

* monorepo-config rename lerna-config to monrepo-config and reduce lerna dependencies [no issue] (#1000)

### Features

* monorepo-config rename lerna-config to monrepo-config and reduce lerna dependencies [no issue] ([#1000](https://github.com/ornikar/shared-configs/issues/1000)) ([63bab23](https://github.com/ornikar/shared-configs/commit/63bab23fb7f9fd2870cbf4259908afa3fe70e9cd))



## [11.0.0](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@10.0.1...@ornikar/lerna-config@11.0.0) (2023-10-24)


### ⚠ BREAKING CHANGES

* **lerna-config:** remove publish command [no issue] (#975)

### Features

* **lerna-config:** remove publish command [no issue] ([#975](https://github.com/ornikar/shared-configs/issues/975)) ([f205d16](https://github.com/ornikar/shared-configs/commit/f205d1680bcb8b025436d0bc0e6a05dbd5cbab83))



## [10.0.1](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@10.0.0...@ornikar/lerna-config@10.0.1) (2023-10-24)


### Bug Fixes

* **lerna-config:** add missing new line in generated package.json ([4873b94](https://github.com/ornikar/shared-configs/commit/4873b945eda92abfc7ac06362c1d6d937729375f))



## [10.0.0](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@9.4.0...@ornikar/lerna-config@10.0.0) (2023-09-27)


### ⚠ BREAKING CHANGES

* **rollup-config:** requires node 18 and requires to update exports as dist path changed 

### Features

* **rollup-config:** update to node 18 ECF-281 ([#979](https://github.com/ornikar/shared-configs/issues/979)) ([26eaaf9](https://github.com/ornikar/shared-configs/commit/26eaaf9db689de9ec474919881ce87784427cc5c))



## [9.4.0](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@9.3.0...@ornikar/lerna-config@9.4.0) (2023-09-07)


### Features

* **lerna-config:** disable emit declaration cache when tsconfig has no references [no issue] ([#962](https://github.com/ornikar/shared-configs/issues/962)) ([a032a89](https://github.com/ornikar/shared-configs/commit/a032a89052d1d028202c11e2d7a18d29bd6d0a4b))


### Bug Fixes

* **lerna-config:** fix generate tsconfig issues for applications ([dc776dc](https://github.com/ornikar/shared-configs/commit/dc776dcc6a621742f54188455c708f1e20621306))
* **lerna-config:** tsconfig generation without baseurl [no issue] ([#957](https://github.com/ornikar/shared-configs/issues/957)) ([8296543](https://github.com/ornikar/shared-configs/commit/829654304798c85cf1219194b228748a7154eef8))



## [9.3.0](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@9.2.0...@ornikar/lerna-config@9.3.0) (2023-07-19)


### Features

* **lerna-config:** generate tsconfig module detection to force [no issue] ([#941](https://github.com/ornikar/shared-configs/issues/941)) ([955993b](https://github.com/ornikar/shared-configs/commit/955993bec520479b2f3df0f2f7af22e6103b8840))



## [9.2.0](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@9.1.0...@ornikar/lerna-config@9.2.0) (2023-07-05)


### Features

* **deps:** update dependency conventional-changelog-conventionalcommits to v6 ([#924](https://github.com/ornikar/shared-configs/issues/924)) ([8225adc](https://github.com/ornikar/shared-configs/commit/8225adc81712f4b1a608f66889a4f3043668025c))
* **lerna-config:** add script update-peer-dependencies ([5c5ee50](https://github.com/ornikar/shared-configs/commit/5c5ee50e4b56979fafdc630979129561bd67c483))



# [9.1.0](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@9.0.1...@ornikar/lerna-config@9.1.0) (2023-03-24)


### Features

* **lerna-config:** add explicit conventional-changelog-conventionalcommits dependency [no issue] ([#868](https://github.com/ornikar/shared-configs/issues/868)) ([98381bb](https://github.com/ornikar/shared-configs/commit/98381bba994080fd913bbdb7aa83fe006c5ecede))





## [9.0.1](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@9.0.0...@ornikar/lerna-config@9.0.1) (2022-11-29)

**Note:** Version bump only for package @ornikar/lerna-config





# [9.0.0](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@8.0.0...@ornikar/lerna-config@9.0.0) (2022-11-03)


### Features

* **deps:** update dependency @pob/pretty-eslint-config to v3 ([#725](https://github.com/ornikar/shared-configs/issues/725)) ([89ccd7d](https://github.com/ornikar/shared-configs/commit/89ccd7da52c277e3e49180530e9de50c4dcbf524))
* **lerna-config:** integrate lerna cli in lerna-config ARCH-1591 ([#801](https://github.com/ornikar/shared-configs/issues/801)) ([e1f1771](https://github.com/ornikar/shared-configs/commit/e1f17719e2b925de915990cafa94dd4819ed32d5))


### BREAKING CHANGES

* **lerna-config:** requires to remove direct lerna in devDependencies 





# [8.0.0](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@7.0.1...@ornikar/lerna-config@8.0.0) (2022-10-28)


### Features

* **lerna-config:** integrate lerna cli in lerna-config ARCH-1591 ([#789](https://github.com/ornikar/shared-configs/issues/789)) ([07853d5](https://github.com/ornikar/shared-configs/commit/07853d50662d516a0b03f3e0ad38f7e090f433ab))


### Reverts

* feat(lerna-config): integrate lerna cli in lerna-config ARCH-1591 ([#791](https://github.com/ornikar/shared-configs/issues/791)) ([7679cf4](https://github.com/ornikar/shared-configs/commit/7679cf4ca3a3e58d6875dc9ef05762799b7f6ba0))


### BREAKING CHANGES

* **lerna-config:** requires to remove direct lerna in devDependencies 





## [7.0.1](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@7.0.0...@ornikar/lerna-config@7.0.1) (2022-09-21)

**Note:** Version bump only for package @ornikar/lerna-config





# [7.0.0](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@6.4.1...@ornikar/lerna-config@7.0.0) (2022-08-17)


### chore

* **deps:** update dependency @ornikar/eslint-config to v19 ([#759](https://github.com/ornikar/shared-configs/issues/759)) ([e05eecb](https://github.com/ornikar/shared-configs/commit/e05eecb898d047b44277ce4f65fc724831bb2ece))


### BREAKING CHANGES

* **deps:** drop node 14 





## [6.4.1](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@6.4.0...@ornikar/lerna-config@6.4.1) (2022-08-09)


### Bug Fixes

* fix isLegacyRootDirDot test ([4448062](https://github.com/ornikar/shared-configs/commit/4448062f68ab4673335504ec76414920714de7f8))





# [6.4.0](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@6.3.6...@ornikar/lerna-config@6.4.0) (2022-08-05)


### Features

* **lerna-config:** adapt generator for legacy project [no issue] ([#757](https://github.com/ornikar/shared-configs/issues/757)) ([00d8bbf](https://github.com/ornikar/shared-configs/commit/00d8bbf0d8236d99e5fe91734d4a265a11252d88))





## [6.3.6](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@6.3.5...@ornikar/lerna-config@6.3.6) (2022-06-21)


### Bug Fixes

* **lerna-config:** eslint generator root package in monorepo ARCH-1507 ([#730](https://github.com/ornikar/shared-configs/issues/730)) ([88d2ba6](https://github.com/ornikar/shared-configs/commit/88d2ba6f0ca507c6c007b4aff9fbdb8b23163cef))
* **lerna-config:** fix tsconfig generation when no tsconfig exists [no issue] ([#732](https://github.com/ornikar/shared-configs/issues/732)) ([6eef413](https://github.com/ornikar/shared-configs/commit/6eef4132d879b0ce1cbdb7768f452f886e8517bb))





## [6.3.5](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@6.3.4...@ornikar/lerna-config@6.3.5) (2022-06-20)

**Note:** Version bump only for package @ornikar/lerna-config





## [6.3.4](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@6.3.3...@ornikar/lerna-config@6.3.4) (2022-03-08)

**Note:** Version bump only for package @ornikar/lerna-config





## [6.3.3](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@6.3.2...@ornikar/lerna-config@6.3.3) (2022-02-14)


### Bug Fixes

* **lerna-config:** fix tsconfig generator with non-ts packages ([6e58239](https://github.com/ornikar/shared-configs/commit/6e5823924a26827d83360ec9c207ed836d1f41b3))





## [6.3.2](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@6.3.1...@ornikar/lerna-config@6.3.2) (2022-02-14)


### Bug Fixes

* **lerna-config:** fix eslint by not using tsc cache [no issue] ([#655](https://github.com/ornikar/shared-configs/issues/655)) ([e60b5b1](https://github.com/ornikar/shared-configs/commit/e60b5b173dd69cf0bb75d05f66e58e29c3b7efc1))





## [6.3.1](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@6.3.0...@ornikar/lerna-config@6.3.1) (2022-02-11)


### Bug Fixes

* **lerna-config:** tsBuildInfoFile path ([3f41ec4](https://github.com/ornikar/shared-configs/commit/3f41ec46993487e8a30624fd8aceb303476c1f04))





# [6.3.0](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@6.2.2...@ornikar/lerna-config@6.3.0) (2022-02-11)


### Features

* **lerna-config:** store tsc cache in monorepo node_modules [no issue] ([#653](https://github.com/ornikar/shared-configs/issues/653)) ([25dcc33](https://github.com/ornikar/shared-configs/commit/25dcc33743d4ddc3b2a8f776fb988d3f1dc3990b))





## [6.2.2](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@6.2.1...@ornikar/lerna-config@6.2.2) (2022-02-10)


### Bug Fixes

* add missing baseUrl in tsconfig ([9ebd397](https://github.com/ornikar/shared-configs/commit/9ebd39703ba058c7d1503216a5e830c2a319f00d))





## [6.2.1](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@6.2.0...@ornikar/lerna-config@6.2.1) (2022-02-10)


### Bug Fixes

* **lerna-config:** sort references ([17221d5](https://github.com/ornikar/shared-configs/commit/17221d5db7bb2e6c2738d903d087669aa2dafd78))





# [6.2.0](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@6.1.2...@ornikar/lerna-config@6.2.0) (2022-02-09)


### Features

* **lerna-config:** update tsconfig generator [no issue] ([#646](https://github.com/ornikar/shared-configs/issues/646)) ([42965f9](https://github.com/ornikar/shared-configs/commit/42965f969c395db4e38c95f2ba40197ec5345385))





## [6.1.2](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@6.1.1...@ornikar/lerna-config@6.1.2) (2022-02-04)

**Note:** Version bump only for package @ornikar/lerna-config





## [6.1.1](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@6.1.0...@ornikar/lerna-config@6.1.1) (2022-02-02)


### Bug Fixes

* **lerna-config:** fix package order in graph packages ([8126db8](https://github.com/ornikar/shared-configs/commit/8126db89bbe23950f8509c0e98feb5acb84c2d2b))





# [6.1.0](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@6.0.0...@ornikar/lerna-config@6.1.0) (2022-01-14)


### Features

* **lerna-config:** get sync packages [no issue] ([#622](https://github.com/ornikar/shared-configs/issues/622)) ([5bf2f6f](https://github.com/ornikar/shared-configs/commit/5bf2f6f03ce53bb5461d63a0cf30750a5194f3ae))





# [6.0.0](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@5.1.3...@ornikar/lerna-config@6.0.0) (2022-01-07)


### Features

* **lerna-config:** use react-jsx in tsconfig [no issue] ([#619](https://github.com/ornikar/shared-configs/issues/619)) ([2fc4e5e](https://github.com/ornikar/shared-configs/commit/2fc4e5e8b5c36ada22791d6031231c9c4f3dea7b))


### BREAKING CHANGES

* **lerna-config:** requires to reapply manually lerna-config generators 





## [5.1.3](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@5.1.2...@ornikar/lerna-config@5.1.3) (2021-12-20)


### Bug Fixes

* **lerna-config:** write json using prettier ([33421cc](https://github.com/ornikar/shared-configs/commit/33421cce9b4724aec8b5b1a6a60f9f9008766338))





## [5.1.2](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@5.1.1...@ornikar/lerna-config@5.1.2) (2021-12-20)


### Bug Fixes

* **lerna-config:** allow library to self import [no issue] ([#609](https://github.com/ornikar/shared-configs/issues/609)) ([0603f32](https://github.com/ornikar/shared-configs/commit/0603f32e674a50b7d446734a7f92b91e69e31c11))
* **lerna-config:** sort packages to prevent random changes [no issue] ([#604](https://github.com/ornikar/shared-configs/issues/604)) ([c031cfe](https://github.com/ornikar/shared-configs/commit/c031cfe0db76ac38d1a977eb88086905c2059ccc))





## [5.1.1](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@5.1.0...@ornikar/lerna-config@5.1.1) (2021-12-14)


### Reverts

* feat(deps): update dependency @pob/pretty-eslint-config to v3 ([#600](https://github.com/ornikar/shared-configs/issues/600)) ([adf27e8](https://github.com/ornikar/shared-configs/commit/adf27e800405ac1c3e39f75370907507ac2a58a2))





# [5.1.0](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@5.0.2...@ornikar/lerna-config@5.1.0) (2021-12-14)


### Features

* **deps:** update dependency @pob/pretty-eslint-config to v3 ([#600](https://github.com/ornikar/shared-configs/issues/600)) ([e861979](https://github.com/ornikar/shared-configs/commit/e8619796a127676f4460a517ff52bf5449f1104c))





## [5.0.2](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@5.0.1...@ornikar/lerna-config@5.0.2) (2021-12-10)


### Bug Fixes

* **lerna-config:** support empty entries in generators [no issue] ([#597](https://github.com/ornikar/shared-configs/issues/597)) ([6a6cdb2](https://github.com/ornikar/shared-configs/commit/6a6cdb2dd55e02676b9ff9757ec922cd2c0d3c60))





## [5.0.1](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@5.0.0...@ornikar/lerna-config@5.0.1) (2021-12-09)


### Bug Fixes

* downgrade node minimum required version [no issue] ([#595](https://github.com/ornikar/shared-configs/issues/595)) ([9464687](https://github.com/ornikar/shared-configs/commit/9464687f55aed4a2e683f5d3b992300d000a2b30))





# [5.0.0](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@4.0.0...@ornikar/lerna-config@5.0.0) (2021-12-07)


### Bug Fixes

* **lerna-config:** dont add dep path in rootDirs [no issue] ([#591](https://github.com/ornikar/shared-configs/issues/591)) ([8e0b197](https://github.com/ornikar/shared-configs/commit/8e0b197c2d87442360bcf536dbe79aeee7a623b7))


### BREAKING CHANGES

* **lerna-config:** requires to manually run generator and commit tsconfig files 





# [4.0.0](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@3.2.5...@ornikar/lerna-config@4.0.0) (2021-12-07)


### Features

* drop node 12 [no issue] ([#584](https://github.com/ornikar/shared-configs/issues/584)) ([e9c00ab](https://github.com/ornikar/shared-configs/commit/e9c00abb5ed3a9c60993b6c652566dd7e71a97e1))


### BREAKING CHANGES

* requires node 14.17 or higher 





## [3.2.5](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@3.2.4...@ornikar/lerna-config@3.2.5) (2021-12-06)


### Bug Fixes

* **lerna-config:** match with rollup-config to determine when to build with rollup, using package.private [no issue] ([#580](https://github.com/ornikar/shared-configs/issues/580)) ([c0ca8fc](https://github.com/ornikar/shared-configs/commit/c0ca8fcf0e0e1fc7844762682ba5cedf3cc2bc33))





## [3.2.4](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@3.2.3...@ornikar/lerna-config@3.2.4) (2021-12-06)


### Bug Fixes

* **lerna-config:** allow apps and examples to extends from something else [no issue] ([#578](https://github.com/ornikar/shared-configs/issues/578)) ([cd71e75](https://github.com/ornikar/shared-configs/commit/cd71e7516372d40c894365e6ec64beaf5f7c3d18))





## [3.2.3](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@3.2.2...@ornikar/lerna-config@3.2.3) (2021-12-06)


### Bug Fixes

* **lerna-config:** add missing stories files in tsconfig.build.json [no issue] ([#574](https://github.com/ornikar/shared-configs/issues/574)) ([48c98e4](https://github.com/ornikar/shared-configs/commit/48c98e4d3c2979231291777ac2ae3c16f30b178d))
* **lerna-config:** tsconfig allow 'react-native', 'react-jsx', 'preserve' and go back to 'preserve' by default MB2C-102 ([#576](https://github.com/ornikar/shared-configs/issues/576)) ([2961280](https://github.com/ornikar/shared-configs/commit/29612805805a84536ade3b9da79423c2cddf1aef))





## [3.2.2](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@3.2.1...@ornikar/lerna-config@3.2.2) (2021-11-30)


### Bug Fixes

* **lerna-config:** sort packages [no issue] ([#551](https://github.com/ornikar/shared-configs/issues/551)) ([5c0cb86](https://github.com/ornikar/shared-configs/commit/5c0cb86656eee3fbfde984c054b3548d5e38d7e7))





## [3.2.1](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@3.2.0...@ornikar/lerna-config@3.2.1) (2021-11-29)


### Bug Fixes

* **lerna-config:** dont add paths in tsconfig for private packages [no issue] ([#544](https://github.com/ornikar/shared-configs/issues/544)) ([b11c2d5](https://github.com/ornikar/shared-configs/commit/b11c2d508549ec5183a2f60c4d2c9974621b6ec5))





# [3.2.0](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@3.1.1...@ornikar/lerna-config@3.2.0) (2021-11-29)


### Features

* **lerna-config:** support monorepo with apps or examples [no issue] ([#542](https://github.com/ornikar/shared-configs/issues/542)) ([540afc4](https://github.com/ornikar/shared-configs/commit/540afc4c97e5d76dd915531be835f30ad82519ba))
* **lerna-config:** support react 17 [no issue] ([#541](https://github.com/ornikar/shared-configs/issues/541)) ([1b7eea4](https://github.com/ornikar/shared-configs/commit/1b7eea41f5cfb5219dea12d5abcfbfcdc3a82376))





## [3.1.1](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@3.1.0...@ornikar/lerna-config@3.1.1) (2021-09-07)


### Reverts

* feat(deps): update dependency @pob/pretty-eslint-config to v2 [no issue] ([#513](https://github.com/ornikar/shared-configs/issues/513)) ([c52e12c](https://github.com/ornikar/shared-configs/commit/c52e12cc0ae8f9946c8574875ca9bd8f46a14377))





# [3.1.0](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@3.0.1...@ornikar/lerna-config@3.1.0) (2021-09-07)


### Bug Fixes

* **@ornikar/lerna-config:** support private package with react [no issue] ([#512](https://github.com/ornikar/shared-configs/issues/512)) ([76f548a](https://github.com/ornikar/shared-configs/commit/76f548a84f03fcba69735e5ddbc7989a5e7a79c9))


### Features

* **deps:** update dependency @pob/pretty-eslint-config to v2 ([#508](https://github.com/ornikar/shared-configs/issues/508)) ([c15d965](https://github.com/ornikar/shared-configs/commit/c15d9650d0ec4beb76eb54a4fd35c82a10f014ea))





## [3.0.1](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@3.0.0...@ornikar/lerna-config@3.0.1) (2021-05-04)

**Note:** Version bump only for package @ornikar/lerna-config





# [3.0.0](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@2.3.3...@ornikar/lerna-config@3.0.0) (2021-05-03)


### Features

* **lerna-config:** remove @ornikar/eslint-config-typescript when @ornikar/eslint-config-typescript-react is present [no issue] ([#476](https://github.com/ornikar/shared-configs/issues/476)) ([49e3ad4](https://github.com/ornikar/shared-configs/commit/49e3ad4f20f7fa3a445cfa5a134804f59e859742))


### BREAKING CHANGES

* **lerna-config:** requires eslint 7





## [2.3.3](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@2.3.2...@ornikar/lerna-config@2.3.3) (2021-04-09)

**Note:** Version bump only for package @ornikar/lerna-config





## [2.3.2](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@2.3.1...@ornikar/lerna-config@2.3.2) (2021-03-12)


### Bug Fixes

* **lerna-config:** eslintrc generator fix prettier config [no issue] ([#468](https://github.com/ornikar/shared-configs/issues/468)) ([fb0e0e0](https://github.com/ornikar/shared-configs/commit/fb0e0e095135404bf152335cf428ca5adccc6784))





## [2.3.1](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@2.3.0...@ornikar/lerna-config@2.3.1) (2021-03-05)


### Bug Fixes

* lerna 4 support ([71fe915](https://github.com/ornikar/shared-configs/commit/71fe915bb0fa3815892dee1287a5fa1a58380eb2))





# [2.3.0](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@2.2.0...@ornikar/lerna-config@2.3.0) (2021-02-09)


### Features

* **lerna-config:** generate eslintrc config files ARCH-826 ([#457](https://github.com/ornikar/shared-configs/issues/457)) ([f412489](https://github.com/ornikar/shared-configs/commit/f4124895ed15b48519826b16ed515207be97b41c))





# [2.2.0](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@2.1.1...@ornikar/lerna-config@2.2.0) (2021-01-27)


### Bug Fixes

* **lerna-config:** fix dont create unecessary graph [no issue] ([#448](https://github.com/ornikar/shared-configs/issues/448)) ([05d3b49](https://github.com/ornikar/shared-configs/commit/05d3b4999d53a1afd6c9df4a4be56bae7a5d33de))


### Features

* require node 12 fist lts [no issue] ([#449](https://github.com/ornikar/shared-configs/issues/449)) ([b8e612b](https://github.com/ornikar/shared-configs/commit/b8e612bc7e0573fd52023f8eea78e95e321567e5))





## [2.1.1](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@2.1.0...@ornikar/lerna-config@2.1.1) (2020-07-10)

**Note:** Version bump only for package @ornikar/lerna-config





# [2.1.0](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@2.0.1...@ornikar/lerna-config@2.1.0) (2020-05-25)


### Features

* support node 12.16.1 for renovate [no issue] ([#383](https://github.com/ornikar/shared-configs/issues/383)) ([77c0ef4](https://github.com/ornikar/shared-configs/commit/77c0ef4))





## [2.0.1](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@2.0.0...@ornikar/lerna-config@2.0.1) (2020-04-29)


### Bug Fixes

* tsconfig generator ([#366](https://github.com/ornikar/shared-configs/issues/366)) ([ad3b863](https://github.com/ornikar/shared-configs/commit/ad3b863))





# [2.0.0](https://github.com/ornikar/shared-configs/compare/@ornikar/lerna-config@1.0.0...@ornikar/lerna-config@2.0.0) (2020-04-21)


### Features

* update node version to 12 [no issue] ([#354](https://github.com/ornikar/shared-configs/issues/354)) ([6276917](https://github.com/ornikar/shared-configs/commit/6276917))


### BREAKING CHANGES

* node version

* Update config.yml





# 1.0.0 (2020-01-22)


### Features

* add lerna config [no issue] ([#302](https://github.com/ornikar/shared-configs/issues/302)) ([525c4ff](https://github.com/ornikar/shared-configs/commit/525c4ff))
