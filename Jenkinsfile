pipeline {
    agent {
        label 'windows-agent'
    }
    environment {
        GIT_BRANCH = 'main'
        GIT_REPO_URL = 'git@github.com:ATSjsc-DSA/DSA_Service.git'
    }
    stages {
        stage('Checkout Code') {
            steps {
                script {
                    checkout([$class: 'GitSCM', branches: [[name: env.GIT_BRANCH]],
                            userRemoteConfigs: [[credentialsId: 'windows-agent', url: env.GIT_REPO_URL]]])
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    //deploy 
                    echo "Deploying..."
                }
            }
        }
        stage('Install Dependencies') {
            steps {
                script {
                    
                    // install dependencies using npm
                    bat "npm install"
                }
            }
        }

        stage('clear dsa_service') {
            steps {
                script {
                    
                    // install dependencies using npm
                    bat "pm2 delete all"
                }
            }
        }
        stage('Build') {
            steps {
                script {
                    // run server for develop
                    bat "pm2 start server.js"
                }
            }
        }

        
    }

    post {
        success {
            echo 'Pipeline ran successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}


