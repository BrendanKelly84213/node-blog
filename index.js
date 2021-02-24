import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import User from './user.js';
import Post from './post.js';

const connection = 'mongodb://localhost/admin';

mongoose.connect(connection)
	.then(console.log('connected to blogdb'))
	.catch(e => console.log('Error connecting to db: ', e));

const jon = new User({
	name: "Jon"
});

jon.save()
	.then(console.log('saved user: jon'))
	.catch(e => console.log("Error on saving user : ", e));
