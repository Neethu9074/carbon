#!groovy

// define global vars for use in later stages
def gitCommitId         = null
def gitCommitAuthor     = null
def gitMessage          = null
def instanaVersion      = null
def archiveName         = null
def latestReleaseBranch = null

def autoDeployReleaseFullstack = true

void setBuildStatus(String message, String state) {
  commitSha     = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()

  step([
      $class: "GitHubCommitStatusSetter",
      reposSource: [$class: "ManuallyEnteredRepositorySource", url: "https://api.github.com/instana/ui-client"],
      commitShaSource: [$class: "ManuallyEnteredShaSource", sha: commitSha],
      contextSource: [$class: "ManuallyEnteredCommitContextSource", context: "ci/jenkins/build-status"],
      errorHandlers: [[$class: "ChangingBuildStatusErrorHandler", result: "UNSTABLE"]],
      statusResultSource: [ $class: "ConditionalStatusResultSource", results: [[$class: "AnyBuildResult", message: message, state: state]] ]
  ]);
}

stage('Checkout') {
  node {
    deleteDir()

    checkout scm
    setBuildStatus('Build started', 'PENDING')

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

stage('Build') {
  node {
    try {
      awsCodeBuild credentialsType: 'jenkins',
        credentialsId: 'codebuild',
        projectName:
        'ui-client',
        region: 'us-west-2',
        sourceControlType: 'project',
        sourceVersion: gitCommitId,
        envVariables: '[ {EXTERNAL_CONTAINER_TAG_OVERWRITE, ' + instanaVersion + '} ]'

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

stage('Deployment') {
  milestone label: "deployment"

  def deployments = [:]

  deployments['deploy-release'] = {
    if ( env.BRANCH_NAME == latestReleaseBranch && autoDeployReleaseFullstack ) {
      node {
        echo "Deploying develop:${instanaVersion} to release-instana.instana.io ..."

        build job: '/deployment/fullstack-deploy-ui-client', parameters: [
          string(name: 'ENVIRONMENT', value: 'release'),
          string(name: 'VERSION', value: instanaVersion),
          string(name: 'BRANCH', value: env.BRANCH_NAME)
        ]

        slackNotification('Deploy Release', 'ui-client', gitCommitId, currentBuild.currentResult, env.BRANCH_NAME)
      }
    }
  }

  parallel deployments
}

stage('Storybook build') {
  if (env.BRANCH_NAME == 'develop') {
    node {
      runNodeBuild(gitCommitId, 'yarn && yarn run storybookBuild')
      if ( currentBuild.currentResult == 'SUCCESS' ) {
        stash includes: "storybookTarget/**/*", name: "ui-client-storybook-build-${gitCommitId}"
      }
    }
    slackNotification('Storybook build', 'ui-client', gitCommitId, currentBuild.currentResult)
  }
}

stage('Deploy Storybook to S3') {
  if (env.BRANCH_NAME == 'develop') {
    node {
      sh "s3cmd sync --no-mime-magic --guess-mime-type --delete-removed ./storybookTarget/ s3://storybook.instana.io/7550eeca-f0eb-4039-b87a-c3fbd0d2eaad/${env.BRANCH_NAME}/"
    }
    slackNotification('Storybook S3 Deployment', 'ui-client', gitCommitId, currentBuild.currentResult)
  }
}

def runNodeBuild(gitCommitId, buildCommands) {
  deleteDir()
  unstash name: "ui-client-checkout-${gitCommitId}"
  runNodeScriptInCurrentWorkDir(buildCommands)
}

def runNodeScriptInCurrentWorkDir(buildCommands) {
  sh '''
    source $HOME/.nvm/nvm.sh
    nvm use
    if [ -z "$(which yarn)" ]; then
      npm install -g yarn@1.21.1
    fi
    if [ "$(yarn --version)" != "1.21.1" ]; then
      npm install -g yarn@1.21.1
    fi
  '''
  sh 'source $HOME/.nvm/nvm.sh && nvm use && ' + buildCommands
}
