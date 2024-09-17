const mongoose = require("mongoose")

mongoose
.connect("mongodb://localhost:27017/scatch")
.then(function(){
    console.log('database connected !');
})
.catch(function(err){
    console.log('connection error', err);
})


// module.exports = mongoose.connection;
