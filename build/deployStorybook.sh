#!/usr/bin/env bash

set -euo pipefail

rm -rf storybookTarget
yarn run storybookBuild
GIT_REV="$(git rev-parse HEAD)"
git remote set-branches --add origin gh-pages
git fetch origin gh-pages --depth=1
git checkout gh-pages --force
rm -rf docs
mv ./storybookTarget ./docs
git add docs
git commit -m "docs: update playground to $GIT_REV" --no-verify
git push origin gh-pages
