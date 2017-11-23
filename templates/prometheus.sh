#!/bin/bash
sudo echo "Host github.com\nStrictHostKeyChecking no" >> ~/.ssh/config
yes yes | git clone https://github.com/stefanprodan/swarmprom.git
cd swarmprom
sed -i '169s/.*/          memory: 200M/' docker-compose.yml
sed -i '171s/.*/          memory: 100M/' docker-compose.yml
docker stack deploy prometheus -c ./docker-compose.yml
