FROM node:18
WORKDIR /app


COPY package.json /app/.
COPY *.ts /app/.
COPY todo.db /app/.
COPY .env /app/.
COPY yarn.lock /app/.

ENV PATH /app/node_modules/.bin:$PATH

RUN yarn install
CMD ["yarn", "start"]


