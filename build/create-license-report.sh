#!/usr/bin/env bash

set -eo pipefail

cd `dirname $BASH_SOURCE`/..

# We can use this once our changes to license-ls are merged.
licensels="npx license-ls"

# For now, we use a modified version.
licensels="npx github:basti1302/license-ls#extend-report"

# Temporarily delete symbolic links to internal packages to exclude those from license-ls lookup algorithm.
echo "removing symbolic links to internal packages"
find node_modules -type l -depth 1 -delete

echo "creating license report for client"
$licensels --prod --format csv --include name,version,licenseIdWithoutVersion,licenseVersion,copyrightHolder,copyrightYear,licenseLink > ui-client-license-report.csv

# Recreate symbolic links in node_modules.
echo "recreating symbolic links"
./build/postInstall

pushd packages/in-server > /dev/null
echo "creating license report for server"
$licensels --prod --format csv --include name,version,licenseIdWithoutVersion,licenseVersion,copyrightHolder,copyrightYear,licenseLink > ../../ui-server-license-report.csv

popd > /dev/null

