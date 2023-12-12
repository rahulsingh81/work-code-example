import Ajv from "ajv";
import userControllers from "../controllers/userControllers";
import User from "../controllers/userControllers";
import { BinaryLike } from "node:crypto";
const ajv = new Ajv();
const userAdd = async function routes(fastify, opts) {
    fastify.post("/add-user", { schema }, async (request, reply) => {
        try {
            const { email, password } = request.body;
            const user = await userControllers.getUserWithEmail({ email });
            console.log("user", user);
            if (email) {
                const link = await fastify.createVerifyLink({
                    email,
                    password,
                });
                const linked = await fastify.sendEmail(link, email);
                console.log("link", link);
                console.log("linked", linked);
            }
        } catch (err) {
            console.log("error", err);
        }
    });

    fastify.post(
        "/verify-email-link/:id",
        { schema },
        async (request, reply) => {
            try {
                console.log("verify-email-link", request.params?.["id"]);
                const { createHmac } = await import("node:crypto");
                const encryptLink = request.params;
                const decryptString = fastify.decrypt(encryptLink);
                const email = decryptString.email;
                console.log("decryptString", decryptString);
                if (
                    !(
                        (new Date().getTime() -
                            new Date(decryptString.date).getTime()) /
                            1000 >
                        3600
                    ) &&
                    typeof decryptString !== "boolean"
                ) {
                    const passwordHash = createHmac(
                        "sha256",
                        process.env.SECRAT
                    )
                        .update(decryptString.password as unknown as BinaryLike)
                        .digest("hex");
                    const addedUser = await User.addUser({
                        email,
                        password: passwordHash,
                    });
                    console.log("user", addedUser);
                }
            } catch (err) {
                console.log("error", err);
            }
        }
    );
};
export default userAdd;
const bodySchema = {
    type: "object",
    properties: {
        email: { type: "string" },
        password: { type: "string" },
    },
    required: ["email", "password"],
};

const paramsJsonSchema = {
    type: "string",
    properties: {
        id: { type: "string" },
    },
};

const schema = {
    type: "object",
    properties: {
        body: bodySchema,
        params: paramsJsonSchema,
    },
};
const validate = ajv.compile(schema);
if (!validate) console.log(validate.errors);
