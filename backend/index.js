const express = require("express");
const routes = require("./routes/routes");
const session = require('express-session');

const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 4000;

const cors = require("cors");
app.use(cors());

// Use express-session for session management
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.json());
require("./config/db").connect();

app.use("/v1", routes);

app.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
});