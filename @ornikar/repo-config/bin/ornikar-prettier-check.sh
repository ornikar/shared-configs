#/bin/bash

# exit when any command fails
set -e

prettier --check --no-error-on-unmatched-pattern "$@" . '**/.env*' '**/*.env'
