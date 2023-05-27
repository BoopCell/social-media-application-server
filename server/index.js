import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postsRoutes from './routes/posts.js';
import { createPost } from './controllers/posts.js';
import { register } from './controllers/auth.js';
import { verifyToken } from './middleware/auth.js';
import User from './models/User.js';
import { users, posts } from './data/index.js';
import Post from './models/Post.js';

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy());
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

/* FILE STORAGE */
const storage = multer.diskStorage({
	destination: function (req, res, cb) {
		cb(null, 'public/assets');
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post('/auth/register', upload.single('picture'), register);
app.post('/posts', verifyToken, upload.single('picture'), createPost);

/* ROUTES */
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postsRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
	.connect(process.env.MONGO_URL, {
		useNewURLParser: true,
		useUnifiedTopology: true,
	})
	.then(() =>
		app.listen(PORT, () => {
			console.log(`Server is listening on port: ${process.env.PORT}`);
			/* Insert fake data */
			// User.insertMany(users);
			// Post.insertMany(posts);
		}),
	)
	.catch((error) => console.log(`${error} did not connect`));
