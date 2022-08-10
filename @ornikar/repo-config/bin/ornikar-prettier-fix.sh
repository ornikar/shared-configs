#/bin/bash

# exit when any command fails
set -e

prettier --write --no-error-on-unmatched-pattern "$@" . '**/.env*' '**/*.env'
