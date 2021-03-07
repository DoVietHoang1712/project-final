FROM node:12-alpine
ADD . /app
WORKDIR /app
COPY ["package.json", "package-lock.json", "tsconfig.*", "nest-cli.json", "./"]
RUN npm install
RUN npm run build

FROM node:12-alpine
WORKDIR /app
COPY --from=0 /app /app
# COPY --from=0 /server/dist .
# COPY --from=0 /server/node_modules .
EXPOSE 3020
CMD npm run start
