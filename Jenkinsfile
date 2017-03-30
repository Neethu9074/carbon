def versionBaseDir = '/mnt/efs/data/instana-release'

node {

  stage('Node Build') {
    // build in clean workspace
    deleteDir()

    checkout scm

    gitCommitId          = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
    gitShortCommitId     = gitCommitId.take(6)
    gitCommitAuthor      = sh(returnStdout: true, script: "git --no-pager show -s --format='%ae' $gitShortCommitId").trim()
    instanaBackendBranch = env.BRANCH_NAME

    def majorNumber = readProperties  file: "${versionBaseDir}/major.number"
    majorVersion = majorNumber.value as Integer
    echo "DEBUG: Major Version: ${majorVersion}"

    def minorNumberFile = "${versionBaseDir}/ui-client-${instanaBackendBranch}-${majorVersion}-minor.number"
    if ( fileExists("${minorNumberFile}") ) {
      def minorNumber = readProperties file: minorNumberFile
      minorVersion = minorNumber.value as Integer
      def nextMinorVersion = minorVersion + 1
      def f = new File(minorNumberFile)
      f.write("value=${nextMinorVersion}")
    } else {
      minorVersion = 0
      def f = new File(minorNumberFile)
      f.write("value=1")
    }
    echo "DEBUG: Minor Version: ${minorVersion}"

    def archiveName = "ui-client-${instanaBackendBranch}-${majorVersion}.${minorVersion}.tar.gz"
    sh """
      cp ~/.npmrc-private-registry .npmrc

      npm install -g yarn

      yarn

      yarn run test
      yarn run build

      tar -czf ${archiveName} target/*
    """

    stash includes: "${archiveName}, deployment/**/*", name: "ui-client-${gitShortCommitId}"
  }

}

node {
  stage('Container Build') {
    deleteDir()

    unstash name: "ui-client-${gitShortCommitId}"

    instanaContainerTag = "${majorVersion}-${minorVersion}"
    if ( instanaBackendBranch == 'master' ) {
      instanaContainerTag = "instana-release-" + instanaContainerTag
    }

    withEnv([
      "GIT_COMMIT=${gitShortCommitId}",
      "COMMIT_AUTHOR=${gitCommitAuthor}",
      "INSTANA_CONTAINER_TAG=${instanaContainerTag}",
      "INSTANA_BACKEND_BRANCH=${instanaBackendBranch}",
      "JOB_NAME=${env.JOB_NAME}",
      "BUILD_NUMBER=${env.BUILD_NUMBER}",
      "BUILD_URL=${env.BUILD_URL}"
    ]) {
      sh  'j2 deployment/Dockerfile.j2 > Dockerfile'
      sh  'mkdir ext-discovery'
      dir('ext-discovery') {
        git 'git@github.com:instana/discovery.git'
      }
      retry(3) {
        // wrap in retry as zfs sometimes fails when building containers
        def containerName = "registry-internal.instana.io/instana/ui-client/${instanaBackendBranch}"
        sh "docker build -t ${containerName} ."
        sh "docker tag ${containerName} ${containerName}:${instanaContainerTag}"
        sh "docker push ${containerName}:latest"
        sh "docker push ${containerName}:${instanaContainerTag}"
        sh "docker rmi ${containerName}"
      }
    }
  }
}
