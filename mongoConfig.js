import mongoose from "mongoose";
import chalk from "chalk";
import { DB_NAME, DB_PASSWORD, DB_USERNAME } from './constants'

mongoose.set('strictQuery', false)

const connectMongoDb = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.tbjqc5e.mongodb.net/${DB_NAME}`)
        console.log(chalk.green.inverse("mongo connection established!!!"));
    } catch (err) {
        console.log(chalk.red(err));
    }
}

export default connectMongoDb