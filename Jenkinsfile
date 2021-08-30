#!groovy

// define global vars for use in later stages
def branchName          = env.BRANCH_NAME
def isDeliveryBranch    = null
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
          if (branchName.contains('/') || branchName.contains(',')) {
            setBuildStatus('Build failure', 'FAILURE')
            error "Build aborted: Branch names containing slashes or commas aren't allowed. Please rename your branch."
          }

          // Set up the shared tooling
          withCredentials([string(credentialsId: 'GH_IBM_API_TOKEN', variable: 'GITHUB_API_TOKEN')]) {
            sh "./build/download-ci-shared-tools.bash"
            sh "./build/ci-shared-tools/scripts/setup.bash"
          }

          isDeliveryBranch = sh(returnStdout: true, script: "./build/ci-shared-tools/scripts/isDeliveryBranch.js") == 'true'
          latestReleaseBranch = getLatestReleaseBranch()
          instanaUiClientVersion = getVersion('ui-client', branchName)
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

          currentBuild.displayName = "#${env.BUILD_NUMBER}: ${gitCommitId.take(8)} -> ${instanaUiClientVersion}"
          archiveName = "ui-client-${branchName}-${instanaUiClientVersion}.tar.gz"
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
                  envVariables: '[ {EXTERNAL_CONTAINER_TAG_OVERWRITE, ' + instanaUiClientVersion + '}, {BRANCH_NAME, ' + branchName + '}, {GIT_BRANCH, ' + branchName + '} ]'

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

    stage('Build & Push ui-client images') {
      steps {
        // Only allow 1 concurrent build is allowed to build images at a time and newer
        // builds are pulled off the queue first. When the a build reaches the milestone
        // at the end of the lock, all jobs started prior to the current build that are
        // still waiting for the lock will be aborted
        // https://www.jenkins.io/blog/2016/10/16/stage-lock-milestone/
        lock(resource: "build-ui-client-images-${branchName}", inversePrecedence: true) {
          timeout(time: 15, unit: 'MINUTES') {
            timestamps {
              script {
                if (isDeliveryBranch) {
                  instanaImageVersion = sh(returnStdout: true, script: "./build/ci-shared-tools/scripts/componentVersioning/getInstanaImageVersion.js ${branchName}").trim() + "-0"
                  buildAndPublishImages(gitCommitId, backendComponents, uiClientComponents, branchName, instanaUiClientVersion, instanaImageVersion)
                }
              }
            }
          }
          milestone(label: "Build & Push ui-client images", ordinal: null)
        }
      }
    }

    stage ('Retag backend images') {
      steps {
        // Only allow 1 concurrent build is allowed to run at a time and newer
        // builds are pulled off the queue first
        lock(resource: "retag-backend-images-${branchName}", inversePrecedence: true) {
          timeout(time: 30, unit: 'MINUTES') {
            timestamps {
              script {
                if (isDeliveryBranch) {
                  rebuildBackend(backendComponents, branchName, instanaUiClientVersion, instanaImageVersion)
                }
              }
            }
          }
          milestone(label: "Retag ui-client images", ordinal: null)
        }
      }
    }

    stage('Deploy') {
      steps {
        // This lock is shared with the backend pipeline as well so as only to allow
        // one deploy per deployable branch at a time
        lock(resource: "deploy-instana-${branchName}", inversePrecedence: true) {
          timeout(time: 30, unit: 'MINUTES') {
            timestamps {
              script {
                // Enable only for the develop branch for now
                // Other delivery branches will use 'K8s Deploy'
                if (branchName == 'develop') {
                  deployInstana(branchName, instanaImageVersion, null, 'pink', 'instana', 'test')
                } else if (branchName == latestReleaseBranch) {
                  deployInstana(branchName, instanaImageVersion, null, 'magenta', 'instana', 'release')
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
              if (branchName == 'develop'
                  || branchName.startsWith('release-')
                  || branchName.startsWith('storybook-')
                  || branchName.startsWith('chromatic-')) {

                  try {
                    def RUN_UI_TEST_ON_DELIVERY =
                      (branchName.startsWith('storybook-') || branchName.startsWith('chromatic-')) ? "true" : "false"

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
  def buildAndPublish = [:]
  uiClientComponents.each { component ->
    buildAndPublish[component] = {
      buildAndPublishImage(gitCommitId, component, branchName, instanaUiClientVersion, instanaImageVersion)
    }
  }
  parallel buildAndPublish

  markStableImageVersions(branchName, instanaImageVersion)
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

def markStableImageVersions(branchName, instanaImageVersion) {
  sh "./build/ci-shared-tools/scripts/markStableVersion.bash instana-image-from-ui-client ${branchName} ${instanaImageVersion}" // so the backend pipeline can lookup the latest version built by the ui-client pipeline
  sh "./build/ci-shared-tools/scripts/markStableVersion.bash instana-image ${branchName} ${instanaImageVersion}" // single source of latest stable Instana image version
}

// Keep image tags for backend and ui-client in-sync as instanactl only accepts a single version
// and expects all components to have an image with that version
def rebuildBackend(backendComponents, branchName, instanaUiClientVersion, instanaImageVersion) {
  try {
    waitForStableBackendVersions(branchName)
    def instanaOpenShiftImageVersion = instanaImageVersion - "-0" + "-openshift"
    def backendStableVersion =
        sh(returnStdout: true, script: "./build/ci-shared-tools/scripts/componentVersioning/getStableVersion.js backend ${branchName}").trim()
    def backendStableImageVersion = sh(returnStdout: true, script: "./build/ci-shared-tools/scripts/componentVersioning/getStableVersion.js instana-image-from-backend ${branchName}").trim()

    def rebuildBackendComponents = [:]
    backendComponents.each {
        def currentBackendTag = "containers.instana.io/instana/${branchName}/product/${it}:${backendStableImageVersion}"
        def newBackendTag = "containers.instana.io/instana/${branchName}/product/${it}:${instanaImageVersion}"
        def newBackendOpenShiftTag = "containers.instana.io/instana/${branchName}/product/${it}:${instanaOpenShiftImageVersion}"
        rebuildBackendComponents[it] = {
          sh """
          ./build/ci-shared-tools/scripts/docker/imageOverride.js \
          ${currentBackendTag} \
          ${newBackendTag} \
          "--build-arg current_fully_qualified_tag=${currentBackendTag} --label com.instana.image.tag=${instanaImageVersion}"
          """
          sh """
          ./build/ci-shared-tools/scripts/docker/imageOverride.js \
          ${currentBackendTag} \
          ${newBackendOpenShiftTag} \
          "--build-arg current_fully_qualified_tag=${currentBackendTag} --label com.instana.image.tag=${instanaOpenShiftImageVersion}"
          """
      }
    }
    parallel rebuildBackendComponents

    currentBuild.description = "backend: ${backendStableVersion}, ui-client: ${instanaUiClientVersion}, Instana image version: ${instanaImageVersion}"    
    notifySuccess('k8s-notification', "<${env.BUILD_URL}|${env.JOB_NAME} #${env.BUILD_NUMBER}>: Successfully built K8S image *${instanaImageVersion}* \n\n${currentBuild.description}")
  } catch(e) {
    notifyFailure('k8s-notification', "<${env.BUILD_URL}|${env.JOB_NAME} #${env.BUILD_NUMBER}>: Failed to build K8S image *${instanaImageVersion}* \n\n${currentBuild.description}")
    throw e
  }
}

def waitForStableBackendVersions(branchName) {
  waitUntil {
    try {
      sh(returnStdout: true, script: "./build/ci-shared-tools/scripts/componentVersioning/getStableVersion.js backend ${branchName}")
      sh(returnStdout: true, script: "./build/ci-shared-tools/scripts/componentVersioning/getStableVersion.js instana-image-from-backend ${branchName}")
      true
    } catch(ignored) {
      false
    }
  }
}

def deployInstana(branchName, version, globalEnvironment, environment, tenant, unit) {
  try {
    if (globalEnvironment != null) {
      println "Updating global environment ${globalEnvironment}"
      sh "sed -i 's/^  branch\\s*=.*\$/  branch         = \"${branchName}\"/g' /mnt/efs/data/instanactl/dev-jenkins-config/${globalEnvironment}.hcl"
      sh "sed -i 's/^  version\\s*=.*\$/  version        = \"${version}\"/g' /mnt/efs/data/instanactl/dev-jenkins-config/${globalEnvironment}.hcl"
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
      sh "sed -i 's/^  branch\\s*=.*\$/  branch         = \"${branchName}\"/g' /mnt/efs/data/instanactl/dev-jenkins-config/${environment}.hcl"
      sh "sed -i 's/^  version\\s*=.*\$/  version        = \"${version}\"/g' /mnt/efs/data/instanactl/dev-jenkins-config/${environment}.hcl"
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
