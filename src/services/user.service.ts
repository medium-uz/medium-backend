import User, { IUser } from '../schemas/auth.schema';

export const createUser = async (
	userId: number,
	username?: string,
	phone?: string
) => {
	return await User.findOneAndUpdate(
		{ userId },
		{ userId, username, phone },
		{ upsert: true, new: true }
	);
};
