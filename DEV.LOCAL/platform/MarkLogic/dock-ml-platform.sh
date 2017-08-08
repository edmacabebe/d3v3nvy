docker build --rm=true -t marklogic9 .
docker tag marklogic9 172.30.1.1:5000/openshift/marklogic9
docker login -u admin -p $(oc whoami -t) 172.30.1.1:5000
docker push 172.30.1.1:5000/openshift/marklogic9