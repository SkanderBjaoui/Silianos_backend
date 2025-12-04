const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');

router.get('/', galleryController.getAllImages);
router.get('/categories', galleryController.getCategories);
router.get('/category/:category', galleryController.getImagesByCategory);
router.get('/:id', galleryController.getImageById);
router.post('/', galleryController.createImage);
router.put('/:id', galleryController.updateImage);
router.delete('/:id', galleryController.deleteImage);

module.exports = router;

