#!groovy

// define global vars for use in later stages
def gitCommitId         = null
def gitCommitAuthor     = null
def gitMessage          = null
def instanaUiClientVersion = null
def instanaImageVersion = null
def majorReleaseVersion = null
def archiveName         = null
def latestReleaseBranch = null
def backendComponents   = null
def uiClientComponents  = null

void setBuildStatus(String message, String state) {
  def commitSha = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()

  step([
      $class: "GitHubCommitStatusSetter",
      reposSource: [$class: "ManuallyEnteredRepositorySource", url: "https://api.github.com/instana/ui-client"],
      commitShaSource: [$class: "ManuallyEnteredShaSource", sha: commitSha],
      contextSource: [$class: "ManuallyEnteredCommitContextSource", context: "ci/jenkins/build-status"],
      errorHandlers: [[$class: "ChangingBuildStatusErrorHandler", result: "UNSTABLE"]],
      statusResultSource: [ $class: "ConditionalStatusResultSource", results: [[$class: "AnyBuildResult", message: message, state: state]] ]
  ]);
}

pipeline {
  agent any
  options {
    ansiColor('xterm')
  }
  stages {
    stage ('Setup') {
      steps {
        milestone(label: "Setup", ordinal: null)
        setBuildStatus('Build started', 'PENDING')

        script {
          if (env.BRANCH_NAME.contains('/') || env.BRANCH_NAME.contains(',')) {
            setBuildStatus('Build failure', 'FAILURE')
            error "Build aborted: Branch names containing slashes or commas aren't allowed. Please rename your branch."
          }

          latestReleaseBranch = getLatestReleaseBranch()
          instanaUiClientVersion = getVersion('ui-client', env.BRANCH_NAME)
          majorReleaseVersion = instanaUiClientVersion.tokenize('.')[1].toInteger()
          gitCommitId         = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
          gitCommitAuthor     = sh(returnStdout: true, script: "git --no-pager show -s --format='%ae' $gitCommitId").trim()
          gitMessage          = sh(returnStdout: true, script: "git log -1 --pretty=format:'%an (<https://github.com/instana/ui-client/commit/%h|%h>): %s'").trim()
          // https://github.com/instana/jenkins/blob/develop/vars/getBackendComponents.groovy
          backendComponents = getBackendComponents()
              .findAll { it.isIncludedInRelease(majorReleaseVersion) && !(it.name ==~ /^ui-client.*/) }
              .collect { it.name }
              .plus(['ingress', 'ingress-global'])
          uiClientComponents = getBackendComponents()
              .findAll { it.isIncludedInRelease(majorReleaseVersion) && (it.name ==~ /^ui-client.*/) }
              .collect { it.name }

          // download git submodules so that our shared CI tools are available
          sh "git submodule update --init --recursive"
          // Set up the shared tooling
          sh "./build/ci-shared-tools/scripts/setup.bash"

          currentBuild.displayName = "#${env.BUILD_NUMBER}: ${gitCommitId.take(8)} -> ${instanaUiClientVersion}"
          archiveName = "ui-client-${env.BRANCH_NAME}-${instanaUiClientVersion}.tar.gz"
          stash includes: "**/*", name: "ui-client-checkout-${gitCommitId}", useDefaultExcludes: false
        }
      }
    }

    stage('Build') {
      steps {
        milestone(label: "Build", ordinal: null)
        timeout(time: 20, unit: 'MINUTES') {
          timestamps {
            script {
              try {
                awsCodeBuild credentialsType: 'jenkins',
                  credentialsId: 'codebuild',
                  projectName: 'ui-client',
                  region: 'us-west-2',
                  imageOverride: 'aws/codebuild/standard:5.0',
                  sourceControlType: 'project',
                  sourceVersion: gitCommitId,
                  envVariables: '[ {EXTERNAL_CONTAINER_TAG_OVERWRITE, ' + instanaUiClientVersion + '}, {BRANCH_NAME, ' + env.BRANCH_NAME + '}, {GIT_BRANCH, ' + env.BRANCH_NAME + '} ]'

                if ( currentBuild.currentResult == 'SUCCESS' ) {
                  setBuildStatus('Build successful', 'SUCCESS')
                }
              } catch (e) {
                setBuildStatus('Build Failure', 'FAILURE')
                throw e
              }
            }
          }
        }
      }
    }

    stage('Build & Push Images') {
      steps {
        // Only allow 1 concurrent build is allowed to build images at a time and newer
        // builds are pulled off the queue first. When the a build reaches the milestone
        // at the end of the lock, all jobs started prior to the current build that are
        // still waiting for the lock will be aborted
        // https://www.jenkins.io/blog/2016/10/16/stage-lock-milestone/
        // This lock is shared with the backend pipeline as both pipelines share the same
        // source of image versioning
        lock(resource: "build-instana-images-${env.BRANCH_NAME}", inversePrecedence: true) {
          timeout(time: 15, unit: 'MINUTES') {
            timestamps {
              script {
                // TODO: Use isDeliveryBranch instead
                if (env.BRANCH_NAME == 'develop' || env.BRANCH_NAME ==~ /release-\d{3,}/   || env.BRANCH_NAME ==~ /hotfix-\d{3,}(-.+)?/) {
                  instanaImageVersion = sh(returnStdout: true, script: "./build/ci-shared-tools/scripts/componentVersioning/getInstanaImageVersion.js ${env.BRANCH_NAME}").trim() + "-0"
                  buildAndPublishImages(gitCommitId, backendComponents, uiClientComponents, env.BRANCH_NAME, instanaUiClientVersion, instanaImageVersion)
                }
              }
            }
          }
          milestone(label: "Build & Push Images", ordinal: null)
        }
      }
    }

    stage('Deploy') {
      steps {
        // This lock is shared with the backend pipeline as well so as only to allow
        // one deploy per deployable branch at a time
        lock(resource: "deploy-instana-${env.BRANCH_NAME}", inversePrecedence: true) {
          timeout(time: 30, unit: 'MINUTES') {
            timestamps {
              script {
                // Enable only for the develop branch for now
                // Other delivery branches will use 'K8s Deploy'
                if (env.BRANCH_NAME == 'develop') {
                  deployInstana(env.BRANCH_NAME, instanaImageVersion, null, 'pink', 'instana', 'test')
                } else if (env.BRANCH_NAME == latestReleaseBranch) {
                  deployInstana(env.BRANCH_NAME, instanaImageVersion, null, 'magenta', 'instana', 'release')
                }
              }
            }
          }
        }
      }
    }

    stage('Storybook') {
      steps {
        timeout(time: 30, unit: 'MINUTES') {
          timestamps {
            script {
              if (env.BRANCH_NAME == 'develop'
                  || env.BRANCH_NAME.startsWith('release-')
                  || env.BRANCH_NAME.startsWith('storybook-')
                  || env.BRANCH_NAME.startsWith('chromatic-')) {

                  try {
                    def RUN_UI_TEST_ON_DELIVERY =
                      (env.BRANCH_NAME.startsWith('storybook-') || env.BRANCH_NAME.startsWith('chromatic-')) ? "true" : "false"

                    awsCodeBuild credentialsType: 'jenkins',
                      credentialsId: 'codebuild',
                      projectName: 'ui-client-storybook',
                      region: 'us-west-2',
                      imageOverride: 'aws/codebuild/standard:5.0',
                      sourceControlType: 'project',
                      envVariables: '[ {RUN_UI_TEST_ON_DELIVERY, ' + RUN_UI_TEST_ON_DELIVERY + '} ]',
                      sourceVersion: gitCommitId,
                      privilegedModeOverride: 'True'

                    if ( currentBuild.currentResult == 'SUCCESS' ) {
                      notifySuccess('dev-notification', "<${env.BUILD_URL}|${env.JOB_NAME} : Storybook build & deploy success: ${gitCommitId}")
                    }
                  } catch (e) {
                    notifyFailure('dev-notification', "<${env.BUILD_URL}|${env.JOB_NAME} : Storybook build & deploy failed: ${gitCommitId}")
                    throw e
                  }
              }
            }
          }
        }
      }
    }

  }
}

def buildAndPublishImages(gitCommitId, backendComponents, uiClientComponents, branchName, instanaUiClientVersion, instanaImageVersion) {
  try {
    def buildAndPublish = [:]
    uiClientComponents.each { component ->
      buildAndPublish[component] = {
        buildAndPublishImage(gitCommitId, component, branchName, instanaUiClientVersion, instanaImageVersion)
      }
    }
    parallel buildAndPublish

    rebuildBackend(backendComponents, branchName, instanaUiClientVersion, instanaImageVersion)
    notifySuccess('k8s-notification', "<${env.BUILD_URL}|${env.JOB_NAME} #${env.BUILD_NUMBER}>: Successfully built K8S image *${instanaImageVersion}* \n\n${currentBuild.description}")
  } catch (e) {
    notifyFailure('k8s-notification', "<${env.BUILD_URL}|${env.JOB_NAME} #${env.BUILD_NUMBER}>: Failed to build K8S image *${instanaImageVersion}* \n\n${currentBuild.description}")
    throw e
  }
}

def buildAndPublishImage(gitCommitId, componentName, branchName, instanaUiClientVersion, instanaImageVersion) {
  awsCodeBuild credentialsType: 'jenkins',
      credentialsId: 'codebuild',
      projectName: 'build-ui-client-images',
      region: 'us-west-2',
      imageOverride: 'aws/codebuild/standard:5.0',
      sourceControlType: 'project',
      sourceVersion: gitCommitId,
      envVariables: "[ {CONTAINER_IMAGE_NAME, ${componentName}}, {ARTIFACT_VERSION, ${instanaUiClientVersion}}, {IMAGE_VERSION, ${instanaImageVersion}}, {BRANCH_NAME, ${branchName}} ]"
}

// Keep image tags for backend and ui-client in-sync as instanactl only accepts a single version
// and expects all components to have an image with that version
def rebuildBackend(backendComponents, branchName, instanaUiClientVersion, instanaImageVersion) {
  def backendStableVersion =
      sh(returnStdout: true, script: "./build/ci-shared-tools/scripts/componentVersioning/getStableVersion.js backend ${branchName}").trim()
  def backendStableImageVersion = sh(returnStdout: true, script: "./build/ci-shared-tools/scripts/componentVersioning/getStableVersion.js instana-image-from-backend ${branchName}").trim()

  def rebuildBackendComponents = [:]
  backendComponents.each {
      def currentBackendFullyQualifiedTag = "containers.instana.io/instana/${branchName}/product/${it}:${backendStableImageVersion}"
      def newBackendFullyQualifiedTag = "containers.instana.io/instana/${branchName}/product/${it}:${instanaImageVersion}"
      rebuildBackendComponents[it] = {
        sh """
        ./build/ci-shared-tools/scripts/docker/imageOverride.js \
        ${currentBackendFullyQualifiedTag} \
        ${newBackendFullyQualifiedTag} \
        "--build-arg current_fully_qualified_tag=${currentBackendFullyQualifiedTag} --label com.instana.image.tag=${instanaImageVersion}"
        """
    }
  }
  parallel rebuildBackendComponents

  markStableVersions(branchName, instanaUiClientVersion, instanaImageVersion)
  currentBuild.description = "backend: ${backendStableVersion}, ui-client: ${instanaUiClientVersion}, Instana image version: ${instanaImageVersion}"
}

def markStableVersions(branchName, instanaUiClientVersion, instanaImageVersion) {
  sh "./build/ci-shared-tools/scripts/markStableVersion.bash ui-client ${branchName} ${instanaUiClientVersion}"
  sh "./build/ci-shared-tools/scripts/markStableVersion.bash ui-client-saas ${branchName} ${instanaUiClientVersion}"
  sh "./build/ci-shared-tools/scripts/markStableVersion.bash instana-image-from-ui-client ${branchName} ${instanaImageVersion}" // so the backend pipeline can lookup the latest version built by the ui-client pipeline
  sh "./build/ci-shared-tools/scripts/markStableVersion.bash instana-image ${branchName} ${instanaImageVersion}" // single source of latest stable Instana image version
}

def deployInstana(branchName, version, globalEnvironment, environment, tenant, unit) {
  try {
    if (globalEnvironment != null) {
      println "Updating global environment ${globalEnvironment}"
      sh "instanactl --deployment ${globalEnvironment} global migrate --branch=${branchName}"
      sh "instanactl --deployment ${globalEnvironment} global update --version=${version} --branch=${branchName}"
    }
    if (tenant != null && unit != null) {
      println "Updating tenant unit ${tenant}-${unit} in ${environment}"
      sh "instanactl --deployment ${environment} core migrate --branch ${branchName}"
      sh "instanactl --deployment ${environment} core update --version ${version} --branch ${branchName}"
      sh "instanactl --deployment ${environment} tenantunit migrate ${tenant} ${unit} --branch ${branchName}"
      sh "instanactl --deployment ${environment} tenantunit update ${tenant} ${unit} --version ${version} --branch ${branchName}"
    } else {
      println "Updating all tenant units in ${environment}"
      sh "instanactl --deployment ${environment} tenantunit list"
      sh "instanactl --deployment ${environment} upgrade --version=${version} --branch=${branchName}"
    }
    notifySuccess('k8s-notification', "<${env.BUILD_URL}|${env.JOB_NAME} #${env.BUILD_NUMBER}>: Successfully deployed ${version} to deployment:*${environment}* \n\n${currentBuild.description}")
  } catch(e) {
    notifyFailure('k8s-notification', "<${env.BUILD_URL}|${env.JOB_NAME} #${env.BUILD_NUMBER}>: Deployment of ${version} to deployment:*${environment}* failed \n\n${currentBuild.description}")
    throw e
  }
}

def notifySuccess(channel, message) {
  slackSend channel: channel, color: 'good', message: message
}

def notifyFailure(channel, message) {
  slackSend channel: channel, color: 'danger', message: message
}
