// Modules
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const admin = require('./routes/admin');
const user = require('./routes/user');
const path = require('path');
const mongoose = require('mongoose');
const db = require('./config/db');
const session = require('express-session');
const flash = require('connect-flash');
//const Post = require('./models/Post');
//const Category = require('./models/Category');
const passport = require('passport');
require('./config/auth')(passport);

// Configurations
    // Session
        app.use(session({
            secret: 'Librum1995@#',
            resave: true,
            saveUninitialized: true    
        }));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(flash());
    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg');
            res.locals.error_msg = req.flash('error_msg');
            res.locals.error_list = req.flash('error_list');
            res.locals.error = req.flash('error');
            res.locals.user = req.user || null;
            res.locals.navAdmin = req.user && req.user.eAdmin === 1 ? true : null;
            next();
        });
    // Body-Parser
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
    // Handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');
    // Mongoose
        mongoose.connect(db.mongoURI, {dbName: 'cda-st'}).then(() => {
            console.log('MongoDB conectado!');
        }).catch((err) => {
            console.log('Erro ao conectar-se ao mongoDB', err);
        });
    // Public
        app.use(express.static(path.join(__dirname,'public')));

//Routes
    app.get('/', (req, res) => {
        res.render('index')
    });

    app.get('/404', (req, res) => {
        res.send('Error 404!')
    });

    app.use('/admin', admin)

    app.use('/users', user);

//Others
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log('Servidor rodando!');
    });
