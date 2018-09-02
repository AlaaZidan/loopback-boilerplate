#!/usr/bin/env groovy

pipeline {
agent {
label 'Slave'
}
stages {
stage ('Build'){
  agent {
dockerfile true
  } 
  steps {
   echo 'Building'
  }
}
}
}
