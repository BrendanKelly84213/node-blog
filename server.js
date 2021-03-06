import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import User from './user.js';
import Post from './post.js';
import router from './router.js';

const connection = 'mongodb://brendan:15161516@localhost/admin';

const app = express();

mongoose.connect(connection)
	.then(console.log('connected to blogdb'))
	.catch(e => console.log('Error connecting to db: ', e));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/', router);

app.listen(3001, () => console.log("server online"));
