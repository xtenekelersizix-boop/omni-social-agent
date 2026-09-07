FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD [ "node", "scripts/generate_and_render.js" ]
