import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import Cryptr from "cryptr";
const cryptr = new Cryptr(process.env.SECRAT);
export default fp<{}>(async (fastify: FastifyInstance, opts: {}, next: any) => {
    fastify.decorate("createVerifyLink", (args: { email: string }) => {
        return `${process.env.HOST}/verify-email-link/${fastify.encrypt({
            email: args.email,
            date: new Date(),
        })}`;
    });
    fastify.decorate("encrypt", (payload: object) => {
        try {
            return cryptr.encrypt(
                JSON.stringify({ date: new Date(), ...payload })
            );
        } catch (error) {
            return false;
        }
    });
    fastify.decorate("decrypt", (encryptedString: string) => {
        try {
            return JSON.parse(cryptr.decrypt(encryptedString));
        } catch (error) {
            return false;
        }
    });
    next();
});
declare module "fastify" {
    export interface FastifyInstance {
        createVerifyLink({ email, password }): {
            isSend: boolean;
            link?: string;
        };
        encrypt(payload: object);
        decrypt(encryptedString: string);
    }
}
