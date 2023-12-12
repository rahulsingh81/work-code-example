import fastify from "fastify";
import AutoLoad from "@fastify/autoload";
import { join } from "path";
import env from "@fastify/env";
import cors from "@fastify/cors";

const server = fastify({
    logger: true,
});
server.register(env, { dotenv: true, data: process.env, schema: {} });
server.register(cors, {
    origin: true,
});
server.register(require("@fastify/multipart"));

server.register(AutoLoad, {
    dir: join(__dirname, "helper"),
});
server.register(AutoLoad, {
    dir: join(__dirname, "config"),
});
server.register(AutoLoad, {
    dir: join(__dirname, "routes"),
});

server.listen({ port: 5001 }, (error, address) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`server listening port ${address}`);
    }
});
