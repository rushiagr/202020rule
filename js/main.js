function createWatch() {
    window.watch = new Stopwatch(function(watch) { // Listener function
        document.getElementById('watchDisplay').innerHTML = watch.toString();
    } , 1000, false);
}


function populateDefaultValues(isPopup) {
    /* When normalPeriod is 1, the user can carry on his tasks on computer, but when it
     * is 0, we'll alert the user to not look at the screen and relax his/her eyes. */
    window.isNormalPeriod = 1;  // used as boolean
    window.normalPeriodLengthMilliSec = 1000*60*20;    // 20 minutes
    window.relaxPeriodLengthMilliSec = 1000*20;          // 20 seconds

    if(isPopup) {
        window.isPopup = true;
        poppedUpWindow = 'dummyValue';
    } else {
        window.isPopup = false;
    }
    //poppedUpWindow = 'dummyValue';
    //temporary values 
    //window.normalPeriodLengthMilliSec = 1000*10; window.relaxPeriodLengthMilliSec = 1000*2;

    window.soundFile1 = new Audio("sounds/bing.ogg");
    window.soundFile2 = new Audio("sounds/bong.ogg");
    
    window.watchTextValues = [
                "Time to give your eyes a break. Don't look at the screen!!", 
                "Keep working. We'll inform you of a break in:"
                ];
}


function readFromCookie() {
    var normalPeriodFromCookieMilliSec = readCookie("normalPeriodCookieMilliSec");
    var relaxPeriodFromCookieMilliSec = readCookie("relaxPeriodCookieMilliSec");

    if(normalPeriodFromCookieMilliSec) {
        window.normalPeriodLengthMilliSec = normalPeriodFromCookieMilliSec;
        document.getElementById('normalDurationMins').value = normalPeriodFromCookieMilliSec/1000/60;
    }

    if(relaxPeriodFromCookieMilliSec) {
        window.relaxPeriodLengthMilliSec = relaxPeriodFromCookieMilliSec;
        document.getElementById('relaxDurationSecs').value = relaxPeriodFromCookieMilliSec/1000;
    }
}


function startAfresh() {
    setDisplayForBool(window.isNormalPeriod);
    clearIntervalsAndTimeouts();
    resetWatch(window.normalPeriodLengthMilliSec);
    window.alreadySetInterval = setInterval('loop()', window.normalPeriodLengthMilliSec);
    if(window.isPopup) {
        if(poppedUpWindow !== 'dummyValue') {
            poppedUpWindow.close();
        }
    }
    //if (poppedUpWindow !== 'dummyValue') {poppedUpWindow.close();}
}


function modifyTimes() {
    var normalCookieStr = document.getElementById('normalDurationMins').value;
    var relaxCookieStr = document.getElementById('relaxDurationSecs').value;

    if(isNaN(Number(normalCookieStr)) || isNaN(Number(relaxCookieStr))) {
        alert("Please check the number you have entered.");
        return;
    }

    // Rounding off to fall at the edge of a second
    var normalMilli = Math.round(Number(normalCookieStr)*60*1000/1000)*1000;
    var relaxMilli = Math.round(Number(relaxCookieStr)*1000/1000)*1000;

    if(relaxMilli >= normalMilli) {
        alert("Duration of break can't be more than or equal to normal working period :)");
        return;
    }

    window.normalPeriodLengthMilliSec = normalMilli;
    window.relaxPeriodLengthMilliSec = relaxMilli;

    createCookie("normalPeriodCookieMilliSec", window.normalPeriodLengthMilliSec, 365*20);
    createCookie("relaxPeriodCookieMilliSec", window.relaxPeriodLengthMilliSec, 365*20);

    window.startAfresh();
}

function clearIntervalsAndTimeouts() {
    clearInterval(window.alreadySetInterval);
    clearTimeout(window.alreadySetTimeout);
}

function loop() {
    resetWatch(window.normalPeriodLengthMilliSec);
    executeBothTasksWithDelay();
}

function resetWatch(timeMilliSec) {
    window.watch.stop();
    window.watch.setElapsed(0, 0, timeMilliSec/1000);
    window.watch.start();
    document.getElementById('watchDisplay').innerHTML = window.watch.toString();
}

function executeBothTasksWithDelay() {
    if(window.isPopup) {
        poppedUpWindow = window.open('popupPage.html', '', config='height=300,width=300');
    } else {
        window.soundFile1.play();
    }
    resetWatch(window.relaxPeriodLengthMilliSec);
    setDisplayForBool(0);
    //poppedUpWindow = window.open('popupPage.html', '', config='height=300,width=300');
    window.alreadySetTimeout = setTimeout(function(){
        if(window.isPopup) {
            poppedUpWindow.close();
        } else {
            window.soundFile2.play();
        }
//        window.soundFile2.play();
        resetWatch(window.normalPeriodLengthMilliSec - window.relaxPeriodLengthMilliSec);
        setDisplayForBool(1);
        //poppedUpWindow.close();
    }, window.relaxPeriodLengthMilliSec);
}

function setDisplayForBool(boolVal) {
    if(boolVal==1) {
        watchColour = "#008080";
    } else if(boolVal==0) {
        watchColour = "#FF3366";
    }
    document.getElementById('watchDisplay').style.color = watchColour;
    document.getElementById('watchText').innerHTML = window.watchTextValues[boolVal];
}

// Cookie operations
// Borrowed from www.quirksmode.org/js/cookies.html
function createCookie(cookieName, cookieValue, cookieExpiryDays) {
    if(cookieExpiryDays) {
        var date = new Date();
        date.setTime(date.getTime()+cookieExpiryDays*24*60*60*1000);
        var expires = '; expires='+date.toGMTString();
    } else var expires = "";
    document.cookie = cookieName+'='+cookieValue+expires+'; path=/';
}

function readCookie(cookieName) {
    //TODO(rushiagr): optimize this function
    var cookieNameEQ = cookieName+'=';
    var cookieArray = document.cookie.split(';');
    for(var i=0; i<cookieArray.length; i++) {
        var cookie = cookieArray[i];
        while (cookie.charAt(0)==' ')
            cookie = cookie.substring(1, cookie.length);
        if(cookie.indexOf(cookieNameEQ)==0)
            return cookie.substring(cookieNameEQ.length, cookie.length);
    }
    return null;
}

function eraseCookie(cookieName) {
    createCookie(cookieName, "", -1);
}
