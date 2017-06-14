let link = $('.btn-see').attr('href');
let frame = '.fab-frame';

if (link !== undefined) {
    window.location.href = link;
}
$('#balloon_left_2').remove();
let board = $('.episodes').length;
if (board === 1) {
    addFAB();
    $('div.list-episode a').addClass('btn btn-primary');
}

!function onLoad() {
    $('li.menu-item ul').addClass('btn btn-default');
    $('.list-episode>a').each(function() {
        let string = $(this).html().split('-');
        let ch = string.length;
        if (ch === 3 || string.length > 10) {
            $(this).addClass('three-col');
        } else if (ch === 2) {
            $(this).addClass('two-col');
        }
    });
    $('.float-ads').remove();
    $('#balloon_left_1').remove();

    //change icon -> glyphicon
    $('i.fa.fa-home').addClass('glyphicon glyphicon-home');
    $('i.fa.fa-align-center').addClass('glyphicon glyphicon-tasks');
    $('i.fa.fa-globe').addClass('glyphicon glyphicon-globe');
    $('i.fa.fa-camera-retro').addClass('glyphicon glyphicon-camera');
    $('i.fa.fa-film').addClass('glyphicon glyphicon-film');
    $('i.fa.fa-lightbulb-o').addClass('glyphicon glyphicon-fire');
    $('i.fa.fa-comment').addClass('glyphicon glyphicon-comment');
    $('i.fa.fa-video-camera').addClass('glyphicon glyphicon-facetime-video');
}();
function addFAB() {
    addButton();
    addEventMove();
    $(window).resize(() => {
        if (getMargin(frame, 'right') + $().width() > $(window).width()) {
            let marginRight = $(window).width() - $(frame).width();
            if (marginRight > 0) {
                $(frame).css({
                    'right': marginRight + 'px',
                });
            }
        }
        if (getMargin(frame, 'bottom') + $(frame).height() > $(window).height()) {
            let marginBottom = $(window).height() - $(frame).height();
            if (marginBottom > 0) {
                $(frame).css({
                    'bottom': marginBottom + 'px',
                });
            }
        }
    });
}

function rotation(total, size, margin) {
    if (margin <= 0) {
        margin = 0;
    }
    let result = total - margin - size;
    if (result < 0) {
        return 0;
    }
    return result;
}

function getMargin(element, name) {
    let value = $(element).css(name);
    return parseInt(value);
}

function addButton() {
    $(document.body).append('<div class="fab-frame"></div>');
    $(frame).css({
        'right': '20px',
        'bottom': '20px',
    });
    let cc = $('.current')[0];
    let prev = $($(cc).prev())[0];
    let next = $($(cc).next())[0];
    if (prev) {
        $(frame).append('<button id="btn-prev" class="fab-button fab">⬸</button>');
    }
    if (next) {
        $(frame).append('<button id="btn-next" class="fab-button fab">⤑</button>');
    }
    $('#btn-next').click(() => {
        next.click();
    });
    $('#btn-prev').click(() => {
        prev.click();
    });
}

function addEventMove() {
    let dragging = false;
    let deltaX, deltaY;
    $(frame).mousedown(function(event) {
        dragging = true;
        deltaX = event.clientX - this.offsetLeft;
        deltaY = event.clientY - this.offsetTop;
        return false;
    });
    document.onmousemove = event => {
        event = event || window.event;
        if (dragging) {
            let marginLeft = event.clientX - deltaX;
            let marginRight = rotation($(window).width(), $(frame).width(), marginLeft);
            let marginTop = event.clientY - deltaY;
            let marginBottom = rotation($(window).height(), $(frame).height(), marginTop);
            $(frame).css({
                'right': marginRight + 'px',
                'bottom': marginBottom + 'px',
            });
            return false;
        }
    };
    $(document).mouseup(function(event) {
        dragging = false;
        event.cancelBubble = true;
    });
}