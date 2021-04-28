FROM node:10.24.1-alpine
RUN apk update
#     apk add --no-cache make gcc g++
WORKDIR /app
RUN mkdir ldap models
COPY ldap ldap
COPY models models
COPY config.json .
COPY package*.json .
RUN npm install
EXPOSE 1389
CMD node ldap/ldap-server.js

