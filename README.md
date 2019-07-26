# 🚀 ui-client 🏂 &nbsp; [![Contribution Guidelines](https://img.shields.io/badge/contribution-guidelines-important.svg)](https://www.notion.so/instana/UI-Development-7218aadabb574f6aa1ae29e9324e74bf) [![Component Catalog](https://img.shields.io/badge/component-catalog-informational.svg)](http://storybook.instana.io/7550eeca-f0eb-4039-b87a-c3fbd0d2eaad/develop/)

<!-- toc -->

- [Getting Started](#getting-started)
  * [Installation of required software](#installation-of-required-software)
    + [Node.js and Yarn](#nodejs-and-yarn)
    + [Nginx](#nginx)
    + [Additional UI Engineer Software](#additional-ui-engineer-software)
  * [Setting up local domains](#setting-up-local-domains)
  * [Executing tasks](#executing-tasks)
    + [Preferences/Environment Variables](#preferencesenvironment-variables)
- [Branching Model](#branching-model)
- [Pull Requests (PR)](#pull-requests-pr)
- [Code Style](#code-style)
  * [Simon Sort](#simon-sort)
  * [Running Prettier On Save](#running-prettier-on-save)
    + [VIM](#vim)
    + [VS Code](#vs-code)
    + [IntelliJ & Co](#intellij--co)
- [Upgrading Node.js](#upgrading-nodejs)
- [Troubleshooting](#troubleshooting)
  * [I cannot access the local development domain in Chrome due to HSTS!](#i-cannot-access-the-local-development-domain-in-chrome-due-to-hsts)
  * [I cannot access the local development domain in Firefox due to HSTS!](#i-cannot-access-the-local-development-domain-in-firefox-due-to-hsts)
  * [Instana dev extensions are saying that no stores could be found](#instana-dev-extensions-are-saying-that-no-stores-could-be-found)
  * [How can I get a list of metrics?](#how-can-i-get-a-list-of-metrics)
  * [I am getting flow type checking errors even though everything should be fine?](#i-am-getting-flow-type-checking-errors-even-though-everything-should-be-fine)
  * [Problem with pngquant on Ubuntu?](#problem-with-pngquant-on-ubuntu)
- [The Node.js Front End Server](#the-nodejs-front-end-server)
- [VSCode Debugger](#vscode-debugger)

<!-- tocstop -->

## Getting Started

This document lists the technical steps necessary in order to get a UI development setup running.
Our development practices are collected within [Notion](https://www.notion.so/instana/UI-Development-7218aadabb574f6aa1ae29e9324e74bf).

### Installation of required software

You need to have Node.js installed in order to execute the build, tests and the development mode. OS X and Linux users should install Node.js via the
[Node Version Manager](https://github.com/creationix/nvm) (NVM). NVM makes it easy to switch between installed Node.js versions and allows installation of global modules without super-user privileges.

#### Node.js and Yarn

Make sure that you have Git and cURL installed before starting with the following instructions. Execute the instructions in the root directory of the ui-client project.

```
# ensure that you have build and compiler tools available on your system:
# ubuntu
sudo apt-get install build-essential
# os x
xcode-select --install

# download and install NVM
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash

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

- [Abstract](https://www.abstract.com/): This is our tool of choice for designs. The tool has a version control for sketch files and is used through the design team. It's free of charge, too.
- [Chrome Extension](https://github.com/instana/internal-tools/tree/master/chrome-browser-extension): We have our own Chrome dev tools extension which allows insights into the state of our global stores.
- [SFPro font](https://developer.apple.com/fonts/downloads/SFPro.zip): This is the default MacOS system font that we are using in our product. Unfortunately, this font can only be used in Sketch when installed separately.

### Setting up local domains

In order for cookies to be send to the backend you need to configure a rule in `/etc/hosts` to route all traffic for `local-instana.instana.io` and others to `127.0.0.1`. Only access the local development environment using one of these domains.

```
sudo sh -c 'echo "127.0.0.1 local-instana.instana.io" >> /etc/hosts'
sudo sh -c 'echo "127.0.0.1 local-instana.pink.instana.rocks" >> /etc/hosts'
sudo sh -c 'echo "127.0.0.1 local-instana.peach.instana.rocks" >> /etc/hosts'
sudo sh -c 'echo "127.0.0.1 local-instana.magenta.instana.rocks" >> /etc/hosts'
sudo sh -c 'echo "127.0.0.1 local-instana.rose.instana.rocks" >> /etc/hosts'
sudo sh -c 'echo "127.0.0.1 local-instana.melon.instana.rocks" >> /etc/hosts'
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

#### Preferences/Environment Variables

A few environment variables are used to tweak the UI development workflow to your personal preferences. These are used for `yarn run dev`:

- `TARGET`:
  - If this is set to `test` (non case-sensitive) the UI client will connect to the test environment automatically instead of asking you for the target environment.
  - If this is set to `local` (non case-sensitive) the UI client will connect to the your local back end instead of asking.
  - Otherwise, `yarn run dev` will ask for the target environment during startup.
- `BUILD_MODE`:
  - If this is set to `prod` (non case-sensitive), sources will be compiled in production mode.
  - If this is set to `ask` (non case-sensitive), you will be asked and can choose between production mode or development mode.
  - Otherwise, sources will be compiled in development mode.
- `HOT_RELOAD`: If this is set to a non-empty string and the build is running in development mode, the build will trigger a browser reload automatically when a file is changed and saved and the project has been recompiled. Without this, you'll have to refresh manually.
- `DONT_OPEN_BROWSER`: If this is set to a non-empty string, the UI build will not open a new browser window when the build is finished.

For maximum convenience, you can create aliases like this for your shell:

```
alias uit="cd /Users/name/path/to/ui-client && TARGET=test yarn run dev"
alias uil="cd /Users/name/path/to/ui-client && TARGET=local yarn run dev"
```

## Branching Model

We are using the [a variation of the Git flow branching model](https://miro.com/app/board/o9J_kx-xBuY=/) in ui-client.

## Pull Requests (PR)

According to our braching model, we create several PRs. When doing so, the description is prefilled with a template. It describes how and why it's filled. Please make sure, you also set proper labels to mark your PR:
- "depends on backend changes": This is set when your PR depends on changes in the backend, so they need to get merged together. If this is the case, please also link the corresponding PR in your description.
- "do not merged": Work-in-progress branches are usually marked with the "WIP" label. This is only used to really mark, that the current PR is very experimental.
- "master": Obsolete. It was used to mark, that the PR is configured to be merged against the master branch.
- "needs discussion": The PR owner is actively asking for feedback on the PR and the ideas/concept behind it.
- "Review & Merge": Use this label, if you want somebody to review and merge this PR when there are no remarks.
- "waiting for design": Mostly unused. It marks a PR to be ready code-wise but blocked by missing design. Caution: If you are blocked by design, please make your PM and team aware of this and track this in your Project-Tool.
- "WIP": When you are currently working on a branch but want to still create a PR, use this label to reflect, that you are still working on this branch.
- "type:XY": These type-labels tell the reviewer the intention of the change.

## Code Style

Most code style rules are checked by linters, also, code formatting is applied by prettier. Linters and prettier are run automatically by a pre-commit hook on all files which have staged changes. If possible, you should [configure your IDE/Editor](#running-prettier-on-save) to run prettier on all files when saving the file.

_CAUTION:_ If you use `git add --patch` to only commit a portion of a file's changes while excluding other changes in the same file from the commit by not adding them, the pre-commit hook will still add the whole file with all changes, so that won't work.

### Simon Sort

There is one style rule that is not automatically enforced or taken care of (yet): _Simon sort_. This is our rule on how to sort imports in ES6 files. We split all imports into three blocks (not all three blocks are present in each file):

1. Third party imports (React, Lodash, ...) first, then
2. Instana imports (everything from one of the packages in `ui-client/packages/`, and finally
3. CSS/LESS imports (all `*.less` and `*.mless` files).

These blocks are separated by a new line. The first import block usually starts at the first line of the file (that is, there is nothing else above the imports).

The imports in one block are _sorted by line length, descending_. Longest import line at the top, shortest line at the bottom.

Basically, this is our (totally arbitrary, but at least consistent) rule for sorting imports. The main reason it was chosen is that it can be verified very quickly visually without inspecting the individual imports.

Here is an example of some imports, correctly simon-sorted:

```
import { get } from 'lodash';
import React from 'react';

import TreeHeader from 'in-analyze/TraceDetail/components/CallTree/components/TreeHeader';
import { getStart, getEnd } from 'in-analyze/TraceDetail/components/callStartAndEndTime';
import LoadingCallTree from 'in-analyze/TraceDetail/components/CallTree/LoadingCallTree';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import Row from 'in-analyze/TraceDetail/components/CallTree/components/Row';
import createScale from 'in-services/scale';

import locals from './CallTree.mless';

export default function CallTree({
  ...
```

### Running Prettier On Save

#### VIM

- Install https://github.com/prettier/vim-prettier
- Add the following to `~/.vimrc`:

```
" run prettier on JavaScript/CSS files when saving
let g:prettier#autoformat = 0
autocmd BufWritePre *.js,*.jsx,*.mjs,*.ts,*.tsx,*.css,*.less,*.scss,*.json,*.graphql PrettierAsync
```

#### VS Code

- Install the "Prettier - Code formatter" code extension.

#### IntelliJ & Co

- Install the file watcher plugin
- Set up a file watcher like this:
  - Name: Prettier
  - File type: JavaScript
  - Scope: Project Files
  - Program: `/path/to/ui-client/node_modules/.bin/prettier`
  - Arguments: `--single-quote --print-width 120 --write $FilePath$`
  - Output paths to refresh: `$FilePath$`
  - Working directory: `$ModuleFileDir$`
  - Auto-save edited files to trigger the watcher: Unchecked
  - Trigger the watcher on external changes: Unchecked
  - Trigger the watcher regardless of syntax errors: Unchecked
  - Create output file from stdout: Unchecked
  - Show console: On error

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

You can get a list of metrics per entity via `yarn run generateMetricOverview`. This will execute a test which writes the metrics to files in the CWD. Note that this list is not extensive. For instance, it does not include dynamic metric names such as file system capacity or CPU 1 usage.

The generated files' names are `metricOverview*`.

### I am getting flow type checking errors even though everything should be fine?

This can happen when switching between two branches with a lot of changes while the development server is running. To fix this, stop the development server and then execute the following:

```
yarn run cleanup-flow
```

If the problem is still not resolved, try running `yarn run test:flow`. Should this command still report type errors, then there probably are type errors. You should fix those 😏.

### Problem with pngquant on Ubuntu?

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

## The Node.js Front End Server

During development you will mostly work with `yarn run dev`, but in production the assets are served by a small Node.js app which you can find in `packages/in-server`. This component also makes a few preliminary requests, for example to `/checkUserAccessPermitted`, `/api/ui/settings`, `/api/search/fields` and a few more. The results of some of these requests will be injected into the Handlebars template for index.html (`packages/in-server/templates/index.hbs`, which is also only used in production while `packages/in-client/index.html` is used during development).

It is rather rare, but if need to start `in-server` locally, here's how:

- `yarn run build`
- `yarn run try-build` can also be used after the first successful Gulp/Webpack build

If the build fails while trying to start the Proxy (Proxrox) with something like:

```
error, no objects specified in config file,
```

This might be due to an incompatibility between Proxrox and MacOS' default openssl executable. Check `openssl version`, if it says something like `LibreSsl 2.xx`, consider doing `brew install openssl`/`brew upgrade openssl` and (important!) adding its path to your shell's init scripts (`export PATH="/usr/local/opt/openssl/bin:$PATH"`). After that, `openssl version` should say something like `OpenSSL 1.0.2o 27 Mar 2018`.

## VSCode Debugger

In case of difficult debugging tasks, like debugging tests etc. It can be useful to set up the debugger in VSCode to help.
Getting the deubgger running requires a little bit of setup.

- Open the VSCode `Debug` menu and select `Add Configuration`, then select `Node.js`

- This creates a `launch.json` and where you should paste in the following code.

```
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Mocha Tests",
            "program": "${workspaceFolder}/node_modules/mocha/bin/_mocha",
            "args": [
                "--timeout",
                "6000",
                "--require",
                "./packages/in-test/testHarness",
                "${workspaceFolder}/packages/FILE_TO_DEBUG"
            ],
            "internalConsoleOptions": "openOnSessionStart"
        }
    ]
}
```

Update the argument to target whatever files you want to run the debugger on. You can now use breakpoints to help debug your code in the debugging panel.
