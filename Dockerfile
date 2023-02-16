FROM docker.io/rust:bullseye AS backend_builder

COPY /backend /src
WORKDIR /src
RUN cargo build --release

FROM docker.io/node:bullseye AS frontend_builder

COPY /frontend /src
WORKDIR /src
RUN yarn global add esbuild tsc
RUN make build

FROM docker.io/busybox:latest AS out
COPY --from=frontend_builder /src /out/frontend
COPY --from=backend_builder /src/target/release/ticket-backend /out/backend/run
