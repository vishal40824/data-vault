const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/datavault', { useCreateIndex: true, useNewUrlParser: true });
const db = mongoose.connection;
var lvdataSchema = mongoose.Schema({
    whichUser: {
        type: String
    },
    whichcatalog: {
        type: String
    },
    prod: {
        type:String
    },
    flex: {
        type: String
    },
    ver: {
        type: String
    },
    ed:{
        type: String
    },
    instselect:{
        type: String
    },
    selecteddata:{
        type: String
    },
    fileDetails:{
        type: Object
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = lvdata = mongoose.model('lvdata', lvdataSchema);