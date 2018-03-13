let frameYoutube = '<div id="quickView"></div>';
let regExHref = /\/watch\?v=.{11}$/;
let qsOptions = '?autoplay=true&showinfo=0';
let sizeDefaultVideo = {
    'width': 854,
    'height': 480
};
let sizeMiniVideo = {
    'width': 250,
    'height': 141
};
let zoom = '.zoom';
let height_container = $('#container').height();
let myFrame = 'myFrame', jMyFrame = '#' + myFrame;

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
        let width = $(jMyFrame).attr('width');
        let height = $(jMyFrame).attr('height');
        width = min(width, $(window).width());
        height = min(height, $(window).height() - height_container);
        reSize(width, height);
    };

    if (document.getElementById(myFrame).src !== src) {
        document.getElementById(myFrame).src = src;
        let visibility = 'hidden';
        $(window).off('resize.youtube_video');
        if (src) {
            visibility = 'visible';
            $(window).on('resize.youtube_video', checkSizeFrame);
            resetDefault();
        }
        $('#quickView').css('visibility', visibility);
    }
}

function reSize(width, height) {
    if (width * sizeDefaultVideo.height >= height * sizeDefaultVideo.width) {
        width = Math.floor(height * sizeDefaultVideo.width / sizeDefaultVideo.height);
    } else {
        height = Math.floor(width * sizeDefaultVideo.height / sizeDefaultVideo.width);
    }
    $(jMyFrame).attr('width', width).attr('height', height);
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
    let quickView;
    $('.reSize').mousedown((event) => {
        dragging = true;
        quickView = $('#quickView')[0];
        deltaX = event.clientX - quickView.offsetLeft;
        deltaY = event.clientY - quickView.offsetTop;
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
        let frameWidth = $(jMyFrame).attr('width');
        if (frameWidth < sizeMiniVideo.width) {
            zoomOut();
        }
        if (frameWidth > sizeDefaultVideo.width) {
            $(zoom).attr('zoom', 'out');
        }
    });

}

$(document).ready(() => {
    $(document.body).append(frameYoutube);
    $.ajax({
        url: chrome.extension.getURL('frame.html'),
        type: 'GET',
        success: data => {
            $('#quickView').html(data);
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