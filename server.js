const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());  // Enables cross-origin requests
app.use(bodyParser.json());  // Parses incoming JSON requests

// MongoDB Connection
const mongoURI = 'mongodb+srv://RaviDB:ravi@cluster0.wlimz.mongodb.net/MobileApp';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,  // Password will be hashed
});

const User = mongoose.model('SignUpDetails', userSchema); // Ensure correct collection name

// Signup Route
app.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user and save to database
    const newUser = new User({ name, email, phone, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { name, password } = req.body;

  try {
    // Find the user in the database by name
    const user = await User.findOne({ name });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Compare the given password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Successful login
    res.status(200).json({ message: 'Login successful', name: user.name });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
