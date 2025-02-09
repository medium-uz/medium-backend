import { Router } from 'express';
import { validateAuthCode } from '../services/telegram.service';
import { createUser } from '../services/user.service';

const AuthRouter = Router();

AuthRouter.post('/register', async (req: any, res: any) => {
	try {
		const { code } = req.body;

		if (!code) {
			return res
				.status(400)
				.json({ success: false, message: 'Code is required' });
		}

		const user = validateAuthCode(code);
		if (!user) {
			return res
				.status(401)
				.json({ success: false, message: 'Invalid or expired code' });
		}

		// Save user to MongoDB
		const newUser = await createUser(user.userId, user.username, user.phone);

		return res.json({
			success: true,
			message: 'User registered successfully',
			user: newUser,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: 'Server error' });
	}
});

export default AuthRouter;
