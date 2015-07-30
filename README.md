# in-client aka. the stuff that runs in the browser

## Getting Started
You need to have Node.js installed in order to execute the build, tests and the development mode. OS X and Linux users should install Node.js via the
[Node Version Manager](https://github.com/creationix/nvm) (NVM). NVM makes it
easy to switch between installed Node.js versions and to install global
modules without super-user privileges. Windows users should follow the
instructions on the [official website](http://nodejs.org/).

### Node Version Manager installation
Make sure that you have Git and cURL installed.

```
# download and install NVM
curl https://raw.githubusercontent.com/creationix/nvm/v0.22.2/install.sh | bash

# reload bash
bash

# install Node.js version 0.12
nvm install 0.12
# use Node.js version 0.12
nvm use 0.12
# and use it by default
nvm alias default 0.12
```

### Executing tasks
Tasks are defined in the `package.json`. They can be executed via `npm run <taskname>`. For instance `npm run test` (or `npm test`) to execute the tests, `npm run dev` to start up a proxy and development server or `npm run build` to build the JavaScript files.

### Setting up local domains
In order for cookies to be send to the backend you need to configure a rule in `/etc/hosts` to route all traffic for `local.internal.instana.io` to `127.0.0.1`. Only access the local development environment using this domain.

```
127.0.0.1 local.internal.instana.io
```
