const PricingPackage = require('../models/PricingPackage');

const normalizeFeatures = (features) => {
  if (!features) return [];
  if (Array.isArray(features)) return features;
  try {
    const parsed = JSON.parse(features);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const formatPackage = (pkg) => ({
  id: pkg._id.toString(),
  title: pkg.title,
  description: pkg.description,
  price: pkg.price,
  currency: pkg.currency,
  period: pkg.period,
  start_date: pkg.start_date,
  end_date: pkg.end_date,
  image: pkg.image,
  badge: pkg.badge,
  features: pkg.features || [],
  is_active: pkg.is_active,
  created_at: pkg.createdAt,
  updated_at: pkg.updatedAt
});

exports.getAllPackages = async (req, res) => {
  try {
    const packages = await PricingPackage.find({ is_active: true }).sort({ createdAt: -1 }).lean();
    res.json(packages.map(formatPackage));
  } catch (error) {
    console.error('Error fetching pricing packages:', error);
    res.status(500).json({ error: 'Failed to fetch pricing packages' });
  }
};

exports.getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const pkg = await PricingPackage.findById(id).lean();
    
    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }
    
    res.json(formatPackage(pkg));
  } catch (error) {
    console.error('Error fetching package:', error);
    res.status(500).json({ error: 'Failed to fetch package' });
  }
};

exports.createPackage = async (req, res) => {
  try {
    const { title, description, price, currency, period, start_date, end_date, image, badge, features, is_active } = req.body;

    const pkg = await PricingPackage.create({
      title,
      description: description || null,
      price,
      currency: currency || 'DT',
      period: period || null,
      start_date: start_date || null,
      end_date: end_date || null,
      image: image || null,
      badge: badge || null,
      features: normalizeFeatures(features),
      is_active: is_active !== undefined ? is_active : true
    });

    res.status(201).json({
      id: pkg._id.toString(),
      message: 'Package created successfully'
    });
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({ error: 'Failed to create package' });
  }
};

exports.updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, currency, period, start_date, end_date, image, badge, features, is_active } = req.body;

    const pkg = await PricingPackage.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          description,
          price,
          currency,
          period,
          start_date: start_date || null,
          end_date: end_date || null,
          image,
          badge,
          features: normalizeFeatures(features),
          is_active
        }
      },
      { new: true }
    );

    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.json({ message: 'Package updated successfully' });
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ error: 'Failed to update package' });
  }
};

exports.deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PricingPackage.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).json({ error: 'Failed to delete package' });
  }
};

