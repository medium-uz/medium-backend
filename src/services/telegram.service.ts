import { Telegraf } from 'telegraf';
import { generateAuthCode } from '../utils/generate.code';
import { IAUTH } from '../types/IAuth';
import dotenv from 'dotenv';
dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_TOKEN!);
const authCodes: Map<string, IAUTH> = new Map();

bot.start(ctx => {
	const userId = ctx.from.id;
	const authCode = generateAuthCode();

	authCodes.set(authCode, {
		userId,
		username: ctx.from.first_name,
		phone: undefined,
	});
	ctx.reply(
		`Your login code: ${authCode}\nEnter this code in the application to log in.`
	);
});

bot.launch();

export const validateAuthCode = (code: string): IAUTH | null => {
	if (authCodes.has(code)) {
		const userData = authCodes.get(code)!;
		authCodes.delete(code);
		return userData;
	}
	return null;
};
