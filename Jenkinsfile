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
      
      npm install -g npm@3.9.5

      npm prune
      npm update
      npm install
      
      npm run test
      npm run build
      tar -czf ${archiveName} target/*
    """

    stash includes: "${archiveName}", name: "ui-client-${gitShortCommitId}"
  }

}

node {
  stage('Container Build') {
    unstash name: "ui-client-${gitShortCommitId}"
  }
}