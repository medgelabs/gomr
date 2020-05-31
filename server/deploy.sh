#!/bin/sh
docker stop gomr-api
docker rmi -f gomr-api
docker load /home/ec2-user/gomr-api.tar
docker run -d --rm -p 3000:3000 gomr-api

