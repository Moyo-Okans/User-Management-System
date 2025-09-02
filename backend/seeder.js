require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userModel');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for seeding...'))
  .catch(err => { console.error('MongoDB connection error:', err); process.exit(1); });

(async () => {
  try {
    await User.deleteOne({ email: 'admin@email.com' });

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@email.com',
      password: 'admin123', // plain; pre-save will hash
      role: 'admin',
    });

    console.log('Admin reset & created:', admin.email);
  } catch (err) {
    console.error('Error seeding admin:', err);
  } finally {
    await mongoose.connection.close();
  }
})();
