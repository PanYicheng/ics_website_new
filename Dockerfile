FROM node:10.24.1-alpine
RUN apk update
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3008
CMD ["npm", "start"]
