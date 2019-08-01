const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/datavault', { useCreateIndex: true, useNewUrlParser: true });
const db = mongoose.connection;

var userSchema = mongoose.Schema({
    user: {
        type: String
    },
    pass: {
        type: String
    },
    admin: {
        type: Boolean
    }
});

module.exports = user = mongoose.model('user', userSchema);