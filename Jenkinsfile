#!groovy

// define global vars for use in later stages
def gitCommitId         = null
def gitCommitAuthor     = null
def gitMessage          = null
def instanaVersion      = null
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
          latestReleaseBranch = getLatestReleaseBranch()
          instanaVersion      = getVersion('ui-client', env.BRANCH_NAME)
          instanaImageVersion = "3." + instanaVersion.tokenize('.').drop(1).join('.') + "-0"
          majorReleaseVersion = instanaVersion.tokenize('.')[1].toInteger()
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

          currentBuild.displayName = "#${env.BUILD_NUMBER}: ${gitCommitId.take(8)} -> ${instanaVersion}"
          archiveName = "ui-client-${env.BRANCH_NAME}-${instanaVersion}.tar.gz"
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
                  envVariables: '[ {EXTERNAL_CONTAINER_TAG_OVERWRITE, ' + instanaVersion + '}, {BRANCH_NAME, ' + env.BRANCH_NAME + '}, {GIT_BRANCH, ' + env.BRANCH_NAME + '} ]'

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

    // This stage is deprecated for the 'develop' branch and will eventually be deprecated entirely
    // Please see the following 'Build & Push Images' and 'Deploy' stages
    stage('K8s Deploy') {
      steps {
        milestone(label: "K8s Deploy", ordinal: null)
        timeout(time: 30, unit: 'MINUTES') {
          timestamps {
            script {
              if ( env.BRANCH_NAME == latestReleaseBranch) {
                // retag artifacts, build k8s containers and deploy
                build job: '/retag-artifacts', parameters: [
                    string(name: 'BRANCH', value: env.BRANCH_NAME, trim: true),
                    string(name: 'ENVIRONMENT', value: 'magenta', trim: true)
                ]
              } else if (env.BRANCH_NAME ==~ /release-\d{3,}/ && env.BRANCH_NAME != latestReleaseBranch ) {
                // retag artifacts and build k8s containers only
                build job: '/retag-artifacts', parameters: [
                    string(name: 'BRANCH', value: env.BRANCH_NAME, trim: true)
                ]
              } else if (env.BRANCH_NAME ==~ /hotfix-\d{3,}(-.+)?/ ) {
                // retag artifacts and build k8s containers only
                build job: '/retag-artifacts', parameters: [
                    string(name: 'BRANCH', value: env.BRANCH_NAME, trim: true)
                ]
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
        lock(resource: "build-ui-client-images-${env.BRANCH_NAME}", inversePrecedence: true) {
          timeout(time: 15, unit: 'MINUTES') {
            timestamps {
              script {
                if (env.BRANCH_NAME == 'develop') {
                  // Enable only for the develop branch for now
                  // Other delivery branches will use 'K8s Deploy'
                  //   || env.BRANCH_NAME == latestReleaseBranch
                  //   || env.BRANCH_NAME ==~ /release-\d{3,}/
                  //   || env.BRANCH_NAME ==~ /hotfix-\d{3,}(-.+)?/) {
                  buildAndPublishImages(gitCommitId, backendComponents, uiClientComponents, env.BRANCH_NAME, instanaVersion, instanaImageVersion)
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

def buildAndPublishImages(gitCommitId, backendComponents, uiClientComponents, branchName, instanaVersion, instanaImageVersion) {
  try {
    def buildAndPublish = [:]
    uiClientComponents.each { component ->
      buildAndPublish[component] = {
        buildAndPublishImage(gitCommitId, component, instanaVersion, branchName)
      }
    }
    parallel buildAndPublish

    retagBackend(backendComponents, branchName, instanaVersion, instanaImageVersion)
    notifySuccess('k8s-notification', "<${env.BUILD_URL}|${env.JOB_NAME} #${env.BUILD_NUMBER}>: Successfully built K8S image *${instanaImageVersion}* \n\n${currentBuild.description}")
  } catch (e) {
    notifyFailure('k8s-notification', "<${env.BUILD_URL}|${env.JOB_NAME} #${env.BUILD_NUMBER}>: Failed to build K8S image *${instanaImageVersion}* \n\n${currentBuild.description}")
    throw e
  }
}

def buildAndPublishImage(gitCommitId, componentName, version, branchName) {
  awsCodeBuild credentialsType: 'jenkins',
      credentialsId: 'codebuild',
      projectName: 'build-ui-client-images',
      region: 'us-west-2',
      imageOverride: 'aws/codebuild/standard:5.0',
      sourceControlType: 'project',
      sourceVersion: gitCommitId,
      envVariables: "[ {CONTAINER_IMAGE_NAME, ${componentName}}, {VERSION, ${version}}, {BRANCH_NAME, ${branchName}} ]"
}

// Keep image tags for backend and ui-client in-sync as instanactl only accepts a single version
// and expects all components to have an image with that version
def retagBackend(backendComponents, branchName, instanaVersion, instanaImageVersion) {
  def backendStableVersion =
      sh(returnStdout: true, script: "./build/ci-shared-tools/scripts/componentVersioning/getStableVersion.js backend ${branchName}").trim()
  def backendStableImageVersion = "3." + backendStableVersion.tokenize('.').drop(1).join('.') + "-0"

  def retagBackendComponents = [:]
  backendComponents.each {
      retagBackendComponents[it] = {
        sh "./build/ci-shared-tools/scripts/docker/retagImage.js containers.instana.io/instana/${branchName}/product/${it}:${backendStableImageVersion} containers.instana.io/instana/${branchName}/product/${it}:${instanaImageVersion}"
    }
  }
  parallel retagBackendComponents

  sh "./build/ci-shared-tools/scripts/markStableVersion.bash ui-client ${branchName} ${instanaVersion}"
  sh "./build/ci-shared-tools/scripts/markStableVersion.bash ui-client-saas ${branchName} ${instanaVersion}"
  currentBuild.description = "backend: ${backendStableVersion}, ui-client: ${instanaVersion}, Instana image version: ${instanaImageVersion}"
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
