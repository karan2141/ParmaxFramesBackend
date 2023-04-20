import mongoose from "mongoose";
import chalk from "chalk";

mongoose.set('strictQuery', false)

const connectMongoDb = async () => {
    try {
        await mongoose.connect("mongodb+srv://admin-karanveer:Test%40123@cluster0.tbjqc5e.mongodb.net/letterDrop")
        console.log(chalk.green.inverse("mongo connection established!!!"));
    } catch (err) {
        console.log(chalk.red(err));
    }
}

export default connectMongoDb