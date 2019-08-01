#!groovy

pipeline {
  agent any

  options {
    disableConcurrentBuilds()
  }

  triggers {
    cron('H 12 * * 1-5')
  }

  stages {
    stage('Run Security Audit') {
      steps {
        deleteDir()

        dir('ui-client') {
          git url: 'git@github.com:instana/ui-client.git', branch: 'develop'

          script {
            def gitCommitId = sh(returnStdout: true, script: 'git rev-parse HEAD').trim().take(8)

            currentBuild.displayName = "#${env.BUILD_NUMBER}: ${gitCommitId}"

            try {
              sh '''
                source $HOME/.nvm/nvm.sh
                nvm use
                npm install yarn@1.17.3
                ./node_modules/.bin/yarn audit
              '''
              slackNotification('Security Audit', 'ui-client', gitCommitId, 'SUCCESS', 'develop')
            } catch (e) {
              slackNotification('Security Audit', 'ui-client', gitCommitId, 'FAILURE', 'develop')
              throw e
            }
          }
        }
      }
    }
  }
}
