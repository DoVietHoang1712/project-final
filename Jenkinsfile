pipeline {
    agent none

    environment {
        DOCKER_IMAGE = "hoang1712/nodejs-docker"
    }

    stages {
        stage("Test") {
            agent {
                docker {
                    image 'nikolaik/python-nodejs:python3.8-nodejs12-slim'
                    args '-u 0:0 -v /tmp:/root/.cache'
                }
            }
            steps {
                sh 'apt-get install build-essential -y'
                sh 'npm install'
                sh 'npm run test'
            }
        }
    }
}
