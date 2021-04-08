FROM node:alpine

RUN addgroup --system web
RUN adduser --system --ingroup web web
COPY . home/web
WORKDIR home/web
RUN chown -R web:web /home/web

USER web
RUN npm install
CMD ["node", "home.js"]

