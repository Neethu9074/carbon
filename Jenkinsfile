#!groovy

// define global vars for use in later stages
def gitCommitId     = null
def gitCommitAuthor = null
def instanaVersion  = null
def archiveName     = null

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

    instanaVersion  = getVersion('ui-client', env.BRANCH_NAME)
    gitCommitId     = sh(returnStdout: true, script: 'git rev-parse HEAD').trim().take(8)
    gitCommitAuthor = sh(returnStdout: true, script: "git --no-pager show -s --format='%ae' $gitCommitId").trim()

    currentBuild.displayName = "#${env.BUILD_NUMBER}: ${gitCommitId} -> ${instanaVersion}"

    archiveName = "ui-client-${env.BRANCH_NAME}-${instanaVersion}.tar.gz"

    stash includes: "**/*", name: "ui-client-checkout-${gitCommitId}", useDefaultExcludes: false
  }
}

stage('Node Build') {
  def buildSteps = [:]

  buildSteps['test'] = {
    node {
      runNodeBuild(gitCommitId, 'yarn && yarn run test:unit')
    }
  }
  buildSteps['lint'] = {
    node {
      runNodeBuild(gitCommitId, 'yarn && yarn run test:lint')
    }
  }
  buildSteps['build'] = {
    node {
      runNodeBuild(gitCommitId, 'COM_INSTANA_IMAGE_TAG=' + instanaVersion + ' yarn && COM_INSTANA_IMAGE_TAG=' + instanaVersion + ' yarn run build')
      if ( currentBuild.currentResult == 'SUCCESS' ) {
        if ( isDeliveryBranch(env.BRANCH_NAME) ) {
          runNodeScriptInCurrentWorkDir('yarn run test:compression')
        }
        if ( isDeliveryBranch(env.BRANCH_NAME) ) {
          uploadReleaseArtifact(archiveName, 'target/*', 'ui-client', env.BRANCH_NAME, instanaVersion)
        }
        markStableVersion('ui-client', env.BRANCH_NAME, instanaVersion)
        setBuildStatus('Build successful', 'SUCCESS')
        stash includes: "${archiveName}, deployment/**/*", name: "ui-client-build-${gitCommitId}"
      } else {
        setBuildStatus('Build failed', 'FAILURE')
      }
    }
  }

  parallel buildSteps

  slackNotification('Node Build', 'ui-client', gitCommitId, currentBuild.currentResult)
}

stage ('Container Build') {

  if ( isDeliveryBranch(env.BRANCH_NAME) ) {
    containerBuild {
      component    = 'ui-client'
      commitId     = gitCommitId
      commitAuthor = gitCommitAuthor
      version      = instanaVersion
    }
  }

  slackNotification('Container Build', 'ui-client', gitCommitId, currentBuild.currentResult)
}

stage('Deployment') {
  milestone label: "deployment"

  if ( env.BRANCH_NAME == 'master' || env.BRANCH_NAME == 'develop' || env.BRANCH_NAME.startsWith('release') ) {
    build job: '/deployment/k8s-deploy', parameters: [
      string(name: 'BRANCH', value: env.BRANCH_NAME)
    ]
  }
  def deployments = [:]
  deployments['deploy-test'] = {
    if ( env.BRANCH_NAME == 'develop' ) {
      node {
        echo "Deploying develop:${instanaVersion} to test.instana.io ..."

        build job: '/deployment/fullstack-deploy-ui-client', parameters: [
          string(name: 'ENVIRONMENT', value: 'test'),
          string(name: 'VERSION', value: instanaVersion),
          string(name: 'BRANCH', value: env.BRANCH_NAME)
        ]

        slackNotification('Deploy Test', 'ui-client', gitCommitId, currentBuild.currentResult)
      }
    }
  }
  deployments['deploy-staging'] = {
    if ( env.BRANCH_NAME == 'master' ) {
      node {
        echo "Deploying master:${instanaVersion} to staging.instana.io ..."

        build job: '/deployment/staging/deploy-ui-client', parameters: [
          string(name: 'VERSION', value: instanaVersion)
        ]

        slackNotification('Deploy Staging', 'ui-client', gitCommitId, currentBuild.currentResult)
      }
    }
  }
  deployments['deploy-release'] = {
    if ( env.BRANCH_NAME.startsWith('release-') ) {
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
  if (env.BRANCH_NAME == 'develop' ) {
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
  if (env.BRANCH_NAME == 'develop' ) {
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
      npm install -g yarn@1.9.4
    fi
  '''
  sh 'source $HOME/.nvm/nvm.sh && nvm use && ' + buildCommands
}
