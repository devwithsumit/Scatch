const express = require("express")
const app = express()

const db = require("./config/mongoose_connection")

const cookieParser = require("cookie-parser")
const path = require("path")
const usersRouter = require("./routes/usersRouter")
const productsRouter = require("./routes/productsRouter")
const ownersRouter = require("./routes/ownersRouter")

require("dotenv").config()

app.set("view engine", "ejs")
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))

app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/owner", ownersRouter);


app.get("/", async function (req, res) {
    res.send('hey');
})

app.listen(3000);