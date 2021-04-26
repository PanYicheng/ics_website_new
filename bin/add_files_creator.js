const mongoose = require("mongoose");
const File = require('./models/file.js')
const User = require("./models/user.js")

mongoose.set('bufferCommands', false);
mongoose.set('useCreateIndex', true)
mongoose.connection.on('connecting', () => { console.log('mongoose connecting!') })
mongoose.connection.on('open', function () { console.log('mongoose connected!') })
mongoose.connection.on('error', err => {
    console.log(err);
});

mongoose.connect("mongodb://localhost/ics", { useNewUrlParser: true, useUnifiedTopology: true }).then(
    () => {
        var icsUser
        User.findOne({name: "王平"}, function (err, user) {
            if(err) {
                console.log("Error:", err);
            }
            icsUser = user;
            console.log(icsUser);
        });

        File.find().
            sort('-fileDate').
            // populate('creator').
            exec((err, files) => {
            if(err){
                console.log("Error", err);
            }
            for (const file of files) {
                //if(file.creator){
                 //   console.log("Creator: ", file.creator);
                //}
                //lse {
                    // console.log(file.originalname, file.mimetype, file.creator);
                console.log("Modifying userid for file: ", file.originalname);
                file.creator = icsUser._id;
               // }
                file.save();
                // file.fileDate = file.createdTime;
                // file.save();
            }
            // const file0 = files[0];
            // const fileLast=files[files.length-1];
            // console.log('First file:')
            // console.log(file0);
            // console.log('Last file:')
            // console.log(fileLast);
        }
        )
    },
    err => { console.log(err); }
)

