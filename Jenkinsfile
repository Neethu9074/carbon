#!groovy

// define global vars for use in later stages
def gitCommitId     = null
def gitCommitAuthor = null
def instanaVersion  = null
def archiveName     = null

stage('Checkout') {
  node {

    deleteDir()

    checkout scm

    instanaVersion  = getVersion('ui-client')
    gitCommitId     = sh(returnStdout: true, script: 'git rev-parse HEAD').trim().take(8)
    gitCommitAuthor = sh(returnStdout: true, script: "git --no-pager show -s --format='%ae' $gitCommitId").trim()

    currentBuild.displayName = "#${env.BUILD_NUMBER}: ${gitCommitId} -> ${instanaVersion}"

    archiveName = "ui-client-${env.BRANCH_NAME}-${instanaVersion}.tar.gz"

    stash includes: "**/*", name: "ui-client-checkout-${gitCommitId}", useDefaultExcludes: false
  }
}

def deliveryBranches = [
  'develop',
  'master',
  'release',
  'prerelease'
]

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
      runNodeBuild(gitCommitId, 'yarn && COM_INSTANA_IMAGE_TAG=' + instanaVersion + ' yarn run build')
      if ( currentBuild.currentResult == 'SUCCESS' ) {
        if ( deliveryBranches.contains(env.BRANCH_NAME) ) {
          uploadReleaseArtifact(archiveName, 'target/*', 'ui-client', env.BRANCH_NAME, instanaVersion)
        }
        markStableVersion('ui-client', env.BRANCH_NAME, instanaVersion)
        stash includes: "${archiveName}, deployment/**/*", name: "ui-client-build-${gitCommitId}"
      }
    }
  }

  parallel buildSteps

  slackNotification('Node Build', 'ui-client', gitCommitId, currentBuild.currentResult)
}

stage ('Container Build') {

  if ( deliveryBranches.contains(env.BRANCH_NAME) ) {
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

  def deployments = [:]
  deployments['deploy-test'] = {
    if ( env.BRANCH_NAME == 'develop' ) {
      node {
        echo "Deploying develop:${instanaVersion} to test.instana.io ..."

        build job: '/deployment/fullstack-deploy-ui-client', parameters: [
          string(name: 'ENVIRONMENT', value: 'test'),
          string(name: 'VERSION', value: instanaVersion)
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
    if ( env.BRANCH_NAME == 'release' ) {
      node {
        echo "Deploying develop:${instanaVersion} to release-instana.instana.io ..."

        build job: '/deployment/fullstack-deploy-ui-client', parameters: [
          string(name: 'ENVIRONMENT', value: 'release'),
          string(name: 'VERSION', value: instanaVersion)
        ]

        slackNotification('Deploy Release', 'ui-client', gitCommitId, currentBuild.currentResult)
      }
    }
  }

  parallel deployments
}

stage('Storybook build') {
  if (env.BRANCH_NAME == 'design_lib' ) {
    node {
      runNodeBuild(gitCommitId, 'yarn && npm run storybookBuild')
      if ( currentBuild.currentResult == 'SUCCESS' ) {
        stash includes: "storybookTarget/**/*", name: "ui-client-storybook-build-${gitCommitId}"
      }
    }
    slackNotification('Storybook build', 'ui-client', gitCommitId, currentBuild.currentResult)
  }
}

stage('Deploy Storybook to S3') {
  if (env.BRANCH_NAME == 'design_lib' ) {
    node {
      sh "s3cmd sync --no-mime-magic --guess-mime-type --delete-removed ./storybookTarget/ s3://storybook.instana.io/7550eeca-f0eb-4039-b87a-c3fbd0d2eaad/${env.BRANCH_NAME}/"
    }
    slackNotification('Storybook S3 Deployment', 'ui-client', gitCommitId, currentBuild.currentResult)
  }
}

def runNodeBuild(gitCommitId, buildCommands) {
  deleteDir()
  unstash name: "ui-client-checkout-${gitCommitId}"
  sh '''
    if [ -z "$(which yarn)" ]; then
      npm install -g yarn
    fi
  '''
  sh buildCommands
}
