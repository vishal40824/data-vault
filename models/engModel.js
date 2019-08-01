const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/datavault', { useCreateIndex: true, useNewUrlParser: true });
const db = mongoose.connection;

var engSchema = mongoose.Schema({
    user: {
        type: String
    },
    pass: {
        type: String
    }
});

module.exports = eng = mongoose.model('eng', engSchema);