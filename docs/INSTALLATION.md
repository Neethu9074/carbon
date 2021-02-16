# Installation

**Please do not skip any of these steps!**

This document lists the technical steps necessary in order to get a local UI development setup running.

## Git Configuration

This repository is using Git submodules. If you prefer to interact with GitHub via SSH, then we recommend that you add the following to your Git configuration in order to always use SSH instead of HTTPS access for GitHub.

```sh
git config --global url.git@github.com:.insteadof https://github.com/
```

## Cloning the Repository

```sh
git clone git@github.com:instana/ui-client.git
cd ui-client
```

## Setting up local domains

In order for cookies to be send to the backend you need to configure rules in `/etc/hosts` to route all traffic for `local-instana.instana.io` and others to `127.0.0.1`. Only access the local development environment using one of these domains!

```sh
sudo sh -c 'echo "127.0.0.1 local-instana.instana.io" >> /etc/hosts'
sudo sh -c 'echo "127.0.0.1 local-instana.instana.rocks" >> /etc/hosts'
sudo sh -c 'echo "127.0.0.1 local-instana.pink.instana.rocks" >> /etc/hosts'
```

## Installation of Node.js and Yarn

You need to have Node.js installed in order to execute the build, tests and the development mode. OS X and Linux users should install Node.js via the [Node Version Manager](https://github.com/nvm-sh/nvm) (NVM). NVM makes it easy to switch between installed Node.js versions and allows installation of global modules without super-user privileges.

Make sure that you have Git and cURL installed before starting with the following instructions. Execute the instructions in the root directory of the ui-client project.

```sh
# Ensure that you have build and compiler tools available on your system:
# For Ubuntu users:
sudo apt-get install build-essential
# For MacOS users:
xcode-select --install

# Download and install NVM
# See https://github.com/nvm-sh/nvm#installing-and-updating

# Use and install our preferred Node.js version
nvm install
nvm use
```

## Configure Access to our Artifact Registry

We are using a custom artifact registry instead of the public [npmjs.com](https://www.npmjs.com/) /
[yarnpkg.com](https://yarnpkg.com/) registries. You will need to configure your system for access before you can
continue to download our project dependencies.

You will need an account for our [artifact-rnd.instana.io](https://artifact-rnd.instana.io) Artifactory instances. Our
[onboarding guide explains](https://www.notion.so/instana/New-Engineering-Hire-Survival-Guide-5f4be1878333477b8d6f07739a0e259b#e18b6bf976c04bdca3f6d36de6aa209c) how you can get
an account and access to our artifacts. Please follow the guide and come back here once you have access.

The following picture shows how to find your user name and API token within Artifactory.

![Finding your user name and API token within Artifactory](./screenshots/artifactory-config.png)

```sh
# You can accept the defaults proposed for the first two questions.
# Answer the third and fourth question with your Artifactory credentials.
REGISTRY="https://artifact-rnd.instana.io" \
  REPOSITORY_KEY="npm-virtual-internal" \
  NPM_CONFIG_REGISTRY="https://registry.npmjs.org/" \
  npx create-artifactory-access-config@1.3.0
```

## Install Project Dependencies

Now that you have access to our artifact registry, it is time to download all our project dependencies! :)

```sh
./build/upgrade-nodejs
```

## Installation of Nginx

You will also need to have Nginx installed and its CLI on the path. Installation instructions can be found in the [proxrox repository](https://github.com/bripkens/proxrox/blob/master/INSTALLATION.md#installation-of-nginx).

As an alternative (especially for Linux), you might use the `nginx` script as provided in the [internal-tools repository](https://github.com/instana/internal-tools/tree/master/proxrox-nginx), which will run Nginx as Docker container. **For regular/repeated UI development however we do not recommend this option.**

On Linux, it might be required to do the following to allow `yarn` to run the ngnix-docker container without sudo:

```
sudo groupadd docker
sudo gpasswd -a $USER docker
newgrp docker
```

## Editor Recommendations

At the time of writing most UI engineers are using [VS Code](https://code.visualstudio.com/). We would recommend that you give this a try. VS Code will bring up a list of suggested extensions when opening the `ui-client` root directory in VS Code. We recommend that you install these as well for a good out of the box development experience.

## Note for WSL2 Users

The installation instructions will work out of the box, assuming that you are using an Ubuntu installation for your WSL2. If you intend to use a Windows based browser, you will also need to add the relevant entries to the Windows hosts file (`c:\Windows\System32\Drivers\etc\hosts`):

```
127.0.0.1 local-instana.instana.io
127.0.0.1 local-instana.instana.rocks
127.0.0.1 local-instana.pink.instana.rocks
```

Alternatively, you can install an XServer in your Windows environment and run your preferred browser from within WSL2.

## Next Steps

Head over to the [local development guidelines](./LOCAL_DEVELOPMENT_GUIDELINES.md) to learn how to execute tests and how to execute the development mode.
