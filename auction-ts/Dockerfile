FROM node:13.6.0-alpine

COPY . /app

RUN cd /app && npm install && \
 npm run build && \
 mv /app/dist /dist && \
 cp /app/src/config.json /dist && \
 rm -rf /app

CMD [ "node", "/dist/main.js" ]
