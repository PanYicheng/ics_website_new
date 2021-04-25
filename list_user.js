const mongoose = require("mongoose");
const User = require('./models/user.js');
const config = require('./config.json');

mongoose.set('bufferCommands', false);
mongoose.set('useCreateIndex', true)
mongoose.connection.on('connecting', () => { console.log('mongoose connecting!') } )
mongoose.connection.on('open', function(){console.log('mongoose connected!')})
mongoose.connection.on('error', err => {
  console.log(err);
});

mongoose.connect(config.mongodb, { useNewUrlParser: true, useUnifiedTopology: true }).then(
    () => {
        var q = User.find({}, function(err, users) {
            if(err) {
                console.log(err);
                return;
            }
            for(const user of users){
                console.log(user.name, user._id);
            }
            
        })
    },
    err => {console.log(err);}
)

