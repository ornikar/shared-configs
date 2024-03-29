#!/bin/bash

# exit when any command fails
set -e

rm -Rf coverage

if [ -z "$1" ]; then
  yarn test --collectCoverage --watchAll=false
else
  yarn test --collectCoverage --watchAll=false --findRelatedTests $1 --collectCoverageOnlyFrom="$1" --passWithNoTests
fi

open coverage/lcov-report/index.html
