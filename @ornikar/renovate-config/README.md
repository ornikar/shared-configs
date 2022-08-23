# @ornikar/renovate-config

Shared configuration for [renovate](https://renovatebot.com/) github bot.

# Installation in your repository

First, make sure renovate has access to the repository.
Then, create the configuration file (don't merge the renovate PR adding this file) :

## If it's an app

> renovate.json

```json
{
  "extends": ["config:js-app", "@ornikar"]
}
```

## If it's a library or monorepo library

> renovate.json

```json
{
  "extends": ["config:js-lib", "@ornikar"]
}
```
