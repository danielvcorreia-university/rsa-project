### STAGE 1: Build ###
# pull official base image
FROM node:14.16.1-alpine as build
# set working directory
WORKDIR /react-app
# add `/react-app/node_modules/.bin` to $PATH
ENV PATH /react-app/node_modules/.bin:$PATH
# install react-app dependencies
COPY package.json /react-app/package.json
COPY package-lock.json /react-app/package.json
RUN npm install --silent
RUN npm install react-scripts -g --silent
# add react-app
COPY . ./
# build production app
RUN npm run build

### STAGE 2: Production Environment ###
FROM nginx:1.13.12-alpine
COPY --from=build /react-app/build /usr/share/nginx/html
EXPOSE 80
# start react-app
CMD ["nginx", "-g", "daemon off;"]
