import userControllers from "../controllers/userControllers";
import { BinaryLike } from "node:crypto";
import Ajv from "ajv";
const ajv = new Ajv();

const login = async function routes(fastify, opts) {
    fastify.post("/user-login", { schema }, async (request, reply) => {
        try {
            const { createHmac } = await import("node:crypto");
            const { email, password } = request.body;
            const user = await userControllers.getUserWithEmail({ email });
            console.log("user", user);
            const passwordHash = createHmac("sha256", process.env.SECRAT)
                .update(password as unknown as BinaryLike)
                .digest("hex");
            if (user && passwordHash === user?.password) {
                const token = fastify.jwt.sign(
                    {
                        userId: user._id,
                        email,
                        password: passwordHash,
                    },
                    { expiresIn: process.env.JWT_EXPIRE_TIME ?? "11d" }
                );
                reply.send(token);
                console.log("Success ---->", token);
            }
        } catch (err) {
            console.log("error", err);
        }
    });
};
export default login;
const schema = {
    type: "object",
    properties: {
        email: { type: "string" },
        password: { type: "string" },
    },
    required: ["email", "password"],
};

const validate = ajv.compile(schema);
if (!validate) console.log(validate.errors);
