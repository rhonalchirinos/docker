FROM oven/bun:latest

WORKDIR /app

COPY . .

RUN bun install

EXPOSE 3001

CMD ["bun", "src/main.ts"]
