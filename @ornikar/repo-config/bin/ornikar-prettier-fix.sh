#/bin/bash

# exit when any command fails
set -e

prettier --write .
yarn prettier --parser dot-properties --key-separator '=' --no-single-quote --write '**/.env*'
