oc import-image sonarqube:latest --from=sonarqube --confirm -n openshift
oc import-image gogs:latest --from=gogs/gogs --confirm -n openshift
oc import-image nexus:latest --from=sonatype/nexus --confirm -n openshift
oc new-project gogs-sonar
oc adm policy add-scc-to-user anyuid -z useroot
oc create -f platform/CICD/sonar_gogs.yml
oc new-app sonar-gogs