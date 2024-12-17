#!groovy

@Library('instana-ci') _

// define global vars for use in later stages
def branchName          = env.BRANCH_NAME
def isDeliveryBranch    = null
def isLTSRBranch        = null
def gitCommitId         = null
def gitCommitAuthor     = null
def gitCommitAuthorName = null
def gitMessage          = null
def instanaUiClientVersion = null
def instanaImageVersion = null
def majorReleaseVersion = null
def archiveName         = null
def latestReleaseBranch = null
def backendComponents   = null
def uiClientComponents  = null
def backendRepoPath     = null
// Check if this job is running on "backend-jenkins"
// Call out to the shared library https://github.ibm.com/instana/jenkins
def isBackendJenkins = isBackendJenkins()

void setBuildStatus(String message, String state) {
  def commitSha = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()

  step([
      $class: "GitHubCommitStatusSetter",
      reposSource: [$class: "ManuallyEnteredRepositorySource", url: "https://github.ibm.com/instana/ui-client"],
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
  environment {
    INSTANA_VERSION_PROVIDER_SERVER_URL = 'http://10.16.108.135:80'
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

          // Check if running on backend-jenkins
          println "isBackendJenkins = ${isBackendJenkins}"

          isDeliveryBranch = sh(returnStdout: true, script: "./build/ci-shared-tools/scripts/isDeliveryBranch.js") == 'true'
          isLTSRBranch = sh(returnStdout: true, script: "./build/ci-shared-tools/scripts/isLTSRBranch.js") == 'true'
          latestReleaseBranch = getLatestReleaseBranch()
          instanaUiClientVersion = sh(returnStdout: true, script: "ci-shared-tools component-versions get-version ui-client ${branchName} 0").trim()
          majorReleaseVersion = instanaUiClientVersion.tokenize('.')[1].toInteger()
          gitCommitId         = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
          gitCommitAuthor     = sh(returnStdout: true, script: "git --no-pager show -s --format='%ae' $gitCommitId").trim()
          gitCommitAuthorName = sh(returnStdout: true, script: "git show -s --pretty=%an").trim()
          gitMessage          = sh(returnStdout: true, script: "git log -1 --pretty=format:'%an (<https://github.ibm.com/instana/ui-client/commit/%h|%h>): %s'").trim()
          // https://github.ibm.com/instana/jenkins/blob/develop/vars/getBackendComponents.groovy
          backendComponents = getBackendComponents()
              .findAll { it.isIncludedInRelease(majorReleaseVersion) && !(it.name ==~ /^ui-client.*/) }
              .collect { it.name }
              .plus(['ingress', 'ingress-global', 'ingress-otlp-acceptor'])
          uiClientComponents = getBackendComponents()
              .findAll { it.isIncludedInRelease(majorReleaseVersion) && (it.name ==~ /^ui-client.*/) }
              .collect { it.name }

          currentBuild.displayName = "#${env.BUILD_NUMBER}: ${gitCommitId.take(8)} -> ${instanaUiClientVersion}"
          archiveName = "ui-client-${branchName}-${instanaUiClientVersion}.tar.gz"
          stash includes: "**/*", name: "ui-client-checkout-${gitCommitId}", useDefaultExcludes: false
        }
      }
    }

    stage('Build and Test') {
      parallel {
        stage('Build') {
          steps {
            timeout(time: 30, unit: 'MINUTES') {
              timestamps {
                script {
                  try {
                    awsCodeBuild credentialsType: 'jenkins',
                      credentialsId: 'codebuild',
                      projectName: 'ui-client',
                      region: 'us-west-2',
                      imageOverride: 'aws/codebuild/standard:7.0',
                      sourceControlType: 'project',
                      sourceVersion: gitCommitId,
                      buildSpecFile: 'buildspec.yml',
                      envVariables: '[ {EXTERNAL_CONTAINER_TAG_OVERWRITE, ' + instanaUiClientVersion + '}, {BRANCH_NAME, ' + branchName + '}, {GIT_BRANCH, ' + branchName + '} ]'

                    if ( currentBuild.currentResult == 'SUCCESS' ) {
                      setBuildStatus('Build successful', 'SUCCESS')
                    }
                  } catch (e) {
                    setBuildStatus('Build Failure', 'FAILURE')
                    if ( branchName.startsWith('typescript-typedefinitions-')) {
                      notifyTsUpdateFailure(branchName,gitCommitId)
                    }
                    if (isDeliveryBranch) {
                      notifyDeliveryBuildFailure(branchName, gitCommitId, gitMessage)
                    }
                    throw e
                  }
                }
              }
            }
          }
        }

        stage('Test') {
          steps {
            timeout(time: 30, unit: 'MINUTES') {
              timestamps {
                script {
                  try {
                    awsCodeBuild credentialsType: 'jenkins',
                      credentialsId: 'codebuild',
                      projectName: 'ui-client',
                      region: 'us-west-2',
                      imageOverride: 'aws/codebuild/standard:7.0',
                      sourceControlType: 'project',
                      sourceVersion: gitCommitId,
                      buildSpecFile: 'buildspec.test.yml',
                      envVariables: '[ {EXTERNAL_CONTAINER_TAG_OVERWRITE, ' + instanaUiClientVersion + '}, {BRANCH_NAME, ' + branchName + '}, {GIT_BRANCH, ' + branchName + '} ]'

                    if ( currentBuild.currentResult == 'SUCCESS' ) {
                      setBuildStatus('Build successful', 'SUCCESS')
                    }
                  } catch (e) {
                    setBuildStatus('Build Failure', 'FAILURE')
                    if ( branchName.startsWith('typescript-typedefinitions-')) {
                      notifyTsUpdateFailure(branchName,gitCommitId)
                    }
                    if (isDeliveryBranch) {
                      notifyDeliveryBuildFailure(branchName, gitCommitId, gitMessage)
                    }
                    throw e
                  }
                }
              }
            }
          }
        }
      }
    }

    stage ('Mark stable ui-client version') {
      steps {
        milestone(label: "Mark stable ui-client version", ordinal: null)
        timeout(time: 10, unit: 'MINUTES') {
          timestamps {
            script {
              if (isDeliveryBranch) {
                // Mark stable version in Instana's own versioning system only on delivery branches
                // as this value is only used on further build stages on delivery branches
                sh "ci-shared-tools component-versions mark-stable-version ui-client ${branchName} ${instanaUiClientVersion}"
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
          timeout(time: 45, unit: 'MINUTES') {
            timestamps {
              script {
                if (isDeliveryBranch || isLTSRBranch) {
                  instanaImageVersion = sh(returnStdout: true, script: "ci-shared-tools component-versions get-instana-image-version ${branchName}").trim() + "-0"
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
      // Only delivery branches require retagging. Check before waiting on the lock.
      when {
        expression {
          return isDeliveryBranch
        }
      }
      steps {
        // Only allow 1 concurrent delivery branch build is allowed to run at a time
        lock(resource: "retag-backend-images") {
          timeout(time: 75, unit: 'MINUTES') {
            timestamps {
              script {
                def path = "int-docker-backend-local"
                if (isLTSRBranch) {
                    path = "int-docker-backend-lts-local"
                }
                if (isDeliveryBranch) {
                   backendRepoPath = "delivery.instana.io/${path}/backend"
                } else {
                   backendRepoPath = "delivery.instana.io/${path}/backend/dev/${branchName}"
                }
                if (isDeliveryBranch) {
                  rebuildBackend(backendComponents, branchName, instanaUiClientVersion, instanaImageVersion, backendRepoPath)
                }
              }
            }
          }
          milestone(label: "Retag backend images", ordinal: null)
        }
      }
    }

    stage('Deploy') {
      parallel {
        stage('Deploy') {
          steps {
            // This lock is shared with the backend pipeline as well so as only to allow
            // one deploy per deployable branch at a time
            lock(resource: "deploy-instana-${branchName}", inversePrecedence: true) {
              timeout(time: 45, unit: 'MINUTES') {
                timestamps {
                  script {
                    // Enable only for the develop branch for now
                    // Other delivery branches will use 'K8s Deploy'
                    if (branchName == 'develop') {
                      deployInstana(branchName, gitCommitId, instanaImageVersion, null, 'pink', 'instana', 'test', isBackendJenkins)
                    } else if (branchName == latestReleaseBranch) {
                      deployInstana(branchName, gitCommitId, instanaImageVersion, null, 'magenta', 'instana', 'release', isBackendJenkins)
                    }
                  }
                }
              }
            }
          }
        }

        stage('Deploy Storybook') {
          steps {
            timeout(time: 30, unit: 'MINUTES') {
              timestamps {
                script {
                  if (branchName == 'develop') {
                      try {
                        awsCodeBuild credentialsType: 'jenkins',
                          credentialsId: 'codebuild',
                          projectName: 'ui-client-storybook',
                          region: 'us-west-2',
                          imageOverride: 'aws/codebuild/standard:7.0',
                          sourceControlType: 'project',
                          sourceVersion: gitCommitId,
                          privilegedModeOverride: 'True'
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
      imageOverride: 'aws/codebuild/standard:7.0',
      sourceControlType: 'project',
      sourceVersion: gitCommitId,
      envVariables: "[ {CONTAINER_IMAGE_NAME, ${componentName}}, {ARTIFACT_VERSION, ${instanaUiClientVersion}}, {IMAGE_VERSION, ${instanaImageVersion}}, {BRANCH_NAME, ${branchName}} ]"
}

def markStableImageVersions(branchName, instanaImageVersion) {
  sh "ci-shared-tools component-versions mark-stable-version instana-image-from-ui-client ${branchName} ${instanaImageVersion}" // so the backend pipeline can lookup the latest version built by the ui-client pipeline
  sh "ci-shared-tools component-versions mark-stable-version instana-image ${branchName} ${instanaImageVersion}" // single source of latest stable Instana image version
}

// Keep image tags for backend and ui-client in-sync as instanactl only accepts a single version
// and expects all components to have an image with that version
def rebuildBackend(backendComponents, branchName, instanaUiClientVersion, instanaImageVersion, backendRepoPath) {
  try {
    waitForStableBackendVersions(branchName)
    def backendStableVersion =
        sh(returnStdout: true, script: "ci-shared-tools component-versions get-stable-version backend ${branchName}").trim()
    def backendStableImageVersion = sh(returnStdout: true, script: "ci-shared-tools component-versions get-stable-version instana-image-from-backend ${branchName}").trim()

    def rebuildBackendComponents = [:]
    backendComponents.each {
        def currentBackendTag = "${backendRepoPath}/${it}:${backendStableImageVersion}"
        def newBackendTag = "${backendRepoPath}/${it}:${instanaImageVersion}"
        rebuildBackendComponents[it] = {
            withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId:'delivery-instana-io-internal-project-artifact-read-writer-creds', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
              sh """
              INSTANA_ARTIFACTORY_USERNAME=$USERNAME INSTANA_ARTIFACTORY_PASSWORD=$PASSWORD \
              ./build/ci-shared-tools/scripts/docker/imageOverride.js \
              ${currentBackendTag} \
              ${newBackendTag} \
              "--build-arg current_fully_qualified_tag=${currentBackendTag} --label com.instana.image.tag=${instanaImageVersion}"
              """
            }
        }
    }
    parallel rebuildBackendComponents

    currentBuild.description = "backend: ${backendStableVersion}, ui-client: ${instanaUiClientVersion}, Instana image version: ${instanaImageVersion}"
    notifySuccess('k8s-notification', "<${env.BUILD_URL}|${env.JOB_NAME} #${env.BUILD_NUMBER}>: Successfully built K8S image *${instanaImageVersion}* \n\n${currentBuild.description}")
  } catch(e) {
    notifyFailure('k8s-notification', "<${env.BUILD_URL}|${env.JOB_NAME} #${env.BUILD_NUMBER}>: Failed to build K8S image *${instanaImageVersion}* \n\n${currentBuild.description}")
    notifyGeneralBuildFailure(branchName)
    throw e
  }
}

def waitForStableBackendVersions(branchName) {
  waitUntil {
    try {
      sh(returnStdout: true, script: "ci-shared-tools component-versions get-stable-version backend ${branchName}")
      sh(returnStdout: true, script: "ci-shared-tools component-versions get-stable-version instana-image-from-backend ${branchName}")
      true
    } catch(ignored) {
      false
    }
  }
}

def deployInstana(branchName, gitCommitId, version, globalEnvironment, environment, tenant, unit, isBackendJenkins) {
  try {

    def configDir = "/mnt/efs/data/instanactl/dev-jenkins-config"

    //setup all the prerequisites instanactl needs to run on backend-jenkins
    if (isBackendJenkins) {
      configDir = "${WORKSPACE}/config"
      withCredentials([string(credentialsId: 'INSTANACTL_GIT_AUTH_TOKEN', variable: 'INSTANACTL_GIT_AUTH_TOKEN'),
                       string(credentialsId: 'instanactl-vault-key', variable: 'KEY')]) {
        sh "mkdir -p ${configDir}"
        sh "curl -H 'Accept: application/vnd.github.v3.raw' https://${INSTANACTL_GIT_AUTH_TOKEN}:@api.github.ibm.com/repos/instana/infrastructure/contents/instanactl/scripts/config/1-global.hcl -o ${configDir}/1-global.hcl"
        sh "curl -H 'Accept: application/vnd.github.v3.raw' https://${INSTANACTL_GIT_AUTH_TOKEN}:@api.github.ibm.com/repos/instana/infrastructure/contents/instanactl/scripts/config/${environment}.hcl -o ${configDir}/${environment}.hcl"

        if (globalEnvironment != null) {
          sh "curl -H 'Accept: application/vnd.github.v3.raw' https://${INSTANACTL_GIT_AUTH_TOKEN}:@api.github.ibm.com/repos/instana/infrastructure/contents/instanactl/scripts/config/${globalEnvironment}.hcl -o ${configDir}/${globalEnvironment}.hcl"
        }

        sh "curl -H 'Accept: application/vnd.github.v3.raw' https://${INSTANACTL_GIT_AUTH_TOKEN}:@api.github.ibm.com/repos/instana/infrastructure/contents/instanactl/scripts/config/vault-test.properties.enc -o ${configDir}/vault-test.properties.enc"
        sh "openssl enc -d -aes-256-cbc -md md5 -in ${configDir}/vault-test.properties.enc -out ${configDir}/vault-test.properties -k \"${KEY}\""
        withCredentials([aws(credentialsId: "eks-developer-creds")]) {
          env.INSTANACTL_VAULT="${configDir}/vault-test.properties"
          env.INSTANACTL_CONFIG="${configDir}/config.hcl"
          env.KUBECONFIG="${WORKSPACE}/kube.conf"
          sh """
            aws eks update-kubeconfig --name k8s-infra-us-west-2 --region us-west-2 --alias instana-${environment} --kubeconfig=${env.KUBECONFIG}
            kubectl config set-context instana-${environment} --namespace instana-${environment}
            """
          if (globalEnvironment != null) {
            sh """
              aws eks update-kubeconfig --name k8s-infra-us-west-2 --region us-west-2 --alias instana-${globalEnvironment} --kubeconfig=${env.KUBECONFIG}
              kubectl config set-context instana-${globalEnvironment} --namespace instana-${globalEnvironment}
              echo "Updating global environment ${globalEnvironment}"
              sed -i 's/^  branch\\s*=.*\$/  branch         = \"${branchName}\"/g' ${configDir}/${globalEnvironment}.hcl
              sed -i 's/^  version\\s*=.*\$/  version        = \"${version}\"/g' ${configDir}/${globalEnvironment}.hcl
              kubectl config use-context instana-${globalEnvironment}
              instanactl --deployment ${globalEnvironment} global migrate --branch=${branchName}
              instanactl --deployment ${globalEnvironment} global update --version=${version} --branch=${branchName}
              """
          }
          sh "kubectl config use-context instana-${environment}"
          if (tenant != null && unit != null) {
            sh """
              echo "Updating tenant unit ${tenant}-${unit} in ${environment}"
              instanactl --deployment ${environment} core migrate --branch ${branchName}
              instanactl --deployment ${environment} core update --version ${version} --branch ${branchName}
              instanactl --deployment ${environment} tenantunit migrate ${tenant} ${unit} --branch ${branchName}
              instanactl --deployment ${environment} tenantunit update ${tenant} ${unit} --version ${version} --branch ${branchName}
              """
          } else {
            sh """
              echo "Updating all tenant units in ${environment}"
              sed -i 's/^  branch\\s*=.*\$/  branch         = \"${branchName}\"/g' ${configDir}/${environment}.hcl
              sed -i 's/^  version\\s*=.*\$/  version        = \"${version}\"/g' ${configDir}/${environment}.hcl
              instanactl --deployment ${environment} tenantunit list
              instanactl --deployment ${environment} upgrade --version=${version} --branch=${branchName}
              """
          }
        } // withCredentials eks-developer-creds
      } // withCredentials
    } else {  // dev-Jenkins only
      if (globalEnvironment != null) {
        println "Updating global environment ${globalEnvironment}"
        sh "sed -i 's/^  branch\\s*=.*\$/  branch         = \"${branchName}\"/g' ${configDir}/${globalEnvironment}.hcl"
        sh "sed -i 's/^  version\\s*=.*\$/  version        = \"${version}\"/g' ${configDir}/${globalEnvironment}.hcl"
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
        sh "sed -i 's/^  branch\\s*=.*\$/  branch         = \"${branchName}\"/g' ${configDir}/${environment}.hcl"
        sh "sed -i 's/^  version\\s*=.*\$/  version        = \"${version}\"/g' ${configDir}/${environment}.hcl"
        sh "instanactl --deployment ${environment} tenantunit list"
        sh "instanactl --deployment ${environment} upgrade --version=${version} --branch=${branchName}"
      }
    } // isBackendJenkins or dev-Jenkins
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

def notifyTsUpdateFailure(branchName,gitCommitId) {
  def message = new StringBuilder()
  message.append(":typescript: update failed on `${branchName}` :boom:\n")
  message.append("<https://github.ibm.com/instana/ui-client/pulls?q=is%3Apr+is%3Aopen+%5BTypeDefs%5D|:octocat: View PR on github>\n")
  message.append("<${env.BUILD_URL}|:mag: Open jenkins build #${env.BUILD_NUMBER}>\n")
  message.append("<https://github.ibm.com/instana/ui-client/commit/${gitCommitId}|:merge: Commit ${gitCommitId.take(8)}>\n")

  notifyFailure('tech-ui-dev', message.toString())
}

def notifyDeliveryBuildFailure(branchName, gitCommitID, gitCommitMessage) {
  def commitTitle = gitCommitMessage.split("\n")[0];
  def message = new StringBuilder()
  message.append(":rotating_light: `${branchName}` failed to build\n")
  message.append(":books: Commit Title: `${commitTitle}`")
  message.append("<https://github.ibm.com/instana/ui-client/commit/${gitCommitId}|:merge: Commit ${gitCommitId.take(8)}>\n")
  message.append("<${env.BUILD_URL}|:mag: Open jenkins build #${env.BUILD_NUMBER}>")

  notifyFailure('tech-ui-dev', message.toString())
  notifyGeneralBuildFailure(branchName)
}

def notifyGeneralBuildFailure(branchName) {
  if (branchName.startsWith('release-')) {
    notifyFailure('dev-notification', "<${env.BUILD_URL}|:alert2: ${env.JOB_NAME} #${env.BUILD_NUMBER}> failed! :cry:")
  }
}
