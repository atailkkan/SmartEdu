const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');
const pageRoute = require('./routes/pageRoute');
const courseRoute = require('./routes/courseRoute');
const categoryRoute = require('./routes/categoryRoute');
const userRoute = require('./routes/userRoute');

const app = express();

// Connect Database
const dbUrl = "mongodb://localhost/smartedu_db";
mongoose.connect(dbUrl)
    .then(() => {
        console.log('Veritabanı bağlantısı sağlandı.');
    });

// Template Engine
app.set('view engine', 'ejs');

// Global variable
global.userIN = null;

// Middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: dbUrl })
}));
app.use('*', (req, res, next) => {
    userIN = req.session.userID;
    next();
});
app.use(flash());
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
});
app.use(methodOverride('_method', {
    methods: ['POST', 'GET']
}));

// Routes
app.use('/', pageRoute);
app.use('/courses', courseRoute);
app.use('/categories', categoryRoute);
app.use('/users', userRoute);

const port = 3000;
app.listen(port, () => {
    console.log(`Sunucu ${port} portunda başlatıldı.`);
});