const express = require("express")
const app = express()

const cookieParser = require("cookie-parser")
const path = require("path")

const User = require("./models/user")

app.set("view engine", "ejs")
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended : true}))
app.use(express.static(path.join(__dirname, "public")))

app.get("/",async function(req, res){
    res.send('hey');
})

app.listen(3000);