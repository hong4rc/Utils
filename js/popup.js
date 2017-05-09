var frame1 = '<div class="input-group form-group"><input type="text" class="form-control" value="';
var frame2 = '"><span class="remove input-group-addon btn btn-danger"><i class="glyphicon glyphicon-remove"></i></span></div>';

getBlockRequest();
setClick();

function anim(now) {
    if (now == '0') {
        $('.enable .glyphicon').addClass('glyphicon-unchecked').removeClass('glyphicon-check');
    } else {
        $('.enable .glyphicon').addClass('glyphicon-check').removeClass('glyphicon-unchecked');
    }
}
function setClick() {
    $('.save').click(function () {
        save();
    });
    $('.add').click(function () {
        console.warn('add : ');
        add('');
    });
    $('.remove').click(function () {
        console.warn('remove : ');
        remove(this);
    });
    $('.remove-all').click(function () {
        $('.list').empty();
        save();
    });
    $('.enable').click(function () {
        var now = $(this).attr('aria-valuenow');
        if(now == '0'){
            now = 1;
        } else{
            now = 0;
        }
        anim(now);
        $(this).attr('aria-valuenow', now);
        chrome.storage.sync.set({'isEnable': now});
    });
    $('.import').click(function () {
        var arr = getBlockRequest();
    })
}
function save() {
    var blockRequest = [];
    $('.list input').each(function (index) {
        var urlBlock = $(this).val().replace(/^\s+|\s+$/gm,'');
        if(urlBlock){
            blockRequest.push(urlBlock);
        }
    });
    chrome.storage.sync.set({'blockRequest': blockRequest}, function() {
        // Notify that we saved.
        console.info('Settings saved');
    });

    $('.list').empty();
    getBlockRequest();
}
function getBlockRequest() {
    chrome.storage.sync.get(['blockRequest', 'isEnable'], function(data) {
        var now = data.isEnable;
        anim(now)
        $('.enable').attr('aria-valuenow', now);
        data.blockRequest.forEach(function(element) {
            add(element);
            console.info(element);
        });
        return data.blockRequest;
    });
}
function add(element) {
    if (element === ''){
        element = frame1 + '*://*.' + frame2;
        $('div.list').prepend($(element));
    } else {
        element = element.replace(/^\s+|\s+$/gm,'');
        element = frame1 + element + frame2;
        $('div.list').append($(element));
    }
    $('.remove').click(function () {
        remove(this);
    });
}
function remove(element) {
    console.warn('remove : ' + element);
    $(element).parent().remove();
}