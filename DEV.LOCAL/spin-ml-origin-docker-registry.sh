#oc cluster up --public-hostname=10.1.2.2 --routing-suffix=10.1.2.2.nip.io --host-data-dir=/var/lib/origin/openshift.local.data

#cd s2i-slush-ml
#sh dock-slush-ml-app-origin.sh
#cd ..

#docker build --rm=true -t marklogic9 .
#docker images|grep marklogic9

oc login -u admin
docker tag marklogic9 172.30.1.1:5000/openshift/marklogic9
docker login -u $(oc whoami -t) -p $(oc whoami -t) 172.30.1.1:5000
docker push 172.30.1.1:5000/openshift/marklogic9

####Verifying
#oc get is -n openshift|grep marklogic
#oc export is marklogic9 -n openshift
#


