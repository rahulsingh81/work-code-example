import userModel from "../Models/userModel";
class user {
    addUser = async (args) => {
        try {
            return await userModel.create(args);
        } catch (err) {
            console.log("error", err);
        }
    };
    getUserWithEmail = async (args) => {
        try {
            return await userModel.findOne({ email: args.email });
        } catch (error) {
            console.log("error", error);
        }
    };
}
export default new user();
