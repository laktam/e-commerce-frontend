# Start your image with a node base image
FROM node:18-alpine

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./

# Install node packages, install serve, build the app, and remove dependencies at the end
RUN npm install --force 
RUN npm install serve 
# Copy local directories to the current local directory of our docker image (/app)
COPY . .

RUN npm run build
# RUN npm run build

EXPOSE 3000

# Start the app using serve command
# CMD [ "npm", "run", "start" ]
# CMD [ "serve", "-s", "build" ]
CMD [ "sh","-c","npx serve -s build" ]