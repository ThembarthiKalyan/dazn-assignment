import { Movie } from "./movie";

const express= require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use(bodyParser());
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/movieProject');
const MovieModel = require('../model/movie.js');

app.post('/movies', async(req, res)=>{
    try{
        if(req.headers.role !== 'Admin'){
            return res.send({success: false, message: 'Only admin has the access'})
        }

        let movie: Movie = {
            title: req.body.title.toLowerCase(),
            genre: req.body.genre,
            rating: req.body.rating,
            link: req.body.link
        }
        let doc = await MovieModel.create(movie);
        res.status(200).send({success: true, data: doc._doc});

    }catch(error){
        res.send({success: false, message: error.message});
    }
})

app.get('/movies', async(req,res)=>{
    try{
        let movies = await MovieModel.find();
        res.status(200).send({success: true, data: movies});
    }catch(error){
        res.send({success: false, message: error.message});
    }
})

app.get('/search', async(req, res)=>{
    try{
        let queryParams: any = req.query;
        let title: String = queryParams && queryParams.q
        let movieDoc = await MovieModel.find({title: title.toLowerCase()});
        res.status(200).send({success: true, data: movieDoc[0]._doc});
    }catch(error){
        res.send({success: false, message: error.message});
    }
})

app.put('/movies/:id', async(req,res)=>{
    try{
        if(req.headers.role !== 'Admin'){
            return res.send({success: false, message: 'Only admin has the access'})
        }
        let id: String = req.params.id;
        let body:Object = req.body;
        let movieDoc: any = await MovieModel.findOne({_id: id});
        if(!movieDoc){
            return res.send({success: false, message: "No movie existed in lobby"});
        }
        let prevDoc: Object = movieDoc._doc;
        let newDoc: Object = Object.assign({}, prevDoc, body);
        await MovieModel.updateOne({_id: id}, newDoc);
        res.status(200).send({success: true,message: "Movie data updated"});

    }catch(error){
        res.send({success: false, message: error.message});
    }
})

app.delete('/movies/:id', async(req, res)=>{
    try{
        if(req.headers.role !== 'Admin'){
            return res.send({success: false, message: 'Only admin has the access'})
        }
        let id: String = req.params.id;
        const movieDoc = await MovieModel.findOne({ _id: id});
        if(!movieDoc){
            return res.send({success: false, message: "No movie existed in lobby"});
        }
        await MovieModel.deleteOne({_id: id});
        res.status(200).send({success: true,message: "Movie deleted successfully"});

    }catch(error){
        res.send({success: false, message: error.message});
    }
})

app.listen(port, ()=>{console.log(`App listening to the server ${port}`)});

module.exports = app;