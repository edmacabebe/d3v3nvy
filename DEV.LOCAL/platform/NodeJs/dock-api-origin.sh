
#oc cluster up --public-hostname=10.1.2.2 --routing-suffix=10.1.2.2.nip.io --host-data-dir=/var/lib/origin/openshift.local.data --use-existing-config
#oc login -u admin -p admin
oc new-project redcon-cicd --display-name="RedConnect DevTest CI/CD Pipeline"
oc new-project redcon-postdevtest --display-name="RedCon - PostDevTest"
oc new-project redcon-devtest --display-name="RedCon - DevTest"
oc policy add-role-to-user edit system:serviceaccount:redcon-cicd:jenkins -n redcon-devtest
oc policy add-role-to-user edit system:serviceaccount:redcon-cicd:jenkins -n redcon-postdevtest
oc process -f redcon-cicd-template.yaml -v DEV_PROJECT=redcon-devtest -v STAGE_PROJECT=redcon-postdevtest | oc create -f - -n redcon-cicd

docker login -u $(oc whoami -t) -p $(oc whoami -t) 172.30.1.1:5000

#make

#oc new-project redcon-devtest --display-name="RedCon - DevTest"
docker tag node-ml 172.30.1.1:5000/redcon-devtest/node-ml
#docker login -u $(oc whoami -t) -p $(oc whoami -t) 172.30.1.1:5000
docker push 172.30.1.1:5000/redcon-devtest/node-ml

oc create -f node-ml.yaml
#oc new-project nodeml
oc new-app node-ml-api

#oc delete dc icd-api -n redcon-devtest