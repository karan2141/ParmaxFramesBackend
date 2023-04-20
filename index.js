import express from 'express'
import connectMongoDb from './mongoConfig.js'
import bodyParser from 'body-parser'
import { User } from './model.js'
import axios from 'axios'
import chalk from 'chalk'

connectMongoDb()

const app = express()

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.json());

app.get('/',async(req,res) => {
    try{
        const result = await axios({
            method: 'get',
            url: 'https://randomuser.me/api/'
        })
        const name = result.data.results[0].name.first
        const email = result.data.results[0].email
        const user = new User({
            name,
            email
        })
        await user.save()
        res.send({
            status: 200,
            message: 'Success'
        })
    } catch(e) {
        res.statusMessage = "Something went wrong";
        res.status(500).end();
    }
})

const port = process.env.PORT || 8080
app.listen(port, ()=>{
    console.log(chalk.green(`server started on port ${port}`));
})