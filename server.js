const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const mongoose = require('mongoose');

// MongoDB Community Edition URI
const mongoURI = 'mongodb://127.0.0.1:27017/Exoticabites';

mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));



// User schema and model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', UserSchema);

// API Endpoints

/**
 * @route POST /api/register
 * @desc Register a new user
 */
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route POST /api/login
 * @desc Authenticate a user and log them in
 */
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const Razorpay = require('razorpay');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: 'your_key_id', // Replace with your Razorpay Key ID
  key_secret: 'your_key_secret', // Replace with your Razorpay Key Secret
});

// API Endpoint to Create Payment Order
app.post('/create-order', async (req, res) => {
  const { amount, currency, receipt } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to smallest currency unit (e.g., paise for INR)
      currency: currency,
      receipt: receipt,
    });
    res.status(201).json(order);
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ message: 'Payment creation failed' });
  }
});
// Create Address Schema
const addressSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    pincode: { type: String, required: true },
  });
  
  // Create Address Model
  const Address = mongoose.model('Address', addressSchema);
  
  // API Endpoint to Save Address
  app.post('/save-address', async (req, res) => {
    const { name, address, phone, pincode } = req.body;
  
    try {
      const newAddress = new Address({ name, address, phone, pincode });
      await newAddress.save();
      res.status(201).json({ message: 'Address saved successfully' });
    } catch (error) {
      console.error('Error saving address:', error);
      res.status(500).json({ message: 'Failed to save address' });
    }
  });
  app.post('/verify-payment', async (req, res) => {
    const crypto = require('crypto');
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
    try {
      // Generate the signature
      const generatedSignature = crypto
        .createHmac('sha256', 'your_key_secret') // Replace with your Razorpay Key Secret
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');
  
      // Compare signatures
      if (generatedSignature === razorpay_signature) {
        res.status(200).json({ message: 'Payment verified successfully' });
      } else {
        res.status(400).json({ message: 'Invalid signature' });
      }
    } catch (error) {
      console.error('Verification error:', error);
      res.status(500).json({ message: 'Internal server error during verification' });
    }
  });
  