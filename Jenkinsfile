#!/usr/bin/env groovy
@Library(['piper-lib', 'piper-lib-os']) _
stage ('Build') { 
  node{
  	 dockerExecuteOnKubernetes(script: this, dockerImage: 'ppiper/node-browsers:node12', dockerWorkspace: '/home/node') {		 
	   sh '''
		  	      rm -rf outbound-freight-and-logistics-management
			      git -c http.sslVerify=false clone https://github.wdf.sap.corp/refapps/outbound-freight-and-logistics-management.git
			      cd outbound-freight-and-logistics-management
			      cd freight-manager
			      npm i
			      npm run build
			      cd ..
			      pwd
			      cd logistics-service
			      npm i
			      npm run build
			      cd ..
			      cd product-service
			      npm i
			      npm run build
			      
			      
			      '''
		}
	}
}
stage ('deploy') { 
  node{
  	 dockerExecuteOnKubernetes(script: this, dockerImage: 'docker.wdf.sap.corp:51010/sfext:latest', dockerWorkspace: '/home/node') {		 
	   sh '''
	   		      cf login -u $nodeappuser -p $nodeappwd -a $nodeappurl -o $nodeapporg -s $nodeappspace
			      cd outbound-freight-and-logistics-management
			      cd freight-manager
			      npm run deploy
			      cd ..
			      cd product-service
			      npm run deploy
			      cd ..
			      cd logistics-service
			      ls
			      rm -rf dist
			      rm -rf deployment
			      rm -rf package-lock.json
			      ls
			      npm run deploy
			        
			      
			      '''
		}
	}
}
stage ('test') { 
  node(){
  	 dockerExecuteOnKubernetes(script: this,dockerEnvVars: ['pusername':pusername, 'puserpwd':puserpwd], dockerImage: 'docker.wdf.sap.corp:51010/sfext:latest', dockerWorkspace: '/home/node') {		 
	   sh '''
			      cf login -u $nodeappuser -p $nodeappwd -a $nodeappurl -o $nodeapporg -s $nodeappspace
			      logistics_guid=`cf app logistics-service --guid`
			      echo $logistics_guid
			      product_guid=`cf app product-service --guid`
			      echo $product_guid
			      freight_guid=`cf app freight-manager --guid`
			      echo $freight_guid
			      cd outbound-freight-and-logistics-management
			      cd test
			      npm i
			      cf curl /v2/apps/$logistics_guid/env > logistic_env.json
			      cf curl /v2/apps/$product_guid/env > product_env.json
			      cf curl /v2/apps/$freight_guid/env > freight_env.json
			      ls
			      jest ./test
			      			      			      
			      
			      '''
		}
	}
}

