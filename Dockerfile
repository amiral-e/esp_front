FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps --production

COPY . .

COPY .env .env

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 8080

CMD ["npm", "run", "dev"]
