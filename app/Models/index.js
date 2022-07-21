require('dotenv/config');
const mongoose = require('mongoose');

mongoose.connect(
  process.env.DB_STRING,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  err => {
    if (!err) console.log('Connected to db');
    else console.log(err);
  }
);
