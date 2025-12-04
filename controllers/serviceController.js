const Service = require('../models/Service');

const normalizeArrayField = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const formatService = (service) => ({
  id: service._id.toString(),
  title: service.title,
  description: service.description,
  about: service.about,
  image: service.image,
  // icon and color removed from API representation
  price: service.price,
  currency: service.currency,
  country: service.country,
  // Legacy fixed dates (kept for backward compatibility)
  start_date: service.start_date,
  end_date: service.end_date,
  // New maximum duration in days
  duration_days: service.duration_days,
  status: service.status,
  benefits: service.benefits || [],
  features: service.features || [],
  created_at: service.createdAt,
  updated_at: service.updatedAt
});

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ status: 'active' }).sort({ createdAt: -1 }).lean();
    res.json(services.map(formatService));
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id).lean();
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.json(formatService(service));
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
};

exports.createService = async (req, res) => {
  try {
    const {
      title,
      description,
      about,
      image,
      price,
      currency,
      country,
      start_date,
      end_date,
      duration_days,
      status,
      benefits,
      features
    } = req.body;

    const service = await Service.create({
      title,
      description,
      about: about || null,
      image: image || null,
      // icon/color intentionally omitted
      price: price ?? 0,
      currency: currency || 'TND',
      country: country || null,
      start_date: start_date || null,
      end_date: end_date || null,
      duration_days: duration_days ?? null,
      status: status || 'active',
      benefits: normalizeArrayField(benefits),
      features: normalizeArrayField(features)
    });

    res.status(201).json({
      id: service._id.toString(),
      message: 'Service created successfully'
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      about,
      image,
      price,
      currency,
      country,
      start_date,
      end_date,
      duration_days,
      status,
      benefits,
      features
    } = req.body;

    const service = await Service.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          description,
          about,
          image,
          // icon/color intentionally omitted
          price,
          currency,
          country: country || null,
          start_date: start_date || null,
          end_date: end_date || null,
          duration_days: duration_days ?? null,
          status,
          benefits: normalizeArrayField(benefits),
          features: normalizeArrayField(features)
        }
      },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ message: 'Service updated successfully' });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Service.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
};