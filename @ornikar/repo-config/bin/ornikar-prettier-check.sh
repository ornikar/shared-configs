#/bin/bash

# exit when any command fails
set -e

prettier --check .
prettier --parser dot-properties --key-separator '=' --no-single-quote --check '**/.env*'
