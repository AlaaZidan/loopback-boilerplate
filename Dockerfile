from node:8

maintainer fixed.solutions

copy . boiler-container

workdir boiler-container

run npm install

expose 3000 

cmd ["npm","start"]

