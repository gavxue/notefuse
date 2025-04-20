import { createClient } from "redis";

// create redis client
const client = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined,
  },
});

// connect to redis client
client.on("error", (err) => console.log("redis client error", err));
await client.connect();

export default client;
