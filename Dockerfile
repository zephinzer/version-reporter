FROM node:8-alpine
RUN apk add --no-cache git
WORKDIR /app
ENTRYPOINT [ "npm", "run", "actual-test-command" ]
COPY . /app