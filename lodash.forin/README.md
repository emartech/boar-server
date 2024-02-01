# Patch for lodash.forin

In this [issue](https://github.com/lodash/lodash/issues/5808), we pointed out that `lodash.forin` has several vulnerabilities linked to the version 4.4.0 of `lodash`. These issues were solved in `lodash` since but the maintainers are reluctant to publish a new version of `lodash.forin`.

This 'fake' package uses the latest `lodash` and only exposes the `forin` function as `lodash.forin` would do.

## How to upgrade

1. Change version of `lodash` dependency in `package.json` and `lodash.forin/package.json`
2. Change main version of `lodash.forin/package.json` to match `lodash` version
3. run `npm pack` inside `lodash.forin/`
4. Udpdate the `lodash.forin` dependency in the root `package.json` with :
```text
  "lodash.forin": "file:./lodash.forin/lodash.forin-<lodash version>.tgz"
```
5. Check that `lodash.forin` is properly deduped with `npm list lodash.forin` :
```text
boar-server@ /home/sapdev/git/boar-server
├─┬ koa-pug@5.1.0
│ └── lodash.forin@4.17.21 deduped
└── lodash.forin@4.17.21
```
