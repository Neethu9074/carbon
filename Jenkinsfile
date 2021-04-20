#!groovy

// define global vars for use in later stages
def gitCommitId         = null
def gitCommitAuthor     = null
def gitMessage          = null
def instanaVersion      = null
def archiveName         = null
def latestReleaseBranch = null

def autoDeployMagenta = true

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

  stages {
    stage ('Setup') {
      steps {
        milestone(label: "Setup", ordinal: null)
        setBuildStatus('Build started', 'PENDING')

        script {
          latestReleaseBranch = getLatestReleaseBranch()
          instanaVersion      = getVersion('ui-client', env.BRANCH_NAME)
          gitCommitId         = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
          gitCommitAuthor     = sh(returnStdout: true, script: "git --no-pager show -s --format='%ae' $gitCommitId").trim()
          gitMessage          = sh(returnStdout: true, script: "git log -1 --pretty=format:'%an (<https://github.com/instana/ui-client/commit/%h|%h>): %s'").trim()

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
                  slackNotification('Build successful', 'ui-client', gitCommitId, 'SUCCESS')
                  setBuildStatus('Build successful', 'SUCCESS')
                }
              } catch (e) {
                setBuildStatus('Build Failure', 'FAILURE')
                slackNotification('Build Failure', 'ui-client', gitCommitId, 'FAILURE')
                throw e
              }
            }
          }
        }
      }
    }

    stage('K8s Deploy') {
      steps {
        milestone(label: "K8s Deploy", ordinal: null)
        timeout(time: 30, unit: 'MINUTES') {
          timestamps {
            script {
              if (env.BRANCH_NAME == 'develop') {
                build job: '/retag-artifacts', parameters: [
                    string(name: 'BRANCH', value: env.BRANCH_NAME, trim: true),
                    string(name: 'ENVIRONMENT', value: 'pink', trim: true),
                    string(name: 'TENANT', value: 'instana', trim: true),
                    string(name: 'UNIT', value: 'test', trim: true),
                ]
              } else if ( env.BRANCH_NAME == latestReleaseBranch && autoDeployMagenta ) {
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
                      slackNotification('Storybook Build&Deploy Successful', 'ui-client', gitCommitId, 'SUCCESS')
                    }
                  } catch (e) {
                    slackNotification('Storybook Build&Deploy Failed', 'ui-client', gitCommitId, 'FAILURE')
                    throw e
                  }
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
        lock(resource: 'build-ui-client-images', inversePrecedence: true) {
          timeout(time: 15, unit: 'MINUTES') {
            timestamps {
              script {
                if (env.BRANCH_NAME == 'develop'
                    || env.BRANCH_NAME == latestReleaseBranch
                    || env.BRANCH_NAME ==~ /release-\d{3,}/
                    || env.BRANCH_NAME ==~ /hotfix-\d{3,}(-.+)?/) {

                  def majorReleaseVersion = instanaVersion.tokenize('.')[1].toInteger()
                  // https://github.com/instana/jenkins/blob/develop/vars/getBackendComponents.groovy
                  def uiClientComponents = getBackendComponents()
                      .findAll { it.isIncludedInRelease(majorReleaseVersion) && (it.name ==~ /^ui-client.*/) }
                      .collect { it.name }

                  awsCodeBuild credentialsType: 'jenkins',
                      credentialsId: 'codebuild',
                      projectName: 'build-ui-client-images',
                      region: 'us-west-2',
                      imageOverride: 'aws/codebuild/standard:5.0',
                      sourceControlType: 'project',
                      sourceVersion: gitCommitId,
                      envVariables: "[ {CONTAINER_IMAGE_NAMES, ${uiClientComponents}}, {VERSION, ${version}}, {BRANCH_NAME, ${branchName}} ]"
                }
              }
            }
          }
        }
      }
    }

  }
}
