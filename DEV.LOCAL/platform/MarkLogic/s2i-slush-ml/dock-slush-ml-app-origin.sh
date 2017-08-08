

docker build --rm=true -t slush-marklogic-node .
docker images|grep slush

oc login -u admin -p admin
docker login -u $(oc whoami -t) -p $(oc whoami -t) 172.30.1.1:5000
docker tag slush-marklogic-node  172.30.1.1:5000/openshift/slush-marklogic-node
docker push 172.30.1.1:5000/openshift/slush-marklogic-node


oc get is -n openshift|grep slush
oc export is slush-marklogic-node -n openshift

