#oc login -u admin
oc project ml-dev
#oc delete --cascade=false bc slush-marklogic-node-pipeline
#oc delete bc slush-marklogic-node-pipeline -n ml-dev
oc create -f platform/CICD/slush-marklogic-node-pipeline.yml
docker login -u $(oc whoami -t) -p $(oc whoami -t) 172.30.1.1:5000

oc start-build slush-marklogic-node-pipeline -n ml-dev



