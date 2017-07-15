let iframeYoutube = '<div id="quickview"></div>';
let regExHref = /\/watch\?v=.{11}$/;
let qsOptions = '?autoplay=true&showinfo=0';
let sizeDefaultVideo = {'width': 854, 'height': 480};
let sizeMiniVideo = {'width': 250, 'height': 141};
let zoom = '.zoom';
let height_container = $('#container').height();

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
    $(zoom).attr('zoom', 'out');
}
function showVideo(src) {
    function min(element, window) {
        if (element < window) {
            return element;
        }
        return window;
    }

    let checkSizeFrame = function () {
        let element = '#myIframe';
        let width = $(element).attr('width');
        let height = $(element).attr('height');
        width = min(width, $(window).width());
        height = min(height, $(window).height() - height_container);
        reSize(width, height);
    };

    if (document.getElementById('myIframe').src !== src) {
        document.getElementById('myIframe').src = src;
        let visibility = 'hidden';
        $(window).off('resize.youtube_video');
        if (src) {
            visibility = 'visible';
            $(window).on('resize.youtube_video', checkSizeFrame);
            resetDefault();
        } else {

        }
        $('#quickview').css('visibility', visibility);
    }
}
function reSize(width, height) {
    if (width * sizeDefaultVideo.height >= height * sizeDefaultVideo.width) {
        width = Math.floor(height * sizeDefaultVideo.width / sizeDefaultVideo.height);
    } else {
        height = Math.floor(width * sizeDefaultVideo.height / sizeDefaultVideo.width);
    }
    $('#myIframe').attr('width', width).attr('height', height);
}
function zoomOut() {
    reSize(sizeMiniVideo.width, sizeMiniVideo.height);
    $(zoom).attr('zoom', 'in');
}
function setEventClick() {
    $('.close-video').click(() => {
        showVideo('');
    });
    $(zoom).click(() => {
        switch ($(zoom).attr('zoom')) {
            case 'in':
                resetDefault();
                break;
            case 'out':
                zoomOut();
                break;
            default:
                console.log('Error');
        }
    });

    let deltaX, deltaY;
    let dragging = false;
    let quickview;
    $('.reSize').mousedown((event) => {
        dragging = true;
        quickview = $('#quickview')[0];
        deltaX = event.clientX - quickview.offsetLeft;
        deltaY = event.clientY - quickview.offsetTop;
        return false;
    });
    document.onmousemove = event => {
        event = event || window.event;
        if (dragging) {
            let newWidth = $(window).width() - event.clientX + deltaX;
            let newHeight = $(window).height() - event.clientY + deltaY;
            reSize(newWidth, newHeight);
            return false;
        }
    };
    $(document).mouseup(event => {
        dragging = false;
        event.cancelBubble = true;
        let iframeWidth = $('#myIframe').attr('width');
        if (iframeWidth < sizeMiniVideo.width) {
            zoomOut();
        }
        if (iframeWidth > sizeDefaultVideo.width) {
            $(zoom).attr('zoom', 'out');
        }
    });

}
$(document).ready(() => {
    $(document.body).append(iframeYoutube);
    $.ajax({
        url: chrome.extension.getURL('frame.html'),
        type: 'GET',
        success: data => {
            $('#quickview').html(data);
            setEventClick();
        },
    });
    $(document).bind('contextmenu', event => {
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