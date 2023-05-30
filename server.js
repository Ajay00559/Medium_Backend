

require("dotenv").config({ path: "./.env" });
const express = require("express");
const session = require("express-session");
var cors = require('cors')
const cookieParser=require('cookie-parser')
const app = express();
const PORT = process.env.PORT;

// databaseconnection
require("./models/db").databaseconnection();

const indexRouter = require("./routes/indexRoute");
 

 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: "jk43t9",
    })
);

app.use(require("cors")({origin: true, credentials: true, optionSuccessStatus : 200 }));

app.use("/", indexRouter);

app.listen(PORT, () => console.log(`server running on port: ${PORT}`));