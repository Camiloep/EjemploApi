const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); 
const bodyparser = require('body-parser');
require('dotenv').config();
const movieService = require("../Services/movieServices");

const uri = process.env.URI; 

const router = express.Router();

const service = new movieService();

/**
 * CRUD . CREATE , READ, UPDATE, DELETE
 */

//2. READ
//2.1 find()
router.get('/', async (req, res)=>{
        const resultado = await service.find();
        if (resultado.length>0) {
            res.status(200).send(resultado); 
        }else { 
            res.status(404).send("No encontrado")
        }
})

//2.1 findOne()
router.get('/:id', async (req, res)=>{
    const id = req.params.id;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const movie = await client.db("sample_mflix").collection("movies").findOne({_id: new ObjectId(id)});
        if(movie){
            res.status(200).send(movie);
        }else{
            res.status(404).send("No se encontro la pelicula");
        }
    }catch(e){
        console.log(e);
    }finally{
        await client.close();
    }
})

//1. CREATE
//1.1 insertOne()
router.post('/', async (req, res)=>{ 
    const body = req.body;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const result = await client.db("sample_mflix").collection("movies").insertOne(body);
        if(result){
            res.status(201).json({
                message: 'Se creo la pelicula en la Base de Datos',
                result,
                //data: body
            });
        }else{
            res.status(404).send("No se creo la pelicula");
        }
    }catch(e){
        console.log(e);
    }finally{
        await client.close();
    }
})

//1.2 insertMany()
router.post('/', async (req, res)=>{
    const body = req.body;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const result = await client.db("sample_mflix").collection("movies").insertMany(body);
        if(result){
            res.status(201).json({
                message: 'Se crearon las pelicula en la Base de Datos',
                result,
                //data: body
            });
        }else{
            res.status(400).send("No se creo la pelicula");
        }
    }catch(e){
        console.log(e);
    }finally{
        await client.close();
    }
})

//3. UPDATE
// updateOne() Actualizamos solo un campo
router.patch('/:id', async (req, res)=>{
    const id = req.params.id;
    const body = req.body;
    const title = body.title;
    const year = body.year;
    const resultado = await service.updateOne(id, title, year);
    if(resultado){
        res.status(201).json({
            "message": "Se modifico la pelicula",
            data: body
        });
    }else{
        res.status(404).send("No se encontró la pelicula");
    }
})

// DELETE
// deleteOne() Actualizamos solo un documento
router.delete('/:id', async (req, res)=>{
    const id = req.params.id;
    const body = req.body;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const result = await client.db("sample_mflix").collection("movies").deleteOne({_id: new ObjectId(id)});
        if(result){
            res.status(204).json({
                message: 'Se borro la pelicula',
                result,
                //data: body
            });
        }else{
            res.status(400).send("No se actualizo la pelicula");
        }
    }catch(e){
        console.log(e);
    }finally{
        await client.close();
    }
})

module.exports = router;
