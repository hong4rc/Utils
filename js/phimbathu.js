onLoad();
var link = $(".btn-see").attr('href');
if(link !== undefined) {
    window.location.href = link;
}
$('#balloon_left_2').remove();
var board = $('.episodes').length;
if(board === 1) {
    addFAB();
    $('div.list-episode a').addClass('btn btn-primary')
}

function onLoad(argument) {
    $('li.menu-item ul').addClass('btn btn-default');
    $('.list-episode>a').each(function(index) {
        var  string = $(this).html();
        var ch = string.split("-").length;
        if (ch === 3 || string.length > 10) {
            $(this).addClass('three-col');
            //$(this).css('width', '131px');
        } else if (ch === 2) {
            $(this).addClass('two-col');
            //$(this).css('width', '86px');
        }
    });
    $('.float-ads').remove();
    $('#balloon_left_1').remove();
    //$('ul.container').addClass('nav nav-pills');

    //change icon -> glyphicon 
    $('i.fa.fa-home').addClass('glyphicon glyphicon-home');
    $('i.fa.fa-align-center').addClass('glyphicon glyphicon-tasks');
    $('i.fa.fa-globe').addClass('glyphicon glyphicon-globe');
    $('i.fa.fa-camera-retro').addClass('glyphicon glyphicon-camera');
    $('i.fa.fa-film').addClass('glyphicon glyphicon-film');
    $('i.fa.fa-lightbulb-o').addClass('glyphicon glyphicon-fire');
    $('i.fa.fa-comment').addClass('glyphicon glyphicon-comment');
    $('i.fa.fa-video-camera').addClass('glyphicon glyphicon-facetime-video');
}
function addFAB() {
    addButton();
    addEventMove();
    $(window).resize(function() {
        if(getMargin('.fab-frame', 'right') + $('.fab-frame').width() > $(window).width()) {
            var marginRight = $(window).width() - $('.fab-frame').width();
            if(marginRight > 0) {
                $(".fab-frame").css({
                    "right": marginRight + "px",
                });
            }
        }
        if(getMargin('.fab-frame', 'bottom') + $('.fab-frame').height() > $(window).height()) {
            var marginBottom = $(window).height() - $('.fab-frame').height();
            if(marginBottom > 0) {
                $(".fab-frame").css({
                    "bottom": marginBottom + "px",
                });
            }
        }
    });
}

function rotation(total, size, margin) {
    if(margin <= 0) {
        margin = 0;
    }
    var result = total - margin - size;
    if(result < 0) {
        return 0;
    }
    return result;
}

function getMargin(element, name) {
    var value = $(element).css(name);
    return parseInt(value);
}

function addButton() {
    $(document.body).append('<div class="fab-frame"></div>');
    $(".fab-frame").css({
        "right": "20px",
        "bottom": "20px"
    });
    var cc = $('.current')[0];
    var prev = $($(cc).prev())[0];
    var next = $($(cc).next())[0];
    if(prev) {
        $('.fab-frame').append('<button id="btn-prev" class="fab-button fab">⬸</button>');
    }
    if(next) {
        $('.fab-frame').append('<button id="btn-next" class="fab-button fab">⤑</button>');
    }
    $('#btn-next').click(function(event) {
        next.click();
    });
    $('#btn-prev').click(function(event) {
        next.click();
    });
}

function addEventMove() {
    var dragging = false;
    var deltaX, deltaY;
    $(".fab-frame").mousedown(function(event) {
        dragging = true;
        deltaX = event.clientX - this.offsetLeft;
        deltaY = event.clientY - this.offsetTop;
        return false;
    });
    document.onmousemove = function(event) {
        event = event || window.event;
        if(dragging) {
            var marginLeft = event.clientX - deltaX;
            var marginRight = rotation($(window).width(), $('.fab-frame').width(), marginLeft);
            var marginTop = event.clientY - deltaY;
            var marginBottom = rotation($(window).height(), $('.fab-frame').height(), marginTop);
            $(".fab-frame").css({
                "right": marginRight + "px",
                "bottom": marginBottom + "px"
            });
            return false;
        }
    };
    $(document).mouseup(function(event) {
        dragging = false;
        event.cancelBubble = true;
    });
}