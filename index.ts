import express = require('express');
import fetch from 'node-fetch';
import { generateDefaultMessage, generatePushMessage } from './generate-message'
const app = express();



app.use(express.json())

app.post('/', async (req, res)=>{
    try { 
        if (!req.query.url) throw `Please specify a URL to send to`;
        const url: string = `${req.query.url as string}&token=${req.query.token}`
        const tstping = await fetch(url)
        if (tstping.status!==401) throw `Invalid URL: Expected test ping response of 401, got ${tstping.status}`;
        const event = req.header("X-GitHub-Event");
        const sendMessage = event==="push"?generatePushMessage(req.body):generateDefaultMessage(req.body, event)
        const whres = await sendMessage(url);
        res.status(whres.status).send(`URL: ${whres.url} \n Repsonse: ${whres.status}: ${whres.statusText} \n Response Body: ${whres.body.read()}`)
    } catch (error) {
        res.status(400).send(`Bad Request: ${error}`)
    }
})

app.listen(8000)