# ============================
# Build stage
# ============================
FROM node:16.13.2-alpine3.14 as build-stage
WORKDIR /build_stage

COPY ["package.json", "package-lock.json*", "./"]

# Next line is needed to build the image in apple silicon chip
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN npm install --no-save

COPY . .

RUN cp -f pollify/types.d.ts.txt node_modules/cheerio/lib/types.d.ts
RUN cp -f pollify/load.d.ts.txt node_modules/cheerio/lib/load.d.ts

RUN npm run build

# ============================
# Run stage
# ============================
FROM node:16.13.2-alpine3.14 as production-stage
WORKDIR /app

COPY package*.json ./
COPY .env ./
COPY ./key.json ./

RUN npm install --no-save --production

COPY --from=build-stage /build_stage/dist /app/dist

CMD npm run start:prod