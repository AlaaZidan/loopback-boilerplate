#!/usr/bin/env groovy

pipeline {
agent any
stages {
stage ('Build'){
  steps {
    sh 'docker build -f Dockerfile -t boiler .'
   echo 'Building'
  }
}
  stage('deploy'){
    steps{
    sh 'docker run -d -e "MYSQL_USER=root" -e "MYSQL_PASSWORD=password" -e "MYSQL_HOST=172.17.0.3" -e "MYSQL_DB=boiler" -p 3000:3000 boiler'
    }
  }
}
}
