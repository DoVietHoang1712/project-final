FROM hoang1712/biglib:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i -g @nestjs/cli

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start" ]