const express = require('express');
const session = require('express-session');
const app = express();
const multer = require('multer');
const path = require('path');
const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/datavault', { useCreateIndex: true, useNewUrlParser: true });
const db = mongoose.connection;

const port = 3000;
const opts = {
    key: fs.readFileSync(__dirname + '/ssl/server.key'),
    cert: fs.readFileSync(__dirname + '/ssl/server.crt')
  };

const lvdata = require('./models/lvdataModel');
const catalog = require('./models/catModel');
const user = require('./models/userModel');

app.use(session({
    secret:"mySecret",
    saveUninitialized: true,
    resave: false
}));

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use(function(req, res, next) {
// 	if (req.secure) {
// 		next();
// 	} else {
// 		res.redirect('https://' + 'localhost' + req.url);
// 	}
// });

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        cb(null,file.originalname.split(".")[0] + '-' + Date.now() + path.extname(file.originalname));
    }
});
  
// Init Upload
const upload = multer({
    storage: storage,
    // limits: {fileSize: 1000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('file');
  
// Check File Type
function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
        return cb(null,true);
    } else {
        return cb(null, true);
    //   cb('Error: Images Only!');
    }
}
  
app.post('/api/upload/:prod/:flex/:ver/:ed/:instSelect/:selectedData/:whichcatalog', (req, res) => {

    upload(req, res, (err) => {
        var query = {
            prod : req.params.prod,
            flex : req.params.flex,
            ver : req.params.ver,
            ed : req.params.ed,
            whichcatalog: req.params.whichcatalog,
            instselect : req.params.instSelect,
            selecteddata : req.params.selectedData,
            fileDetails : req.file,
        }
        
        if(err){
            res.json({
                err: err
            });
        } else {
            if(req.file == undefined){
                res.json({
                    err: 'Error: No File Selected!'
                });
            } else {
                lvdata.create(query, function(err, data){
                    if(err) res.send(err);
                    else{
                        res.json({
                            msg: 'File Uploaded: ',
                            file: `uploads/${req.file.filename}`,
                            ext: path.extname(req.file.filename),
                            name: req.file.filename,
                            uploaded: false,
                            contType: req.file.mimetype.split("/")
                        });
                    }
                });
            }
        }
    });
});

app.get('/download/:file', (req, res) => {
    const filePath = `${__dirname}/public/uploads/${req.params.file}`;
    res.download(filePath, req.params.file);
});

app.get('/ViewDoc/:name/:type', (req, res) => {
    const name = req.params.name;
    const type = req.params.type;

    const filePath = `${__dirname}/public/uploads/${name}`;
    fs.readFile(filePath, function(err, data){
        res.contentType(type.split("+").join("/"));
        res.send(data);
    })
});

app.get('/DownloadDoc/:name/:type', (req, res) => {
    const name = req.params.name;
    const filePath = `${__dirname}/public/uploads/${name}`;
    res.download(filePath);
});

app.post('/api/insertCatalog', (req, res) => {
    catalog.create({"catalogname": req.body.cat}, function(err, data){
        if(err) res.send(err);
        else res.json(data);
    });
});

app.get('/api/getCatalog', (req, res) => {
    catalog.find(function(err, data){
        if(err) res.send(err);
        else res.json(data);
    });
});

app.get('/api/getSpecificData/:catname', (req, res) => {
    lvdata.find({"whichcatalog": req.params.catname}, function(err, data){
        if(err) res.send(err);
        else res.json(data);
    })
});

app.delete('/api/deleteCat/:id', (req, res) => {
    lvdata.findByIdAndDelete({_id: req.params.id}, function(err, data){
        if(err) res.send(err);
        else res.json(data);
    });
});

app.get('/api/loggedUser', (req, res) => {
    res.json(req.session.user);
});

// Authentication proccess
function checkAuth(req, res, next) {
    if (!req.session.user) {
      res.send('You are not authorized to view this page');
    } else {
      next();
    }
}

app.get('/loggedIn', checkAuth, function (req, res) {
    res.sendFile(__dirname + '/public/logged.html');
});

app.get('/users/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/')
});

let save_sess = (req, data) => {
    req.session.user = data;
}

app.post('/adminLogin', (req, res) => {
    user.find({user: req.body.user, pass: req.body.pass}, (err, data) => {
      if(data.length !== 0){
        save_sess(req, data);
        res.redirect('/loggedIn');
      }else{
        res.send('Invalid Username/Password <a href="/">Go Back</a>');
      }
    });
});

app.post('/engLogin', (req, res) => {
    user.find({user: req.body.enuser, pass: req.body.enpass}, (err, data) => {
      if(data.length !== 0){
        save_sess(req, data);
        res.redirect('/loggedIn');
      }else{
        res.send('Invalid Username/Password <a href="/">Go Back</a>');
      }
    });
});

const server = app.listen(port, () => console.log(`Server started at http://localhost:${port}`));

// https.createServer(opts, app).listen(443);