import { Schema, model } from 'mongoose';
import { IBLOG } from '../types/IBlog';
const BlogSchema = new Schema<IBLOG>({
	content: { type: String, required: true },
});

BlogSchema.methods.toJSON = function () {
	const postObject = this.toObject();
	delete postObject.__v;

	return postObject;
};

const BlogModel = model('blog-medium', BlogSchema);
export default BlogModel;
