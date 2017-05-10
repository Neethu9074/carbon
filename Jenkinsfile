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

    stash includes: "**/*", name: "ui-client-checkout-${gitCommitId}"
  }
}

//stash includes: "${archiveName}, deployment/**/*", name: "ui-client-checkout-${gitCommitId}"

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
}

stage('Container Build') {
  node {
    
    deleteDir()

    unstash name: "ui-client-build-${gitCommitId}"

    sh "tar -xzf ${archiveName}"

    withEnv([
      "INSTANA_UICLIENT_COMMIT=${gitCommitId}",
      "COMMIT_AUTHOR=${gitCommitAuthor}",
      "INSTANA_CONTAINER_TAG=${instanaVersion}",
      "INSTANA_UICLIENT_BRANCH=${env.BRANCH_NAME}",
      "JOB_NAME=${env.JOB_NAME}",
      "BUILD_NUMBER=${env.BUILD_NUMBER}",
      "BUILD_URL=${env.BUILD_URL}"
    ]) {
      sh  'j2 deployment/Dockerfile.j2 > Dockerfile'
      sh  'mkdir deployment/ext-discovery'
      dir('deployment/ext-discovery') {
        git 'git@github.com:instana/discovery.git'
      }
      retry(3) {
        // wrap in retry as zfs sometimes fails when building containers
        def containerName = "registry-internal.instana.io/instana/ui-client/${env.BRANCH_NAME}"
        sh "docker build -t ${containerName} ."
        sh "docker tag ${containerName} ${containerName}:${instanaVersion}"
        sh "docker push ${containerName}:latest"
        sh "docker push ${containerName}:${instanaVersion}"
        sh "docker rmi ${containerName}"
      }
    }

  }
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
      }
    }
    if ( env.BRANCH_NAME == 'master' ) {
      deployments['deploy-staging'] = {
        echo "Deploying master:${instanaVersion} to staging.instana.io ..."
        git url: 'git@github.com:instana/saas.git', branch: 'single-box-test'
        legacyDeploy('ui-client', 'staging')
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
    execEnvironment << "INSTANA_BACKEND_BRANCH=develop"
    execEnvironment << "INSTANA_EUM_TRACKING_ID=NebQtX9YTPGuKUnrnHUUXA"
  }
  if ( target == "staging" ) {
    execEnvironment << "INSTANA_ENVIRONMENT=staging"
    execEnvironment << "INSTANA_TENANT_UNIT=staging"
    execEnvironment << "INSTANA_BACKEND_BRANCH=master"
    execEnvironment << "INSTANA_EUM_TRACKING_ID=ULOg7DZWRKWfNTSREGeRNg"
  }

  withEnv(execEnvironment) {
    sh ". ~/ansible.env && ansible-playbook playbooks/${component}.yml -v --tags ${INSTANA_CONTAINER_ACTION}"
  }
}

def runNodeBuild(gitCommitId, buildCommands) {
  unstash name: "ui-client-checkout-${gitCommitId}"
  sh '''
    cp ~/.npmrc-private-registry .npmrc
    if [ -z "$(which yarn)" ]; then
      npm install -g yarn
    fi
  '''
  ssh buildCommands
}