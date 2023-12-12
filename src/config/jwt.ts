import fastifyJwt from "@fastify/jwt";
import fp from "fastify-plugin";

export default fp<{}>(async (fastify, opts) => {
    fastify.register(fastifyJwt, {
        secret: process.env.SECRAT,
    });
});
