
# node-ml
FROM openshift/base-centos7

# TODO: Put the maintainer name in the image metadata
# MAINTAINER Your Name <your@email.com>

# TODO: Rename the builder environment variable to inform users about application you provide them
# ENV BUILDER_VERSION 1.0

# TODO: Set labels used in OpenShift to describe the builder image
LABEL io.k8s.description="Platform for building xyz" \
      io.k8s.display-name="builder x.y.z" \
      io.openshift.expose-services="9070:http" \
      io.openshift.tags="builder,x.y.z,etc."

# TODO: Install required packages here:
RUN curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -
#RUN yum -y install nodejs ruby iproute telnet
RUN yum -y install nodejs ruby iproute telnet unzip java-1.8.0-openjdk && \
    curl https://developer.marklogic.com/download/binaries/mlcp/mlcp-9.0.1-bin.zip -o mlcp.zip && unzip mlcp.zip && mv mlcp-9.0.1 /usr/local/mlcp
RUN npm install -g gulp && npm install -g slush
#RUN yum install -y  && yum clean all -y
#RUN yum install -y rubygems && yum clean all -y
#RUN gem install asdf

# TODO (optional): Copy the builder files into /opt/app-root
# COPY ./<builder_folder>/ /opt/app-root/

# TODO: Copy the S2I scripts to /usr/libexec/s2i, since openshift/base-centos7 image
# sets io.openshift.s2i.scripts-url label that way, or update that label
COPY ./s2i/bin/ /usr/libexec/s2i

# TODO: Drop the root user and make the content of /opt/app-root owned by user 1001
RUN chown -R 1001:1001 /opt/app-root && chown -R 1001:1001 /usr/lib/node_modules && chmod -R a+r /usr/lib/node_modules && chmod -R a+w /opt/app-root/

# This default user is created in the openshift/base-centos7 image
USER 1001

# TODO: Set the default port for applications built using this image
EXPOSE 9070

# TODO: Set the default CMD for the image
CMD ["/usr/libexec/s2i/usage"]
