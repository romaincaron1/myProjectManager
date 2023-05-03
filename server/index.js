// Imports
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const path = require('path');
const cors = require('cors');
const users = require('./routes/users');
const login = require('./routes/login');
const projects = require('./routes/projects');
const skills = require('./routes/skills');

app.use(express.json());
// app.use(express.static('client/build'));
// app.use(cors({ origin: 'ttps://quiet-gorge-29705.herokuapp.com' }));

// Routes
app.use('/api/users', users);
app.use('/api/login', login);
app.use('/api/projects', projects);
app.use('/api/skills', skills);

// app.get('/*', (_, res) => {
//     res.sendFile(path.join(__dirname, 'client/build/index.html'));
// })

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})

// DB Connection
mongoose.connect(process.env.MONGO_URI_PROD)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB', err))