const mongoose = require("mongoose")
const config = require("config")

const debug = require('debug')("development:mongoose");

mongoose
.connect(`${config.get("MONGODB_URI")}/scatch`)
.then(function(){
    debug('database connected !');
})
.catch(function(err){
    console.log('connection error', err);
})


module.exports = mongoose.connection;
