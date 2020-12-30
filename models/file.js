var _ = require('lodash');
var mongoose = require('mongoose');

var FileSchema = mongoose.Schema({
    filename: String,
    originalname: String,
    path: String,
    mimetype: String,
    size: String,
    fileDate: {
        type: Date,
        default: Date.now
    },
    type: String,
    creator: {
        type: String,
        ref: 'User',
        default: ''
    },
    createdTime: {
        type: Date,
        default: Date.now
    },
    level: {
        type: Number,
        default: 1
    },
}, {
    toJSON: {
        virtuals: true
    },
    
});

FileSchema.virtual('url').get(function() {
    return '/upload/' + this.filename;
});

// Simditor Support
//
FileSchema.virtual('success').get(function() {
    return true;
});
FileSchema.virtual('file_path').get(function() {
    return '/upload/' + this.filename;
});

module.exports = mongoose.model('File', FileSchema);
