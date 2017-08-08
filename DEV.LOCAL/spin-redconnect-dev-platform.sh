oc login -u admin
docker login -u $(oc whoami -t) -p $(oc whoami -t) 172.30.1.1:5000
docker tag redconnect  172.30.1.1:5000/openshift/redconnect
docker push 172.30.1.1:5000/openshift/redconnect
docker tag icdapi  172.30.1.1:5000/openshift/icdapi
docker push 172.30.1.1:5000/openshift/icdapi

oc new-project redcon-dev
oc adm policy add-scc-to-user anyuid -z default
oc secrets new-dockercfg push-secret --docker-server=172.30.1.1:5000 --docker-username=admin --docker-password=$(oc whoami -t) --docker-email=admin@example.com
oc secrets add serviceaccount/default secrets/push-secret --for=pull,mount
oc secrets new-basicauth basicsecret --username=edmacabebe --password=3dmacabebe
oc secrets add serviceaccount/builder secrets/basicsecret
oc create -f platform/CICD/redconnect-dev.yml
oc new-app redconnect-app
