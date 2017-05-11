var frame1 = '<div class="input-group form-group"><input type="text" class="form-control" value="';
var frame2 = '"><span class="remove input-group-addon btn btn-danger"><i class="glyphicon glyphicon-remove"></i></span></div>';

getBlockRequest();
setClick();

function anim(now) {
    if (now == '0') {
        $('.checkbox .glyphicon').addClass('glyphicon-unchecked').removeClass('glyphicon-check')
            .parent().addClass('btn-info').removeClass('btn-success');
    } else {
        $('.checkbox .glyphicon').addClass('glyphicon-check').removeClass('glyphicon-unchecked')
            .parent().removeClass('btn-info').addClass('btn-success');;
    }
}
function getId(param) {
    return $(param).attr('id');
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
    $('.checkbox').click(function () {
        var now = $(this).attr('aria-valuenow');
        if (now + '' === '0'){
            now = 1;
        } else {
            now = 0;
        }
        updateStatus(this, now);
        var id = getId(this);
        setOption(id, now);
    });
    // $('#option .checkbox').click(function () {
    //
    // })
    $('.import').click(function () {
        //var arr = getBlockRequest();
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
    getBlockRequest();
}
function updateStatus(element, now) {
    $(element).attr('aria-valuenow', now +0);
    if (now == 0) {
        $(element).children('.glyphicon').addClass('glyphicon-unchecked').removeClass('glyphicon-check');
        $(element).addClass('btn-info').removeClass('btn-success');
    } else {
        $(element).children('.glyphicon').addClass('glyphicon-check').removeClass('glyphicon-unchecked')
        $(element).removeClass('btn-info').addClass('btn-success');
    }
}
function init(data) {
    var now = (data.isEnable == 0) ? 0 : 1;         //default: 1
    updateStatus('#isEnable', now);
    now = (data.seenChat == 0) ? 0 : 1;             //default: 1
    updateStatus('#seenChat', now);
    now = (data.typingChat == 0) ? 0 : 1;           //default: 1
    updateStatus('#typingChat', now);
    now = (data.typingPost == 1) ? 1 : 0;           //default: 0
    updateStatus('#typingPost', now);
    now = (data.stopTimeline == 0) ? 0 : 1;             //default: 1
    updateStatus('#stopTimeline', now);
}
function getBlockRequest() {
    $('.list').empty();
    chrome.storage.sync.get(['blockRequest', 'isEnable', 'seenChat', 'typingChat', 'typingPost', 'stopTimeline'], function(data) {
        //var now = 1 - !data.isEnable;                 //default: 1
        init(data);
        if (data.blockRequest && data.blockRequest.length > 0){
            data.blockRequest.forEach(function(element) {
                add(element);
                console.info(element);
            });
            return data.blockRequest;
        } else {
            add('');
            return [];
        }
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
function setOption(id, now) {
    console.info('id  = ' + id + ';  now = ' + now);
    var tmp = {};
    tmp[id] = now;
    id && chrome.storage.sync.set(tmp);
}


//:TODO set , get option
function getOption(option, value) {
    chrome.storage.sync.get(option, function(data) {
        data.option = data.option || [];
        if (data.option.hasOwnProperty(index)){
            return data.option[index];
        }
        return value;
    });
}