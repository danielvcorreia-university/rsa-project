# pull official base image
FROM node:14.16.1-alpine
# set working directory
WORKDIR /react-app
# add `/react-app/node_modules/.bin` to $PATH
ENV PATH /react-app/node_modules/.bin:$PATH
# install react-app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@4.0.3 -g --silent
RUN npm install axios@0.21.1
RUN npm install bootstrap@4.6.0 --save
RUN npm install react-paho-mqtt@1.0.1 --silent

# add react-app
COPY . ./
# start react-app
CMD ["npm", "start"]
