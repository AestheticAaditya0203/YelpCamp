if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
//const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

//const MongoDBStore = require("connect-mongo");

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';


mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error:'));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

/* const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = new MongoDBStore(session({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
}));

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
}) */

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    //console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)


app.get('/', (req, res) => {
    res.render('home');
})


/* app.post('/campgrounds', catchAsync(async (req, res) => {
    const camping = new Campground(req.body.campground);
    await camping.save();
    res.redirect(`/campgrounds/${camping._id}`);
})) */




/* app.get('/makecampground',async(req, res) => {
    const camp = new Campground({title: "My Backyard", description: "cheap camping!"});
    await camp.save();
    res.send(camp)
}) */



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found 404', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Yay!! Server 3000 is listening to me");
})






/* ObjectId("629986dc814906318e6f8bf4")
"email" : "addy@g.c",
        "username" : "addy",
        "salt" : "e4da5bf7c4d6fdc8e06387dac77c65dec0ed234bbe39f071770c67320c8fcbed",
        "hash" : "41ba07fcff1b549b596b5b0dd77498c7d29c578c347f4edbe4d949a0c2538d38722c2cc7b6caf9b195558ba301b6cdf5a6c8b38c2d3254b79f51c5d8330783b9049c9ab5e6bf448888495434715f3888e43d6916b898d1d510592261937a219955dc75a30accf9d22a5b7e2aaff9a387fd8f17ee87c6a9cfede84c8443b238cca2e11572d2198849e7b76d5eea13c01dda9cd3e672eba90d677dd8f1177dbf08c2dd7650b751fe3c0988048eff7caf2bb7365eff79b15e3a0c52d5a34439a5dcbe94409de92934a72f4e85b43fd1a3475fe6dad1881fd673d45a50f5edd7eb161f21dbdf93d9d1a09e3d4c28888f2eb0f22fb4fdde560ea1d50d10796cd86cc6fddd6186fc7858fa82f23eab18e47b7cb37424333c459a98fef0a05104b5bc5aafb75a484c1e261ebdde50bf9a8b3d2757da327e17561017430c2aaa87b88f9daff9b973a9ec052677468960decd95b54ade2ecd869ed0028d774a2019a9c6690177172ba545107ee8e0dbf7d9427a89837cdb83a58f800067bdd8dd321d7fa27f9be8917576bb89f2349a66deda8c4562d163d13e6b278efb521f04e82e6b4ce257d836f670c3fe49ca41bf918657c06d5979d67f897371cc18870ff3c9ef0141038d5196e19352daa036eb54331526e75051152c995c843901aa79a6db5e6c048ffbbc6e18237d68d6bcf6b96cb28fac53a637a62e7326010fc31af301af62",

*/





