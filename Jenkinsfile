#!/usr/bin/env groovy

pipeline {
agent any
stages {
stage ('Build'){
  steps {
    sh 'docker build -f Dockerfile -t boilertest .'
   echo 'Building'
  }
}
}
}
