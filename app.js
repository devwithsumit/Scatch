const express = require("express")
const app = express()
const flash = require("connect-flash")
const expressSession = require("express-session")

const db = require("./config/mongoose_connection")

const cookieParser = require("cookie-parser")
const path = require("path")
const usersRouter = require("./routes/usersRouter")
const productsRouter = require("./routes/productsRouter")
const ownersRouter = require("./routes/ownersRouter")
const index  = require("./routes/index")

require("dotenv").config()

app.set("view engine", "ejs")
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))
app.use(
    expressSession({
        resave : false,
        saveUninitialized : false,
        secret: process.env.EXPRESS_SESSION_SECRET,
    })
)
app.use(flash());

app.use("/", index);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/owner", ownersRouter);


app.get("/", async function (req, res) {
    res.send('hey');
})

app.listen(3000);