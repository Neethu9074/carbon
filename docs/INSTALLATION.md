# Installation

**Please do not skip any of these steps!**

This document lists the technical steps necessary in order to get a local UI development setup running.

## Git Configuration

This repository is using Git submodules. If you prefer to interact with GitHub via SSH, then we recommend that you add the following to your Git configuration in order to always use SSH instead of HTTPS access for GitHub.

```
git config --global url.git@github.com:.insteadof https://github.com/
```

## Cloning the Repository

```
git clone git@github.com:instana/ui-client.git
cd ui-client
```

## Setting up local domains

In order for cookies to be send to the backend you need to configure rules in `/etc/hosts` to route all traffic for `local-instana.instana.io` and others to `127.0.0.1`. Only access the local development environment using one of these domains!

```
sudo sh -c 'echo "127.0.0.1 local-instana.instana.io" >> /etc/hosts'
sudo sh -c 'echo "127.0.0.1 local-instana.pink.instana.rocks" >> /etc/hosts'
sudo sh -c 'echo "127.0.0.1 local-instana.peach.instana.rocks" >> /etc/hosts'
sudo sh -c 'echo "127.0.0.1 local-instana.magenta.instana.rocks" >> /etc/hosts'
sudo sh -c 'echo "127.0.0.1 local-instana.rose.instana.rocks" >> /etc/hosts'
sudo sh -c 'echo "127.0.0.1 local-instana.melon.instana.rocks" >> /etc/hosts'
```

## Installation of Node.js and Yarn

You need to have Node.js installed in order to execute the build, tests and the development mode. OS X and Linux users should install Node.js via the [Node Version Manager](https://github.com/nvm-sh/nvm) (NVM). NVM makes it easy to switch between installed Node.js versions and allows installation of global modules without super-user privileges.

Make sure that you have Git and cURL installed before starting with the following instructions. Execute the instructions in the root directory of the ui-client project.

```
# ensure that you have build and compiler tools available on your system:
# ubuntu
sudo apt-get install build-essential
# MacOS
xcode-select --install

# Download and install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

# reload bash
bash

# install and use the project's preferred Node.js and Yarn version
./build/upgrade-nodejs
```

## Installation of Nginx

You will also need to have Nginx installed and its CLI on the path. Installation instructions can be found in the [proxrox repository](https://github.com/bripkens/proxrox/blob/master/INSTALLATION.md#installation-of-nginx).

As an alternative (especially for Linux), you might use the `nginx` script as provided in the [internal-tools repository](https://github.com/instana/internal-tools/tree/master/proxrox-nginx), which will run Nginx as Docker container. For regular/repeated UI development however we do not recommend this option.

On Linux, it might be required to do the following to allow `yarn` to run the ngnix-docker container without sudo:

```
sudo groupadd docker
sudo gpasswd -a $USER docker
newgrp docker
```

## Editor Recommendations

At the time of writing most UI engineers are using [VS Code](https://code.visualstudio.com/). We would recommend that you give this a try. VS Code will bring up a list of suggested extensions when opening the `ui-client` root directory in VS Code. We recommend that you install these as well for a good out of the box development experience.

## Next Steps

Head over to the [local development guidelines](./LOCAL_DEVELOPMENT_GUIDELINES.md) to learn how to execute tests and how to execute the development mode.
