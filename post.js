import mongoose from 'mongoose';
import User from './user.js';

const PostSchema = new mongoose.Schema({
	title: String,
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
});

export default mongoose.model('Post', PostSchema);
