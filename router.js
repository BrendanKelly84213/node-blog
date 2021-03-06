import express from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import Post from './post.js'
import User from './user.js'

const router = express.Router(); 
const app = express();

const salts = 10;

function handleErr(res, err) {
	return res.status(400).json({
		success: false,
		err
	});
}

// Create post 
router.post('/posts', (req, res) => {
	const body = req.body;
	const post = new Post(body);	

	post.save()
		.then(() => 
			res.status(200).json({
				success: true,
				id: post._id,
				message: 'post added'
			})
		)
		.catch(err => 
			res.status(400).json({
				err,
				message: 'failed item'
			})
		);
});

router.get('/posts', (req,res) => {
	Post.find({}, (err, posts) => {
		if(err) {
			return res.status(400)
				.json({
					success: false,
					err
				});
		} 
		return res.status(200)
			.json({
				success: true,
				data: posts
			});
	});
});

router.get('/users', (req,res) => {
	User.find({}, (err, users) => {
		if(err) {
			return res.status(400)
				.json({
					success: false,
					err
				});
		} 
		return res.status(200)
			.json({
				success: true,
				data: users
			});
	});
});

// Handle user registration
router.post('/register', async (req,res) => {
	const { username, password } = req.body;

	console.log(req.body);
	
	try {
		// Encrypt password
		const hash = await bcrypt.hash(password, salts);
		const usr = new User({
			name: username,
			password: hash
		});

		const duplicate = await User.findOne({ name: username });

		if(!duplicate) {
			await usr.save();
		} else {
			return res.status(400).json({
				duplicate,
				success: false,
				message: "Username already taken"
			});
		}

		// Add to db
		return res.status(200).json({
			result,
			message: "new user added",
			success: true
		});

	} catch (err) {
		console.log(error);
		return handleErr(res, error) 
	}
	
});

// Handle user login
router.post('/login', async (req,res) => {
	const { username, password } = req.body;
	const secret = 'testsecret';
	
	try {
		// Use bcrypt to verify if password is in db 
		const user = await User.findOne({ name: username });
		console.log(req.body);

		if(user) {
			const cmp = await bcrypt.compare(password, user.password);
			if(cmp) { // the user enters the correct password

				// create a session or send JWT token
				const token = jwt.sign({ usenrame: user.username }, secret);

				return res.status(200).json({
					token,
					success: true,
					message: "user succesfully logged in"
				});

			} else return res.status(400).json({
				user,
				success: false,
				message: "Incorrect password"
			});
		} else return res.status(400).json({
			user,
			success: false,
			message: "No such username"
		});

	} catch (error) {
		console.log(error);
		return handleErr(res, error);
	}
	
});

export default router;
