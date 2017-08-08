FROM node:8

#MAINTAINER Zoilo Dela Cruz <zoilo.cruz@redflaggroup.com>
LABEL authors="Zoilo Dela Cruz <luxknight007@gmail.com>, Edison Macabebe <edmacabebe@gmail.com>"

EXPOSE 3000

COPY . /opt/app

WORKDIR /opt/app

RUN cd /opt/app && npm install

USER 1001

# Run node server
CMD ["node", "bin/www"]
