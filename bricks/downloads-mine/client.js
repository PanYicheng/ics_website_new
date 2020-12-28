var $btnDelete = $(module.elements).find('.btn-delete');
var $btnUpload = $(module.elements).find('.btn-upload');



//var debug = require('debug')('ics:admin-files');

$('input[id=infile]').change(function() {
    $('#fileCover').val($(this).val());
});



$btnDelete.click(function() {
    if (window.confirm('确认删除该文件吗？')) {
        var id = $(this).data('id');

        $
            .ajax({

                type: 'DELETE',
                url: '/api/upload/' + id
            })
            .done(function() {
                location.reload();
            })
            .fail(function(e) {
                console.error(e);
                alert('删除失败' + e.message);
            });
    }
});

$btnUpload.click(function() {
    
            var formdata = new FormData($("#frmUploadFile")[0]);
           // var file_type = $("select option:selected").attr("value")
            var file_type = $("select").find("option:selected").attr("value")
            var userid = $("#userid").attr("class")
            console.log('frmUploadFile', $("#frmUploadFile"))
            console.log('frmUploadFile[0]', $("#frmUploadFile[0]"))
                // formdata.append('test','testInfo')
            console.log('formdata', formdata)
                //formdata.append('file',$('#infile').files[0]);
            $
                .ajax({
    
                    type: 'POST',
                    data: formdata,
                    url: '/api/upload/add_file?type=' + file_type + '&userid=' + userid,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false
                })
    
            .done(function() {
                    alert('保存成功！');
                    location.reload();
                    $('#fileCover').val('');
                })
                .fail(function(e) {
                    console.error(e);
                    alert('上传失败' + e.message);
                });
        });



/*
 exports.post = function(req, done, fail, res) {
 var file = new File(req.body);
 file.creator = req.user.id;

 file.save()
 .then(x => res.redirect('/admin/files'))
 .catch(fail);
 };*/

