const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/datavault', { useCreateIndex: true, useNewUrlParser: true });
const db = mongoose.connection;

var catalogSchema = mongoose.Schema({
    whichUser: {
        type: String
    },
    catalogname: {
        type: String
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = catalog = mongoose.model('catalog', catalogSchema);