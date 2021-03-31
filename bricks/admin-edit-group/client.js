var $btnDelete = $(module.elements).find('.btn-delete');
var $btnUpload = $(module.elements).find('.btn-upload');

$btnDelete.click(function() {
    if (window.confirm('确认删除该成员吗？')) {
        var id = $(this).data('id');
        var dn = $(this).data('dn');

        $
            .ajax({
                type: 'DELETE',
                url: '/api/groups/' + id + '/' + dn
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

    var formdata=new FormData($("#frmUploadFile")[0]);
    //formdata.append('file',$('#infile').files[0]);
    $
        .ajax({

            type: 'POST',
            data:formdata,
            url: '/api/upload/',
            async: false,
            cache: false,
            contentType:false,
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

