import { Request, Response, Router } from 'express';
import BlogModel from '../schemas/blog.schema';

const BlogRoute = Router();

// get all Blog
BlogRoute.get('/all-blogs', async (req: Request, res: Response) => {
	try {
		const blog = await BlogModel.find({});
		res.json(blog);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server Error' });
	}
});

// add a new blog
BlogRoute.post('/new-blog', async (req: Request, res: Response) => {
	const { content } = req.body;

	try {
		const newBlog = new BlogModel({
			content,
		});
		await newBlog.save();
		res.json(newBlog);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server Error' });
	}
});

// put request to update a blog
BlogRoute.put('/update-blog/:id', async (req: Request, res: Response) => {
	const { content } = req.body;
	const { id } = req.params;

	try {
		const updateBlog = await BlogModel.findByIdAndUpdate(
			id,
			{ content },
			{ new: true }
		);
		res.json(updateBlog);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server Error' });
	}
});

// delete a blog

BlogRoute.delete('/delete-blog/:id', async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		await BlogModel.findByIdAndDelete(id);
		res.json({ message: 'Blog deleted' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server Error' });
	}
});

export default BlogRoute;
