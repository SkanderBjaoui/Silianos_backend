const express = require('express');
const router = express.Router();
const pricingController = require('../controllers/pricingController');

router.get('/', pricingController.getAllPackages);
router.get('/:id', pricingController.getPackageById);
router.post('/', pricingController.createPackage);
router.put('/:id', pricingController.updatePackage);
router.delete('/:id', pricingController.deletePackage);

module.exports = router;

