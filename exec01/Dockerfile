FROM golang:1.24.3-alpine AS builder
ARG TARGETARCH
WORKDIR /app
COPY ./go .
RUN go build -o app && chmod +x app

FROM alpine:latest
WORKDIR /app 
COPY --from=builder /app/app /app/app
EXPOSE 8080
CMD ["/app/app" ] 
