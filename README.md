# 🚀 ui-client 🏂 &nbsp; [![Component Catalog](https://img.shields.io/badge/component-catalog-brightgreen.svg)](http://storybook.instana.io/7550eeca-f0eb-4039-b87a-c3fbd0d2eaad/develop/)

<!-- toc -->

- [Getting Started](#getting-started)
  * [Installation of required software](#installation-of-required-software)
    + [Node.js and Yarn](#nodejs-and-yarn)
    + [Nginx](#nginx)
    + [Additional UI Engineer Software](#additional-ui-engineer-software)
  * [Setting up local domains](#setting-up-local-domains)
  * [Executing tasks](#executing-tasks)
- [Branching Model](#branching-model)
- [Code Style](#code-style)
  * [Simon Sort](#simon-sort)
- [Upgrading Node.js](#upgrading-nodejs)
- [Troubleshooting](#troubleshooting)
  * [I cannot access the local development domain in Chrome due to HSTS!](#i-cannot-access-the-local-development-domain-in-chrome-due-to-hsts)
  * [I cannot access the local development domain in Firefox due to HSTS!](#i-cannot-access-the-local-development-domain-in-firefox-due-to-hsts)
  * [Instana dev extensions are saying that no stores could be found](#instana-dev-extensions-are-saying-that-no-stores-could-be-found)
  * [How can I get a list of metrics?](#how-can-i-get-a-list-of-metrics)
  * [I am getting flow type checking errors even though everything should be fine?](#i-am-getting-flow-type-checking-errors-even-though-everything-should-be-fine)

<!-- tocstop -->

## Getting Started
You need to have Node.js installed in order to execute the build, tests and the development mode. OS X and Linux users should install Node.js via the
[Node Version Manager](https://github.com/creationix/nvm) (NVM). NVM makes it easy to switch between installed Node.js versions and allows installation of global modules without super-user privileges.

### Installation of required software

#### Node.js and Yarn
Make sure that you have Git and cURL installed before starting with the following instructions. Execute the instructions in the root directory of the ui-client project.

```
# ensure that you have build and compiler tools available on your system:
# ubuntu
sudo apt-get install build-essential
# os x
xcode-select --install

# download and install NVM
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | bash

# reload bash
bash

# install and use the project's preferred Node.js and Yarn version
./build/upgrade-nodejs
```

#### Nginx
You will also need to have Nginx installed and its CLI on the path. Instructions can be found in the [proxrox repository](https://github.com/bripkens/proxrox/blob/master/INSTALLATION.md#installation-of-nginx).

As alternative (especially for Linux), you might use the `nginx` script as provided in the [internal-tools repository](https://github.com/instana/internal-tools/tree/master/proxrox-nginx), which will run Nginx as Docker container.

#### Additional UI Engineer Software
So, you are a UI engineer? Then you will also need the following awesome software for your awesome work!

 - [Chrome Extension](https://github.com/instana/internal-tools/tree/master/chrome-browser-extension): We have our own Chrome dev tools extension which allows insights into the state of our global stores.
 - [Sketch](https://www.sketchapp.com/): This is our tool of choice for mockups and designs. You have to hit the `Free Trial` button to download it. You can get a license from Michael Krumm (just ask via Slack).
 - [SFPro font](https://developer.apple.com/fonts/downloads/SFPro.zip): This is the default MacOS system font that we are using in our product. Unfortunately, this font can only be used in Sketch when installed separately.


### Setting up local domains
In order for cookies to be send to the backend you need to configure a rule in `/etc/hosts` to route all traffic for `local-instana.instana.io` to `127.0.0.1`. Only access the local development environment using this domain.

```
sudo sh -c 'echo "127.0.0.1 local-instana.instana.io" >> /etc/hosts'
```

### Executing tasks
Tasks are defined in the `package.json`. They can be executed via `yarn run <taskname>`. For instance `yarn run test` (or `yarn test`) to execute the tests, `yarn run dev` to start up a proxy and development server or `yarn run build` to build the JavaScript files.

For regular UI development, you need to execute `yarn run dev`. The development server will ask you several questions about development server settings. When in doubt, use the defaults, i.e. always hit `return` to accept the defaults.

On Linux, it might be required to do the following to allow `yarn` to run the ngnix-docker container without sudo:
```
sudo groupadd docker
sudo gpasswd -a $USER docker
newgrp docker
```

## Branching Model
We are using the [Git flow](http://nvie.com/posts/a-successful-git-branching-model/) branching model in ui-client.

## Code Style
Most code style rules are checked by linters, also, code formatting is applied by prettier. Linters and prettier are run automatically by a pre-commit hook on all files which have staged changes. If possible, you should configure your IDE/Editor to run prettier on all files when saving the file.

*CAUTION:* If you use `git add --patch` to only commit a subset of a file's changes while keeping excluding other changes in the same file from the commit by not adding them, the pre-commit hook will still add the whole file with all changes, so that won't work.
We have a style rule (called Simon-sort) that says imports are to be ordered.

### Simon Sort
There is one style rule that is not automatically enforced or taken care of (yet): _Simon sort_. This is our rule on how to sort imports in ES6 files. We split all imports into three blocks (not all three blocks are present in each file):

1. Third party imports (React, Lodash, ...) first, then
1. Instana imports (everything from one of the packages in `ui-client/packages/`, and finally
1. CSS/LESS imports (all `*.less` and `*.mless` files).

These blocks are separated by a new line. The first import block usually starts at the first line of the file (that is, there is nothing else above the imports).

The imports in one block are *sorted by line length, descending*. Longest import line at the top, shortest line at the bottom.

Basically, this is our (totally arbitrary, but at least consistent) rule for sorting imports. The main reason it was chosen is that it can be verified very quickly visually without inspecting the individual imports.

Here is an example of some imports, correctly simon-sorted:

```
import { get } from 'lodash';
import React from 'react';

import TreeHeader from 'in-analyze/TraceDetail/components/CallTree/components/TreeHeader';
import LoadingCallTree from 'in-analyze/TraceDetail/components/CallTree/LoadingCallTree';
import ErroneousResultPresenter from 'in-new-components/ErroneousResultPresenter';
import Row from 'in-analyze/TraceDetail/components/CallTree/components/Row';
import createScale from 'in-charts/scale';
import { getStart, getEnd } from 'in-analyze/TraceDetail/components/callStartAndEndTime';

import locals from './CallTree.mless';

export default function CallTree({
  ...
```

## Upgrading Node.js
From time to time we are upgrading the Node.js version that we are using for build of the `ui-client` as well as for the `in-server`. Node.js upgrades have been automated. Simply execute the following command in the root of the project to automatically upgrade your Node.js version via NVM.

```
./build/upgrade-nodejs
```

Once executed, verify that it was successful via the usual `yarn run test`.

## Troubleshooting

### I cannot access the local development domain in Chrome due to HSTS!
While we do not use certificate pinning, Chromium became even more strict as of late (February 2016). Chrome will add `*.instana.io` to its custom rule HSTS list upon visiting `instana.io`. The only solution right now is to disable this entry via [chrome://net-internals/#hsts](chrome://net-internals/#hsts). Type in the domain `instana.io` and hit the delete button.

### I cannot access the local development domain in Firefox due to HSTS!
Similar to the Chrome topic above, but slightly different process to remove the HSTS entry. Open the file called `SiteSecurityServiceState.txt` and remove the line for the domain `instana.io`. On Mac OS, this file is located within the `~/Library/Application Support/Firefox` directory. To find the file, use `find`. Example:

```
# ben at bripkens in ~/Library/Application Support/Firefox
$ find . -name "SiteSecurityServiceState.txt"
./Profiles/z30fu953.default/SiteSecurityServiceState.txt
```

### Instana dev extensions are saying that no stores could be found
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

### How can I get a list of metrics?
You can get a list of metrics per entity via `yarn run generateMetricOverview`. This will execute a test which prints the metrics to `stdout`. Note that this list is not extensive. For instance, it does not include dynamic metric names such as file system capacity or CPU 1 usage.

### I am getting flow type checking errors even though everything should be fine?
This can happen when switching between two branches with a lot of changes while the development server is running. To fix this, stop the development server and then execute the following:

```
yarn run cleanup-flow
```

If the problem is still not resolved, try running `yarn run test:flow`. Should this command still report type errors, then there probably are type errors. You should fix those 😏.
