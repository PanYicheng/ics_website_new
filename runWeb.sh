#!/bin/bash
# redis start:
# ./setup-requisites/redis-6.0.8/src/redis-server &
# mongodb start:
# ./setup-requisites/mongodb-linux-x86_64-2.6.11/bin/mongod &
gulp build
npm start

# redis off:
# redis-cli shutdown
# mongodb off:
# ps -ef | grep mongod
# kill PID
