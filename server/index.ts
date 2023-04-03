// Imports
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const path = require('path');
const cors = require('cors');

app.use(express.json());
app.use(express.static('client/build'));
app.use(cors({ origin: 'ttps://quiet-gorge-29705.herokuapp.com' }));

// Routes
// app.use('/api/users', users);

// app.get('/*', (_, res) => {
//     res.sendFile(path.join(__dirname, 'client/build/index.html'));
// })

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})

// DB Connection
mongoose.connect(process.env.MONGODB_URI_DEV)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB', err))