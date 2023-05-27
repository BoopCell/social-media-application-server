import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

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
const PORT = process.env.PORT || 6001;
mongoose
	.connect(process.env.MONGO_URL, {
		useNewURLParser: true,
		useUnifiedTopology: true,
	})
	.then(() =>
		app.listen(PORT, () =>
			console.log(`Server is listening on port: ${process.env.PORT}`),
		),
	)
	.catch((error) => console.log(`${error} did not connect`));
