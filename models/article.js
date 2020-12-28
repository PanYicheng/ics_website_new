var _ = require('lodash');
var loremIpsum = require('lorem-ipsum');
var mongoose = require('mongoose');
var BPromise = require('bluebird');
var debug = require('debug')('ics:models:article');

var ArticleSchema = mongoose.Schema({
    title: String,
    content: String,
    type: String,   // notice, news
    createdTime: {
        type: Date,
        default: Date.now
    },
    creator: {
        type: String,
        ref: 'User'
    }
});

//Register static method for generating random articles
ArticleSchema.statics.random = function(n) {
	// generate n random article
    return n ? _.times(n, random) : random();
};

// Generate random artile object
function random() {
    return {
        id: '14321',
        title: loremIpsum({
            count: 7,
            units: 'words'
        }),
        content: loremIpsum({
            count: 10
        }),
        date: new Date()
    };
}

module.exports = mongoose.model('Article', ArticleSchema);
