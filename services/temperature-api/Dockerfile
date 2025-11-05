FROM node:20-alpine
WORKDIR /app
COPY main.js package*.json* /app/

RUN test -f package.json || printf '{ "name":"temperature-api","version":"1.0.0","main":"main.js" }' > package.json
EXPOSE 8081
CMD ["node", "main.js"]
