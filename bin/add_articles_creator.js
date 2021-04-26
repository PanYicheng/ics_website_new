const mongoose=require("mongoose");
const Article=require('./models/article.js')
const User = require("./models/user.js")

mongoose.set('bufferCommands', false);
mongoose.set('useCreateIndex', true)
mongoose.connection.on('connecting', () => { console.log('mongoose connecting!') } )
mongoose.connection.on('open', function(){console.log('mongoose connected!')})
mongoose.connection.on('error', err => {
  console.log(err);
});

mongoose.connect("mongodb://localhost/ics", { useNewUrlParser: true, useUnifiedTopology: true }).then(
    () => {
        var icsUser
        User.findOne({name: "王萍"}, function (err, user) {
            if(err) {
                console.log("Error:", err);
            }
            icsUser = user;
            console.log(icsUser, icsUser._id);
            var q = Article.find({}, function(err, docs) {
                if(err) {
                    console.log(err);
                    return;
                }
                // console.log(docs)
                for (let doc of docs) {
                    // console.log(doc);
                    // console.log(doc.title, doc.createdTime, doc.type, doc.creator);
                    // break;
                    doc.creator = icsUser._id;
                    console.log(doc.title);
                }
            })
        });
    },
    err => {console.log(err);}
)

