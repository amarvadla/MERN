const express = require('express');
const app = express();
const connectDB = require('./config/db');

connectDB();

app.use(express.json({ extended: false }));

app.use('/rest/user', require('./routes/users'));
app.use('/rest/auth', require('./routes/auth'));
app.use('/rest/profile', require('./routes/profile'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('running on port ' + PORT));
