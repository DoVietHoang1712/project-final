pipeline {
    agent none

    environment {
        DOCKER_IMAGE = "hoang1712/nodejs-docker"
    }

    stages {
        stage("Test") {
            agent {
                docker {
                    image 'node:12-alpine'
                    args '-u 0:0 -v /tmp:/root/.cache'
                }
            }
            steps {
                sh 'npm i'
                sh 'npm run test'
            }
        }
    }
}