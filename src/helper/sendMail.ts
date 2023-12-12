import fp from "fastify-plugin";
import fastify, {
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
} from "fastify";
import nodemailer from "nodemailer";
import fastifyView from "@fastify/view";
export default fp<{}>(async (fastify: FastifyInstance, opts: {}, next: any) => {
    fastify.decorate("sendEmail", async (email: string, data: Object) => {
        try {
            if (process.env.MODE == "development") {
                let transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: "shreekantkumawat101@gmail.com",
                        pass: "vewlswwoswengmqk",
                    },
                });
                // return true;
                // const html = await fastify.view(`/src/utilities/emailViews/${txtCode?.["EMAIL_VERIFY"]}.ejs`, {
                //     ...data,
                // });
                return await transporter
                    .sendMail({
                        from: '"Chhayya Environmental Private Limited" <noreply@chhayya.com>',
                        to: email,
                        subject: ["EMAIL_VERIFY"],
                        data,
                    })
                    .then((message) => {
                        console.log("Email Message", message);
                    })
                    .catch((error) => {
                        console.log("Email Error", error);
                    });
            } else {
                return { isSend: true };
            }
        } catch (error) {
            console.log(error);
        }
    });
    next();
});
declare module "fastify" {
    export interface FastifyInstance {
        sendEmail(
            email: String,

            data?: Object
        ): {
            isSend: boolean;
        };
    }
}
