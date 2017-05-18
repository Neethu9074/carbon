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
    gitCommitId     = sh(returnStdout: true, script: 'git rev-parse HEAD').trim().take(6)
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
      runNodeBuild(gitCommitId, 'yarn && yarn run build')
      sh "tar -czf ${archiveName} target/*"
      stash includes: "${archiveName}, deployment/**/*", name: "ui-client-build-${gitCommitId}"
    }
  }

  parallel buildSteps

  // upload artifact to Nexus for on-prem packaging if we are building master
  if ( env.BRANCH_NAME == 'master' ) {
    sh """
      mvn deploy:deploy-file \
        -DgroupId=com.instana \
        -DartifactId=ui-client-${env.BRANCH_NAME} \
        -Dversion=${instanaVersion} \
        -Dpackaging=tar.gz \
        -DrepositoryId=instana-releases \
        -Dclassifier=${env.BRANCH_NAME} \
        -Durl=https://repo-internal.instana.io/nexus/content/repositories/instana-releases \
        -Dfile=${archiveName}
    """
  }

  slackNotification('Node Build', 'ui-client', gitCommitId, currentBuild.currentResult)
}

stage ('Container Build') {

  containerBuild {
    component    = 'ui-client'
    commitId     = gitCommitId
    commitAuthor = gitCommitAuthor
    version      = instanaVersion
  }

  slackNotification('Container Build', 'ui-client', gitCommitId, currentBuild.currentResult)
}

stage('Deployment') {
  node {
    milestone label: "deployment"

    def deployments = [:]
    if ( env.BRANCH_NAME == 'develop' ) {
      deployments['deploy-test'] = {
        echo "Deploying develop:${instanaVersion} to test.instana.io ..."
        git url: 'git@github.com:instana/saas.git', branch: 'single-box-test'
        legacyDeploy('ui-client', 'test')
        slackNotification('Deploy Test', 'ui-client', gitCommitId, currentBuild.currentResult)
      }
    }
    if ( env.BRANCH_NAME == 'master' ) {
      deployments['deploy-staging'] = {
        echo "Deploying master:${instanaVersion} to staging.instana.io ..."
        git url: 'git@github.com:instana/saas.git', branch: 'single-box-test'
        legacyDeploy('ui-client', 'staging')
        slackNotification('Deploy Staging', 'ui-client', gitCommitId, currentBuild.currentResult)
      }
    }

    parallel deployments
  }
}


def legacyDeploy(component, target) {
  def execEnvironment = [
    "INSTANA_REGION=us-east-1",
    "INSTANA_CONTAINER_TAG=latest",
    "INSTANA_CONTAINER_ACTION=deploy",
    "INSTANA_CONTAINER_DEBUG=false",
    "INSTANA_TENANT=instana",
    "DATA_SCOPE=global",
    "DISCOVERY=ec2,docker",
    "AUTO_DEPLOY=true",
    "AUTO_DEPLOY_ENV=true",
    "KAFKA_SEEK_TO_END=true",
    "ANSIBLE_FORCE_COLOR=true",
    "PYTHONUNBUFFERED=1"
  ]
  if ( target == "test" ) {
    execEnvironment << "INSTANA_ENVIRONMENT=internal"
    execEnvironment << "INSTANA_TENANT_UNIT=test"
    execEnvironment << "INSTANA_UICLIENT_BRANCH=develop"
    execEnvironment << "INSTANA_EUM_TRACKING_ID=NebQtX9YTPGuKUnrnHUUXA"
  }
  if ( target == "staging" ) {
    execEnvironment << "INSTANA_ENVIRONMENT=staging"
    execEnvironment << "INSTANA_TENANT_UNIT=staging"
    execEnvironment << "INSTANA_UICLIENT_BRANCH=master"
    execEnvironment << "INSTANA_EUM_TRACKING_ID=ULOg7DZWRKWfNTSREGeRNg"
  }

  withEnv(execEnvironment) {
    sh ". ~/ansible.env && ansible-playbook playbooks/${component}.yml -v --tags ${INSTANA_CONTAINER_ACTION}"
  }
}

def runNodeBuild(gitCommitId, buildCommands) {
  deleteDir()
  unstash name: "ui-client-checkout-${gitCommitId}"
  sh '''
    cp ~/.npmrc-private-registry .npmrc
    if [ -z "$(which yarn)" ]; then
      npm install -g yarn
    fi
  '''
  sh buildCommands
}
