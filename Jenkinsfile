stage 'NPM Build'

node {
  // build in clean workspace
  deleteDir()

  checkout scm

  gitCommitId          = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
  gitShortCommitId     = gitCommitId.take(6)
  gitCommitAuthor      = sh(returnStdout: true, script: "git --no-pager show -s --format='%ae' $gitShortCommitId").trim()
  instanaBackendBranch = env.BRANCH_NAME
  
  if ( instanaBackendBranch == 'master' ) {
  	def baseDir = '/mnt/efs/data/instana-release'
    def majorNumber = readProperties  file: "${baseDir}/major.number"
    majorVersion = majorNumber.value
    def minorNumberFile = "${baseDir}/ui-client.${majorVersion}.minor.number"
    if ( fileExists("${minorNumberFile}") ) {
      def minorNumber = readProperties file: minorNumberFile
      minorVersion = minorNumber.value as Integer
      def nextMinorVersion = minorVersion + 1
      def f = new File(minorNumberFile)
      f << "value=${nextMinorVersion}"
    } else {
      minorVersion = 0
      def f = new File(minorNumberFile)
      f << "value=1"
    }
  }

  sh """
    cp ~/.npmrc-private-registry .npmrc
    
    npm prune
    npm update
    npm install
    
    npm run test
    npm run build
    tar -xzf ui-client-${instanaBackendBranch}-${majorVersion}.${minorVersion}.tar.gz target/*
  """
}
