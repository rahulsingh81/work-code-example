import mongoose from "mongoose";

const user = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
});
const userModel = mongoose.model("User", user);
export default userModel;
