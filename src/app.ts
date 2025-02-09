import express from 'express';
import cors from 'cors';
import AuthRouter from './routes/auth.route';

const server = express();

const whitelist = ['http://localhost:3000'];

// CORS options
const corsOptions = {
	origin: function (origin: any, callback: any) {
		if (whitelist.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true,
};

// Middlewares
server.use(express.json({ limit: '10mb' }));
server.use(express.urlencoded({ limit: '10mb', extended: true }));

server.use(cors(corsOptions));

// Routes
server.use('/api', AuthRouter);

export { server };
