import crypto from 'crypto';

export const generateAuthCode = (): string => {
	return crypto.randomBytes(4).toString('hex');
};
