const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

// @route    GET api/products
// @desc     Get all products
// @access   Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/products/:id
// @desc     Get single product
// @access   Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    POST api/products
// @desc     Create a product
// @access   Private/Admin
router.post(
  '/',
  [
    protect,
    authorize('admin'),
    [
      check('name', 'Name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('price', 'Price is required').isNumeric(),
      check('category', 'Category is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const product = new Product({
        ...req.body,
        user: req.user.id
      });

      await product.save();
      res.json(product);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    PUT api/products/:id
// @desc     Update a product
// @access   Private/Admin
router.put(
  '/:id',
  [protect, authorize('admin')],
  async (req, res) => {
    try {
      let product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
      }

      product = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );

      res.json(product);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/products/:id
// @desc     Delete a product
// @access   Private/Admin
router.delete(
  '/:id',
  [protect, authorize('admin')],
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
      }

      await product.remove();
      res.json({ msg: 'Product removed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;