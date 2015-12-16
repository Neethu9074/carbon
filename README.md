# ui-client aka. the stuff that runs in the browser

## Branching Model
We are using the [Git flow](http://nvie.com/posts/a-successful-git-branching-model/) branching model in ui-client.

## Getting Started
You need to have Node.js installed in order to execute the build, tests and the development mode. OS X and Linux users should install Node.js via the
[Node Version Manager](https://github.com/creationix/nvm) (NVM). NVM makes it easy to switch between installed Node.js versions and allows installation of global modules without super-user privileges.

### Accessing our artifact repository via NPM
To access our artifact repository (NEXUS) and retrieve dependencies via NPM, you need to add a local `.npmrc` configuration file to the `ui-client` directory. You do so via…

```
cp .npmrc.sample .npmrc
```

You need to edit the `.npmrc` file according to the comments contained within that file (*read the comments in the file!*). Since the file contains sensitive information, you would not add it to the repository. For your convenience, the file is ignored by default via the `.gitignore`.

### Installation of required software
Make sure that you have Git and cURL installed before starting with the following instructions. Execute the instructions in the root directory of the ui-client project.

```
# download and install NVM
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh | bash

# reload bash
bash

# install and use the project's preferred Node.js version
./build/upgrade-nodejs
```

You will also need to have nginx installed and its CLI on the path. You can achieve this on OS X via `brew install nginx`.

### Setting up local domains
In order for cookies to be send to the backend you need to configure a rule in `/etc/hosts` to route all traffic for `local-instana.instana.io` to `127.0.0.1`. Only access the local development environment using this domain.

```
sudo sh -c 'echo "127.0.0.1 local-instana.instana.io" >> /etc/hosts'
```

### Executing tasks
Tasks are defined in the `package.json`. They can be executed via `npm run <taskname>`. For instance `npm run test` (or `npm test`) to execute the tests, `npm run dev` to start up a proxy and development server or `npm run build` to build the JavaScript files.

### Using Commitizen for Git Commit Messages
This project is configured for use with the [Commitizen CLI](https://github.com/commitizen/cz-cli). To use it execute the following command:

```
npm install -g commitizen
```

And now you can execute `git cz` to commit with nice commit messages.

### Upgrading Node.js
From time to time we are upgrading the Node.js version that we are using for build of the `ui-client` as well as for the `in-server`. Node.js upgrades have been automated. Simply execute the following command in the root of the project to automatically upgrade your Node.js version via NVM.

```
./build/upgrade-nodejs
```

Once executed, verify that it was successful via the usual `npm test`.

## Theming
The theming system in place is used to support the default dark theme (called *night*) and a brighter theme with stronger contrasts (called *day*). Themes are switched based on a cookie called `in-theme`. This cookie is read by `in-server` and depending on its value the server returns varying HTML responses.

To support this process, the build job is executed twice with varying *active themes*. The active theme is defined by the files `in-themes/active.json` and `in-themes/active.less`. Through these files the look and feel of the whole application can be changed. LESS and JS config files will be created as part of the build job and symlinked to `in-themes/active.(json|less)` depending on the stage of the build or chosen theme.

For more information please refer to the build job's `translateThemeConfigs` Gulp task and the `in-server`'s routes.

### Most important files
 - `in-themes/common.js`: Common configuration options shared between all themes.
 - `in-themes/day.js`: The day theme configuration file (based on `common.js`).
 - `in-themes/night.js`: The night theme configuration file (based on `common.js`).
 - `in-themes/active.less`: To be imported in less files in order to use variables from the currently active theme. Import via `@import "~in-themes/active.less";`. *This file will be created as part of the build job and should not be checked in. It will also change when building the application!*
 - `in-themes/active.json`: This file contains configuration for the currently active theme to be consumed by JavaScript modules. Instead of importing this file, please import `import theme from 'in-services/theme'` instead. *This file will be created as part of the build job and should not be checked in. It will also change when building the application!*
