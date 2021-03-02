FROM node:buster
COPY ./content /module
RUN cd /module; npm install
CMD ["node", "/module/index.js"]