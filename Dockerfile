FROM node:latest as build-step-1

ARG ENV=prod
ARG APP=co-checkout-service
ARG PORT=3001

ENV ENV ${ENV}
ENV APP ${APP}
ENV PORT ${PORT}

WORKDIR /app
COPY ./ /app

RUN npm ci

FROM build-step-1 as build-step-2

RUN npm run build

FROM build-step-2
CMD ["node", "dist/main"]
