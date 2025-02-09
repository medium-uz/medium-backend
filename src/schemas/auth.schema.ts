import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
	userId: number;
	username?: string;
	phone?: string;
}

const UserSchema: Schema = new Schema(
	{
		userId: { type: Number, required: true, unique: true },
		username: { type: String },
		phone: { type: String },
	},
	{ timestamps: true }
);

export default mongoose.model<IUser>('medium-users', UserSchema);
