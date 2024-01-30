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
        stage('Restart or Start DSA_service') {
            steps {
                script {
                    // check 'DSA_service' running ?
                    def pm2List = bat(script: 'pm2 list', returnStatus: true).trim()
                    if (pm2List.contains('DSA_service')) {
                        echo 'restart DSA_service ...'
                        bat 'pm2 restart DSA_service'
                    } else {
                        // start 'DSA_service'
                        echo 'start DSA_service ...'
                        bat 'pm2 start server.js --name DSA_service'
                    }
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


