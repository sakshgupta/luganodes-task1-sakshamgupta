const bcrypt = require('bcrypt');
const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');

const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user document and save it to the database
    const newUserId = uuidv4();
    // console.log('Generated User ID:', newUserId);
    const newUser = new User({
        user_id: newUserId,
        name,
        password: hashedPassword,
        email
    });

    const savedUser = await newUser.save();

    return res.status(201).json({ message: 'User signed up successfully.', user: savedUser });
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
};

const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
        }

        return res.status(200).json({ message: 'User signed in successfully.', user });
    } catch (error) {
        console.error('Error during signin:', error);
        return res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
};

module.exports = {
  signUp,
  signIn
};
