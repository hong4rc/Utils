'use strict';

const HALF_DAY = 12;
const TEN = 10;
const MIL_SECS = 1e3;


let Ticking = (ticVal) => {
    if (ticVal < TEN) {
        ticVal = '0' + ticVal;
    }
    return ticVal;
};

let digitized = () => {
    let dt = new Date();
    let hrs = dt.getHours();
    let min = dt.getMinutes();
    let sec = dt.getSeconds();

    min = Ticking(min);
    sec = Ticking(sec);

    document.getElementById('dc').innerHTML = hrs + ':' + min;
    document.getElementById('dc_second').innerHTML = sec;

    if (hrs > HALF_DAY) {
        document.getElementById('dc_hour').innerHTML = 'PM';
    }
    else {
        document.getElementById('dc_hour').innerHTML = 'AM';
    }

};

setInterval(() => digitized(), MIL_SECS);