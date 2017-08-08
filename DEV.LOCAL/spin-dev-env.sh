#oc login -u admin -p admin
#docker login -u $(oc whoami -t) -p $(oc whoami -t) 172.30.1.1:5000
#docker push 172.30.1.1:5000/openshift/marklogic9
#docker push 172.30.1.1:5000/openshift/slush-marklogic-node
#oc get pods -n default
#oc new-project ml-dev
#oc login -u system:admin
#oc adm policy add-cluster-role-to-user cluster-admin admin
#oc adm policy add-scc-to-user anyuid -z default
#oc login -u admin
#docker login -u $(oc whoami -t) -p $(oc whoami -t) 172.30.1.1:5000
#oc secrets new-dockercfg push-secret --docker-server=172.30.1.1:5000 --docker-username=admin --docker-password=$(oc whoami -t) --docker-email=admin@example.com
#oc secrets add serviceaccount/default secrets/push-secret --for=pull,mount
#oc login -u admin -p admin
#oc create -f platform/MarkLogic/slush-marklogic-node-template.yml
#oc new-app slush-marklogic-node-app

####Create the pipeline
#oc create -f platform/MarkLogic/slush-marklogic-node-pipeline.yml
#oc login -u admin -p admin
#docker login -u $(oc whoami -t) -p $(oc whoami -t) 172.30.1.1:5000
#docker tag slush-marklogic-node 172.30.1.1:5000/openshift/slush-marklogic-node
#docker push 172.30.1.1:5000/openshift/slush-marklogic-node
#oc login -u admin
#rm ~/.docker/config.json
oc login -u admin
docker login -u $(oc whoami -t) -p $(oc whoami -t) 172.30.1.1:5000
docker tag slush-marklogic-node 172.30.1.1:5000/openshift/slush-marklogic-node
docker push 172.30.1.1:5000/openshift/slush-marklogic-node
####ML-DEV
oc new-project ml-dev
oc adm policy add-scc-to-user anyuid -z default
oc secrets new-dockercfg push-secret --docker-server=172.30.1.1:5000 --docker-username=admin --docker-password=$(oc whoami -t) --docker-email=admin@example.com
oc secrets add serviceaccount/default secrets/push-secret --for=pull,mount
oc create -f platform/MarkLogic/slush-marklogic-node-template.yml
oc new-app slush-marklogic-node-app
oc logs -f bc/slush-marklogic-app
####ML-DEV

