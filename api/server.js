const express = require('express');
const cors = require('cors');
const db = require('./sqlite/db-config')

const server = express();

server.use(express.json());
server.use(cors());
server.options('*', cors());
server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
       next();
 });

server.get('/', async (req, res) => {
    try {
        const obj = await db.find().orderBy('id', "desc");
        return res.status(200).json({obj});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: error})
    }
})

server.get('/:id', async (req, res) => {
    try {
        const obj = await db.findById(req.params.id);
        obj ? res.status(200).json(obj) : res.status(404).json({error: 'not found'});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: error})
    }
})

server.post('/', async (req, res) => {
    try {
        const obj = await db.insert(req.body);
        obj ? res.status(201).json(obj) : res.status(400).json({error: 'failed'});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: error})
    }
})

server.put('/:id', async (req, res) => {
    try {
        const obj = await db.update(req.params.id, req.body);
        obj ? res.status(200).json(obj) : res.status(404).json({error: 'not found'});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: error})
    }
})

server.delete('/:id', async (req, res) => {
    try {
        const obj = await db.remove(req.params.id);
        obj > 0 ? res.status(201).json(obj) : res.status(404).json({error: 'not found'});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: error})
    }
})

module.exports = server;