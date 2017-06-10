let iframeYoutube = '<div id="quickview"></div>';
let regExHref = /\/watch\?v=.{11}$/;
let qsOptions = '?autoplay=true&showinfo=0';
let sizeDefaultVideo = {'width': 854, 'height': 480};
let sizeMiniVideo = {'width': 250, 'height': 141};

!function enableDarkmode() {
    let cookie = document.cookie;
    let check = cookie.indexOf('VISITOR_INFO1_LIVE=fPQ4jCL6EiE');
    if (check === -1) {
        document.cookie = 'VISITOR_INFO1_LIVE=fPQ4jCL6EiE';
        location.reload();
    }
}();
function resetDefault() {
    reSize(sizeDefaultVideo.width, sizeDefaultVideo.height);
    $('.zoom').attr('zoom', 'out');
}
function showVideo(src) {
    if (document.getElementById('myIframe').src !== src) {
        document.getElementById('myIframe').src = src;
        let visibility = 'hidden';
        if (src) {
            visibility = 'visible';
            resetDefault();
        }
        $('#quickview').css('visibility', visibility);
    }
}
function reSize(width, height, ) {
    if (width * sizeDefaultVideo.height >= height * sizeDefaultVideo.width) {
        width = Math.floor(height * sizeDefaultVideo.width /sizeDefaultVideo.height);
    } else {
        height = Math.floor(width * sizeDefaultVideo.height /sizeDefaultVideo.width);
    }
    $('#myIframe').attr('width', width).attr('height', height);
}
function setEventClick() {
    $('.close-video').click(() => {
        showVideo('');
    });
    $('.zoom').click(() => {
        switch ($('.zoom').attr('zoom')){
            case 'in':
                resetDefault();
                console.log('a');
                break;
            case 'out':
                reSize(sizeMiniVideo.width, sizeMiniVideo.height);
                console.log('b');
                $('.zoom').attr('zoom', 'in');
                $('.ytp-play-button.ytp-button', $('#myIframe')).click();
                break;
            default:
                console.log('Error');
        }
    });

    let deltaX, deltaY;
    let dragging = false;
    $('.reSize').mousedown((event) =>{
        dragging = true;
        deltaX = event.clientX - $('#quickview')[0].offsetLeft;
        deltaY = event.clientY - $('#quickview')[0].offsetTop;
        return false;
    });
    document.onmousemove = function(event){
        event = event || window.event;
        if(dragging){
            let newWidth = $(window).width() - event.clientX + deltaX;
            let newHeight = $(window).height() - event.clientY + deltaY;
            reSize(newWidth, newHeight, true);
            return false;
        }
    };
    $(document).mouseup(function(event){
        dragging = false;
        event.cancelBubble = true;
    });

}
$(document).ready(() => {
    $(document.body).append(iframeYoutube);
    $.ajax({
        url: chrome.extension.getURL('frame.html'),
        type: 'GET',
        success: function(data) {
            $('#quickview').html(data);
            setEventClick();
        },
    });
    $(document).bind('contextmenu', function(event) {
        let target = event.target;
        let href = target.href || $(target).parent('h3').parent('a').attr('href');
        if ($(target).is('h3 #video-title') || $(target).is('a.yt-simple-endpoint.style-scope.yt-formatted-string')) {
            if (regExHref.test(href)) {
                let idVideo = href.substr(-11);
                let src = 'https://www.youtube.com/embed/' + idVideo;
                showVideo(src + qsOptions);
                return false;
            }
        }

    });
});