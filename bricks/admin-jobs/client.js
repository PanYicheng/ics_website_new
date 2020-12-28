var $btnDelete = $(module.elements).find('.btn-delete');



$btnDelete.click(function() {

    if (window.confirm('确认删除该岗位吗？')) {
        var id = $(this).data('id');
        //var debug = require('debug')('ics:news-list');
        //debug(id);
        $
            .ajax({
                type: 'DELETE',
                url: '/api/job/' + id

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
