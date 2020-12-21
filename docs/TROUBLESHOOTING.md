# Troubleshooting

## Something is broken and I don't know what is going on

First ensure that you followed all steps outlined in our [installation guidelines](./INSTALLATION.md). Next execute the following script to attempt to fix the local development environment.

```bash
./build/upgrade-nodejs
```

Everything fine now? Great! Still borked? Ping `#tech-ui-dev` on Slack with the full command line output!

## The Pre-Commit Hook Will Not Let Me Commit

Please do not use `--no-verify` or `-n` to commit. In a lot of cases, this will create issues for other developers (broken Jenkins build, other people cannot commit due to issues introduced by your unchecked commit).

1. If the error message indicates a linting problem or a unit test issue, fix that issue. If you do not know how to fix it, ask for help in #tech-ui-dev.
1. If there is a different error, you might check/try three other things:
    1. Has the Node.js version for the repo `ui-client` been changed recently (since you last committed something without issues)? Check `git log .nvmrc` to find out. Refer to the section [Upgrading Node.js](#upgrading-nodejs) for details on how to switch to the new Node.js version.
    1. Are you using a different Node.js version than the `ui-client` repo? Check the output of `node --version` versus the content of `ui-client/.nvmrc`. You can execute `nvm use` (in the `ui-client` directory) to switch to the correct version.
    1. Execute `yarn` in the `ui-client` directory, without any arguments. This helps when new dependencies have been added that have not been installed to your local `node_modules` folder. It is safe to do this even when your `node_modules` are up to date.

## Problem with pngquant on Ubuntu?

In case you are using e.g. Ubuntu and installing `pngquant` is making troubles like `npm ERR! Failed at the pngquant-bin@4.0.0 postinstall script.`, try to do the following:

1. Ensure libpng-dev is installed:

```
$ apt-get install libpng-dev`
```

2. On Ubuntu, you even might need to install `libpng12`:

```
$ wget -q -O /tmp/libpng12.deb http://mirrors.kernel.org/ubuntu/pool/main/libp/libpng/libpng12-0_1.2.54-1ubuntu1_amd64.deb \
    && sudo dpkg -i /tmp/libpng12.deb \
    && rm /tmp/libpng12.deb
```

## I cannot access the local development domain in Chrome due to HSTS!

While we do not use certificate pinning, Chromium became even more strict as of late (February 2016). Chrome will add `*.instana.io` to its custom rule HSTS list upon visiting `instana.io`. The only solution right now is to disable this entry via [chrome://net-internals/#hsts](chrome://net-internals/#hsts). Type in the domain `instana.io` and hit the delete button.

## I cannot access the local development domain in Firefox due to HSTS!

Similar to the Chrome topic above, but slightly different process to remove the HSTS entry. Open the file called `SiteSecurityServiceState.txt` and remove the line for the domain `instana.io`. On Mac OS, this file is located within the `~/Library/Application Support/Firefox` directory. To find the file, use `find`. Example:

```
# ben at bripkens in ~/Library/Application Support/Firefox
$ find . -name "SiteSecurityServiceState.txt"
./Profiles/z30fu953.default/SiteSecurityServiceState.txt
```

## Instana dev extensions are saying that no stores could be found

This most likely occurs due to stores which contain cyclic object structures and therefore cannot be JSON serialized. To find out which store is breaking the dev extensions, run the following JavaScript snippet in the developer console.

```javascript
Object.keys(instana.dev.storeStates).forEach(key => {
  try {
    JSON.stringify(instana.dev.storeStates[key]);
  } catch (e) {
    console.error('Store "%s" cannot be JSON serialized', key);
  }
});
```

## How can I get a list of metrics?

You can get a list of metrics per entity via `yarn run generateMetricOverview`. This will execute a test which writes the metrics to files in the CWD. Note that this list is not extensive. For instance, it does not include dynamic metric names such as file system capacity or CPU 1 usage.

The generated files' names are `metricOverview*`.

