stage 'NPM Build'

node {
  // build in clean workspace
  deleteDir()

  checkout scm

  gitCommitId          = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
  gitShortCommitId     = gitCommitId.take(6)
  gitCommitAuthor      = sh(returnStdout: true, script: "git --no-pager show -s --format='%ae' $gitShortCommitId").trim()
  instanaBackendBranch = env.BRANCH_NAME
  
  sh '''
    nvm use
    cp ~/.npmrc-private-registry .npmrc
    npm install -g npm@3.9.5

    nice -19 npm prune
	nice -19 npm update
	nice -19 npm install
	
	nice -19 npm run test
	nice -19 npm run build
  '''
}
