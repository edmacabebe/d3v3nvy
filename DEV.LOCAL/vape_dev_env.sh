oc cluster down
su
systemctl stop docker
rm -rf /var/lib/docker/*
rm -fr ~/.kube
rm -rf /var/lib/origin/*