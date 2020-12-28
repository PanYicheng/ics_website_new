const router = require('express').Router();
const File = require('../models/file.js');
const multer = require('multer');
const path = require('path');

const debug = require('debug')('ics:upload');

var storage = multer.diskStorage({
    destination: (req, file, cb) =>
        cb(null, path.resolve(__dirname, '../public/upload')),
    filename: function(req, file, cb) {
        var ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});
var upload = multer({
    storage: storage
});

router.post('/add_file', upload.single('file'), function(req, res, next) {//single写文件,是一个函数
    var file = req.file;
    file.creator = req.query.userid;
    file.fileDate = new Date(req.body.fileDate||new Date())
    file.type = req.query.type
    console.error(req)
    console.log('file',file)
    if (!file) return res.status(400).end();

    File
        .createAsync(file)
        .then(f => res.status(201).json(f))
        .catch(next);
});

router.delete('/:id', function(req, res, next) {
    //debug(req.param('id'));
    File
        .findByIdAndRemove(req.params.id)
        .execAsync()
        .then(x => res.json(x))
        .catch(next);
});
router.use(function (err, req, res, next) {
    console.log('err------------',err)
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.send({ result: 'fail', error: { code: 1001, message: 'File is too big' } })
      return 
    }
  
    // Handle any other errors
  })

module.exports = router;
