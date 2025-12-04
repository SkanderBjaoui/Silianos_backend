const BlogPost = require('../models/BlogPost');

const formatPost = (post) => ({
  id: post._id.toString(),
  title: post.title,
  excerpt: post.excerpt,
  content: post.content,
  image: post.image,
  author: post.author,
  date: post.date,
  category: post.category,
  tags: post.tags || [],
  created_at: post.createdAt,
  updated_at: post.updatedAt
});

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ date: -1, createdAt: -1 }).lean();
    res.json(posts.map(formatPost));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await BlogPost.findById(id).lean();
    
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    res.json(formatPost(post));
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, excerpt, content, image, author, date, category, tags } = req.body;

    const post = await BlogPost.create({
      title,
      excerpt: excerpt || null,
      content,
      image: image || null,
      author,
      date: date || new Date().toISOString().split('T')[0],
      category,
      tags: Array.isArray(tags) ? tags : []
    });

    res.status(201).json({
      id: post._id.toString(),
      message: 'Blog post created successfully'
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, image, author, date, category, tags } = req.body;

    const post = await BlogPost.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          excerpt,
          content,
          image,
          author,
          date,
          category,
          tags: Array.isArray(tags) ? tags : []
        }
      },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json({ message: 'Blog post updated successfully' });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BlogPost.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
};

exports.getPostsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const posts = await BlogPost.find({ category }).sort({ date: -1 }).lean();
    res.json(posts.map(formatPost));
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    res.status(500).json({ error: 'Failed to fetch posts by category' });
  }
};

