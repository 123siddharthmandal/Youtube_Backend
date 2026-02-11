# base image 
FROM node:20-alpine

# set working directory
WORKDIR /app

# copy  package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install

COPY . .
# EXPOSE THE PORT THE SERVER IS RUNNING ON
EXPOSE 4000
# RUN THE SERVER
CMD ["npm", "start"]  ;
