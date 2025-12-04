const GalleryImage = require('../models/GalleryImage');

const formatImage = (image) => ({
  id: image._id.toString(),
  title: image.title,
  image: image.image,
  category: image.category,
  description: image.description,
  date: image.date,
  created_at: image.createdAt,
  updated_at: image.updatedAt
});

exports.getAllImages = async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ date: -1, createdAt: -1 }).lean();
    res.json(images.map(formatImage));
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({ error: 'Failed to fetch gallery images' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await GalleryImage.distinct('category');
    res.json(categories.sort());
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

exports.getImagesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const images = await GalleryImage.find({ category }).sort({ date: -1 }).lean();
    res.json(images.map(formatImage));
  } catch (error) {
    console.error('Error fetching images by category:', error);
    res.status(500).json({ error: 'Failed to fetch images by category' });
  }
};

exports.getImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await GalleryImage.findById(id).lean();
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    res.json(formatImage(image));
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
};

exports.createImage = async (req, res) => {
  try {
    const { title, image, category, description, date } = req.body;

    const created = await GalleryImage.create({
      title,
      image,
      category,
      description: description || null,
      date: date || new Date().toISOString().split('T')[0]
    });

    res.status(201).json({
      id: created._id.toString(),
      message: 'Image added successfully'
    });
  } catch (error) {
    console.error('Error creating image:', error);
    res.status(500).json({ error: 'Failed to add image' });
  }
};

exports.updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image, category, description, date } = req.body;

    const updated = await GalleryImage.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          image,
          category,
          description,
          date
        }
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json({ message: 'Image updated successfully' });
  } catch (error) {
    console.error('Error updating image:', error);
    res.status(500).json({ error: 'Failed to update image' });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await GalleryImage.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};

