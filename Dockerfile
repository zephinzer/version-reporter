FROM node:8-alpine
RUN apk add --no-cache git \
  && git config --global user.name '_test' \
  && git config --global user.email '_test@test.com'
WORKDIR /app
ENTRYPOINT [ "npm", "run", "actual-test-command" ]
COPY . /app