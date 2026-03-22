const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use('/tasks', require('./routes/tasks'));

//simple root route
app.get('/', (req, res) => {
    res.send('TaskManager API is running');
});

//connect to db
const connectDB = async() => {
    try
    {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    }
    catch (error)
    {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test')
{
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    });
}

module.exports = { app, connectDB };