const Testimonial = require('../models/Testimonial');

const formatTestimonial = (testimonial) => ({
  id: testimonial._id.toString(),
  customer_name: testimonial.customer_name,
  customer_image: testimonial.customer_image,
  rating: testimonial.rating,
  comment: testimonial.comment,
  service: testimonial.service,
  date: testimonial.date || (testimonial.createdAt?.toISOString().split('T')[0]),
  verified: testimonial.verified,
  created_at: testimonial.createdAt,
  updated_at: testimonial.updatedAt
});

exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ date: -1, createdAt: -1 }).lean();
    res.json(testimonials.map(formatTestimonial));
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};

exports.getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id).lean();
    
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    
    res.json(formatTestimonial(testimonial));
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    res.status(500).json({ error: 'Failed to fetch testimonial' });
  }
};

exports.createTestimonial = async (req, res) => {
  try {
    const { customer_name, customer_image, rating, comment, service, date } = req.body;

    const testimonial = await Testimonial.create({
      customer_name,
      customer_image: customer_image || null,
      rating,
      comment,
      service,
      date: date || new Date().toISOString().split('T')[0]
    });

    res.status(201).json({
      id: testimonial._id.toString(),
      message: 'Testimonial created successfully'
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_name, customer_image, rating, comment, service, date } = req.body;

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      {
        $set: {
          customer_name,
          customer_image,
          rating,
          comment,
          service,
          date
        }
      },
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json({ message: 'Testimonial updated successfully' });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Testimonial.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
};

exports.verifyTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { $set: { verified: true } },
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json({ message: 'Testimonial verified successfully' });
  } catch (error) {
    console.error('Error verifying testimonial:', error);
    res.status(500).json({ error: 'Failed to verify testimonial' });
  }
};

