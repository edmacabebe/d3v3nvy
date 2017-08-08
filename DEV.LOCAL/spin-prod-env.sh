#oc login -u admin -p admin
#oc new-project ml-uat
#oc login -u system:admin
#oc adm policy add-scc-to-user anyuid -z default
#oc login -u admin -p admin
#docker login -u $(oc whoami -t) -p $(oc whoami -t) 172.30.1.1:5000
#oc secrets new-dockercfg push-secret --docker-server=172.30.1.1:5000 --docker-username=admin --docker-password=$(oc whoami -t) --docker-email=admin@example.com
#oc secrets add serviceaccount/default secrets/push-secret --for=pull,mount
#oc create -f platform/MarkLogic/slush-marklogic-node-template-uat.yml
#oc new-app slush-marklogic-node-app
#oc policy add-role-to-user edit system:serviceaccount:ml-dev:jenkins -n ml-uat

oc login -u admin
#rm ~/.docker/config.json
docker login -u $(oc whoami -t) -p $(oc whoami -t) 172.30.1.1:5000
oc new-project ml-uat
oc adm policy add-scc-to-user anyuid -z default
oc secrets new-dockercfg push-secret --docker-server=172.30.1.1:5000 --docker-username=admin --docker-password=$(oc whoami -t) --docker-email=admin@example.com
oc secrets add serviceaccount/default secrets/push-secret --for=pull,mount
oc create -f platform/MarkLogic/slush-marklogic-node-template-uat.yml
oc new-app slush-marklogic-node-app
oc policy add-role-to-user edit system:serviceaccount:ml-dev:jenkins -n ml-uat