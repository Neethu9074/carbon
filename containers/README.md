# Component Images

This directory contains all code necessary to build Instana `ui-client` component images based off of Instana runtime images. The `ui-client` component uses a similar `container` definition file as the [default backend one](https://github.com/instana/backend/blob/develop/containers/components/default/container) except that it's using the `nodejs` image instead of `jdk11` as the base.

## Base Image

All Instana component images use one of the [Instana runtime images](https://github.com/instana/backend/blob/develop/containers/runtimes) as its base. The version of that base image is controlled by the value in the [`BASE_VERSION`](BASE_VERSION) file.

## Usage

### Building Locally

Images that are built locally use the `*local*` version tag by default. So you shouldn't be building and pushing these
images from your machine to the remote container registry. That is the responsibility of the CI server.

To build a local image for the `ui-client`:

    ./scripts/build.sh ui-client

This will set dummy default values for some required variables like `BRANCH_NAME`, `COMMIT_ID`, `ARTIFACT_VERSION`, `IMAGE_VERSION`, build the `tar.gz`
from source (be patient), extract the required files, and then build a container image from those files. You should end up with something like the following image in your local registry after you build it:

    REPOSITORY                                                                   TAG           IMAGE ID       CREATED             SIZE
    containers.instana.io/instana/<your-current-branch>/product/ui-client        3.local-0     464697e62bf8   9 seconds ago       464MB

### Building On CI

Images that are built on CI download the component's `tar.gz` file from Artifactory instead of building it from source, and need
proper values to be provided for `BRANCH_NAME`, `ARTIFACT_VERSION` and `IMAGE_VERSION`. Additionally, the following env variables need to be provided as well:
  - `ARTIFACT_RND_INSTANA_IO_USER` and `ARTIFACT_RND_INSTANA_IO_PASSWORD` to download `tar.gz` files from Artifactory.
  - `CONTAINERS_INSTANA_IO_USER` and `CONTAINERS_INSTANA_IO_PASSWORD` to interact with `containers.instana.io`

#### About the `ARTIFACT_VERSION` and `IMAGE_VERSION` env vars

Images with the `*local*` version tag (images built locally on developer machines) are not intended to be pushed to the remote
container registry at containers.instana.io.

When a container image is built on CI, it uses the 1.xxx.xxx `ARTIFACT_VERSION` to download the component's `tar.gz` from Artifactory.
Then it uses a new version using the 3.xxx.xxx schema for the actual image that is built determined via
`ci-shared-tools/scripts/componentVersioning/getInstanaImageVersion.js` which is then set in `IMAGE_VERSION` and is used to
build and push that container image to the remote container registry.

For example:

    BRANCH_NAME=develop \
    ARTIFACT_VERSION=1.198.755 \
    IMAGE_VERSION=3.198.10-0 \
    ARTIFACT_RND_INSTANA_IO_USER=<artifactory-user> \
    ARTIFACT_RND_INSTANA_IO_PASSWORD=<artifactory-pswd> \
    CONTAINERS_INSTANA_IO_USER=<containers-user> \
    CONTAINERS_INSTANA_IO_PASSWORD=<containers-pswd> \
    ./scripts/build.sh ui-client

Will produce:

    REPOSITORY                                                                   TAG           IMAGE ID       CREATED             SIZE
    containers.instana.io/instana/develop/product/ui-client                      3.198.10-0    99b577f554e4   About an hour ago   464MB

### Publishing On CI

By default, images using the `*local*` version tag will _not_ be published to the remote registry at `containers.instana.io`.
Furthermore, you need to have the proper credentials to be able to push to `containers.instana.io` and that responsibility should
be left to the CI server.

### Putting It All Together On CI

To build an image for a component on CI:

    BRANCH_NAME=develop \
    ARTIFACT_VERSION=1.198.755 \
    IMAGE_VERSION=3.198.10-0 \
    ARTIFACT_RND_INSTANA_IO_USER=<artifactory-user> \
    ARTIFACT_RND_INSTANA_IO_PASSWORD=<artifactory-pswd> \
    CONTAINERS_INSTANA_IO_USER=<containers-user> \
    CONTAINERS_INSTANA_IO_PASSWORD=<containers-pswd> \
    ./scripts/build-and-publish.sh ui-client

Please see the `Build & Push Images` and `Deploy` stages in the `Jenkinsfile` at the root of this repository for the implementation.
