###
## React App
###
FROM node:16-bullseye-slim AS nodebuilder


# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package.json .
COPY tsconfig.json .
COPY yarn.lock .

# Install
RUN yarn install --frozen-lockfile --network-timeout 1000000

# Copy app files
COPY craco.config.js .
# eslint
COPY .eslintrc.json .
COPY .eslintignore .
# prettier
COPY .prettierrc.json .
COPY .prettierignore .

# Add folders
COPY src ./src
COPY public ./public

# Build the app
RUN yarn build

###
## Caddy Web Server & Run proxy binary
###
FROM caddy:alpine as production

# Add your Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile
# Copy built assets from builder
COPY --from=nodebuilder /app/build /usr/share/caddy/html

WORKDIR /patch
# Add the script to patch window with ENV vars
# https://create-react-app.dev/docs/title-and-meta-tags#injecting-data-from-the-server-into-the-page
COPY web-entrypoint.sh .
RUN chmod +x /patch/web-entrypoint.sh


# Expose port
EXPOSE 8080

ENTRYPOINT ["/patch/web-entrypoint.sh"]
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]

