import mongoose from "mongoose";
import chalk from "chalk";

mongoose.set('strictQuery', false)

const { DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env

const connectMongoDb = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.tbjqc5e.mongodb.net/${DB_NAME}`)
        console.log(chalk.green.inverse("mongo connection established!!!"));
    } catch (err) {
        console.log(chalk.red(err));
    }
}

export default connectMongoDb