# Using ibmfunctions action-nodejs-v12 container as base
FROM  ibmfunctions/action-nodejs-v16:1.0.3

# Create a new container and add mongoose to it
RUN npm install cheerio colors googleapis request request-promise
# Now
# Build and tag using `docker build -t <docker-username>/<container-name>:<version>`
# Push to public docker container registery `docker push <docker-username>/<container-name>:<version>`