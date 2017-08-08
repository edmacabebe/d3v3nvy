oc login -u admin
#docker login -u $(oc whoami -t) -p $(oc whoami -t) 172.30.1.1:5000
#oc new-project redcon-cicd --display-name="RedConnect DevTest CI/CD Pipeline"
#oc adm policy add-scc-to-user anyuid -z default
#oc secrets new-dockercfg push-secret --docker-server=172.30.1.1:5000 --docker-username=admin --docker-password=$(oc whoami -t) --docker-email=admin@example.com
#oc secrets add serviceaccount/default secrets/push-secret --for=pull,mount
#
#oc new-app slush-marklogic-node-app

#oc policy add-role-to-user edit system:serviceaccount:redcon-cicd:jenkins -n ml-dev
#oc policy add-role-to-user edit system:serviceaccount:redcon-cicd:jenkins -n ml-qa
#oc policy add-role-to-user edit system:serviceaccount:redcon-cicd:jenkins -n ml-uat
#oc process -f platform/CICD/cicd-template.yaml -v DEV_PROJECT=ml-dev -v STAGE_PROJECT=ml-qa | oc create -f - -n redcon-cicd
#oc create -f platform/CICD/cicd-template.yaml

#oc new-project dev --display-name="Tasks - Dev"
#oc new-project stage --display-name="Tasks - Stage"
oc new-project cicd --display-name="CI/CD"
#oc policy add-role-to-user edit system:serviceaccount:cicd:jenkins -n dev
#oc policy add-role-to-user edit system:serviceaccount:cicd:jenkins -n stage
oc process -f platform/CICD/cicd-template.yaml | oc create -f -
oc policy add-role-to-user edit system:serviceaccount:cicd:jenkins -n ml-dev
oc policy add-role-to-user edit system:serviceaccount:cicd:jenkins -n ml-qa