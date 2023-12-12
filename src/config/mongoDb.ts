import fp from "fastify-plugin";
import mongoose from "mongoose";

export default fp<{}>(async (fastify, opts) => {
    mongoose
        .connect("mongodb://localhost:27017/startup")
        .then(() => console.log("connected monogodb"))
        .catch((error) => {
            throw new Error(error);
        });
});
