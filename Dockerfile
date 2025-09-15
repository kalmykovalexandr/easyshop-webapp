FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Generate dynamic configuration based on environment variables
RUN npm run generate-config
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
