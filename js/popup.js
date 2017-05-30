var frame1 = '<div class="input-group form-group"><input type="text" class="form-control" value="';
var frame2 = '"><span class="remove input-group-addon btn btn-danger"><i class="glyphicon glyphicon-remove"></i></span></div>';

getBlockRequest();
setClick();
addShortcut();

function addShortcut() {
    $(document).keydown(function(evt){
        if (evt.keyCode==83 && (evt.ctrlKey)){
            evt.preventDefault();
            save();
        }
    });
}
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
    $(".import input[type=file]").change(function(){
        var reader = new FileReader();
        reader.onload = function (event) {
            result = event.target.result;
            var newList = result.split(",");
            setOption('blockRequest', newList);
            getBlockRequest();
        };
        var cc = $(this).get(0).files[0];
        reader.readAsText(cc);
    });
}
function save() {
    var blockRequest = [];
    $('.list input').each(function (index) {
        var urlBlock = $(this).val().replace(/^\s+|\s+$/gm,'').split(",");
        console.log(":" + urlBlock);
        if(urlBlock){
            blockRequest = blockRequest.concat(urlBlock);
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
    updateStatus('#isEnable', data.isEnable);
    updateStatus('#seenChat', data.seenChat);
    updateStatus('#typingChat', data.typingChat);
    updateStatus('#typingPost', data.typingPost);
    updateStatus('#stopTimeline', data.stopTimeline);
    updateStatus('#stopGroup', data.stopGroup);
}
function getBlockRequest() {
    $('.list').empty();
    chrome.storage.sync.get({'blockRequest': [], 'isEnable': 1, 'seenChat': 1, 'typingChat': 1, 'typingPost': 0, 'stopTimeline': 0, 'stopGroup': 0}, function(data) {
        init(data);
        if (data.blockRequest.length > 0){
            data.blockRequest.forEach(function(element) {
                add(element);
                console.info(element);
            });
        } else {
            add('');
        }
        $('.export').attr("href", "data:text/plain;base64," + btoa(data.blockRequest.toString()));
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