#!groovy

// define global vars for use in later stages
def gitCommitId     = null
def gitCommitAuthor = null
def instanaVersion  = null
def archiveName     = null

stage('Node Build') {
  node {
    
    deleteDir()

    checkout scm

    instanaVersion  = getVersion('ui-client')
    gitCommitId     = sh(returnStdout: true, script: 'git rev-parse HEAD').trim().take(6)
    gitCommitAuthor = sh(returnStdout: true, script: "git --no-pager show -s --format='%ae' $gitCommitId").trim()
    
    currentBuild.displayName = "#${env.BUILD_NUMBER}: ${gitCommitId} -> ${instanaVersion}"

    archiveName = "ui-client-${env.BRANCH_NAME}-${instanaVersion}.tar.gz"

    sh """
      cp ~/.npmrc-private-registry .npmrc

      npm install -g yarn
      
      yarn
      yarn run test
      yarn run build
      
      tar -czf ${archiveName} target/*
    """

    stash includes: "${archiveName}, deployment/**/*", name: "ui-client-${gitCommitId}"

  }
}

stage('Container Build') {
  node {
    
    deleteDir()

    unstash name: "ui-client-${gitCommitId}"

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
  //TODO
}
