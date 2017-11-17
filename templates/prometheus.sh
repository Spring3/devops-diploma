#!/bin/bash
sudo echo "Host github.com\nStrictHostKeyChecking no" >> ~/.ssh/config
yes yes | git clone https://github.com/stefanprodan/swarmprom.git
cd swarmprom
sed -i '92s/.*/          memory: 128M/' docker-compose.yml
sed -i '94s/.*/          memory: 64M/' docker-compose.yml
docker stack deploy prometheus -c ./docker-compose.yml
