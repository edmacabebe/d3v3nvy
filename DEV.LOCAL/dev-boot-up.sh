sudo service docker start
oc cluster up --public-hostname=10.1.2.2 --routing-suffix=10.1.2.2.nip.io --host-data-dir=/var/lib/origin/openshift.local.data
oc login -u system:admin
oc adm policy add-cluster-role-to-user cluster-admin admin
oc login -u admin
#docker login -u $(oc whoami -t) -p $(oc whoami -t) 172.30.1.1:5000
#echo "Open a browser and point it to URL: https://10.1.2.2:8443/console"