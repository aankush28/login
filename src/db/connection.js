const mongoose = require('mongoose');
const DB = process.env.PRIVATE_KEY;

 mongoose.connect(DB, {useNewUrlParser:true,useUnifiedTopology: true })
.then(console.log('connection succsess fully'))
.catch((err)=>console.log(err));