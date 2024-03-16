"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use(bodyParser());
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/movieProject');
const MovieModel = require('../model/movie.js');
app.post('/movies', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.headers.role !== 'Admin') {
            return res.send({ success: false, message: 'Only admin has the access' });
        }
        let movie = {
            title: req.body.title.toLowerCase(),
            genre: req.body.genre,
            rating: req.body.rating,
            link: req.body.link
        };
        let doc = yield MovieModel.create(movie);
        res.status(200).send({ success: true, data: doc._doc });
    }
    catch (error) {
        res.send({ success: false, message: error.message });
    }
}));
app.get('/movies', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let movies = yield MovieModel.find();
        res.status(200).send({ success: true, data: movies });
    }
    catch (error) {
        res.send({ success: false, message: error.message });
    }
}));
app.get('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let queryParams = req.query;
        let title = queryParams && queryParams.q;
        let movieDoc = yield MovieModel.find({ title: title.toLowerCase() });
        res.status(200).send({ success: true, data: movieDoc[0]._doc });
    }
    catch (error) {
        res.send({ success: false, message: error.message });
    }
}));
app.put('/movies/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.headers.role !== 'Admin') {
            return res.send({ success: false, message: 'Only admin has the access' });
        }
        let id = req.params.id;
        let body = req.body;
        let movieDoc = yield MovieModel.findOne({ _id: id });
        if (!movieDoc) {
            return res.send({ success: false, message: "No movie existed in lobby" });
        }
        let prevDoc = movieDoc._doc;
        let newDoc = Object.assign({}, prevDoc, body);
        yield MovieModel.updateOne({ _id: id }, newDoc);
        res.status(200).send({ success: true, message: "Movie data updated" });
    }
    catch (error) {
        res.send({ success: false, message: error.message });
    }
}));
app.delete('/movies/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.headers.role !== 'Admin') {
            return res.send({ success: false, message: 'Only admin has the access' });
        }
        let id = req.params.id;
        const movieDoc = yield MovieModel.findOne({ _id: id });
        if (!movieDoc) {
            return res.send({ success: false, message: "No movie existed in lobby" });
        }
        yield MovieModel.deleteOne({ _id: id });
        res.status(200).send({ success: true, message: "Movie deleted successfully" });
    }
    catch (error) {
        res.send({ success: false, message: error.message });
    }
}));
app.listen(port, () => { console.log(`App listening to the server ${port}`); });
module.exports = app;
//# sourceMappingURL=app.js.map