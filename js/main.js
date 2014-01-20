// NOTE: all the times are in milliseconds, unless otherwise specified in the variable name

function createWatch() {
    window.watch = new Stopwatch(function(watch) { // Listener function
        document.getElementById('watchDisplay').innerHTML = watch.toString();
    } , 1000, false);
}


function populateDefaultValues(isPopup) {
    /* When normalPeriod is 1, the user can carry on his tasks on computer, but when it
     * is 0, we'll alert the user to not look at the screen and relax his/her eyes. */
    window.isNormalPeriod = 1;  // used as boolean
    window.normal = 1000*60*20;    // 20 minutes
    window.relax = 1000*20;        // 20 seconds
    // Default Values
    window.defaultNormal = 1000*60*20;    // 20 minutes
    window.defaultRelax = 1000*20;          // 20 seconds

    if(isPopup) {
        window.isPopup = true;
        poppedUpWindow = 'dummyValue';
    } else {
        window.isPopup = false;
    }

    window.soundFile1 = new Audio("sounds/bing.ogg");
    window.soundFile2 = new Audio("sounds/bong.ogg");
    
    window.watchTextValues = [
                "Time to give your eyes a break. Don't look at the screen!!", 
                "Keep working. We'll inform you of a break in:"
                ];
}


function readFromCookie() {
    // Read 'normal' and 'relax' values from cookie and put in HTML page's textbox
    var normalCookie = readCookie("normalCookie");
    var relaxCookie = readCookie("relaxCookie");

    if(normalCookie) {
        window.normal = normalCookie;
        document.getElementById('normalDurationMins').value = normalCookie/1000/60;
    }

    if(relaxCookie) {
        window.relax = relaxCookie;
        document.getElementById('relaxDurationSecs').value = relaxCookie/1000;
    }
}


function startAfresh() {
    // Restart the clock again. Starts from the time specified in variable window.normal
    // Closes the popup window if it is open
    setDisplayForBool(window.isNormalPeriod);
    clearIntervalsAndTimeouts();
    resetWatch(window.normal);
    window.alreadySetInterval = setInterval('loop()', window.normal);
    if(window.isPopup) {
        if(poppedUpWindow !== 'dummyValue') {
            poppedUpWindow.close();
        }
    }
}

function resetToDefaultTimes() {
    // Resets the clock to the default time of 20-min/20-second thing, and restarts it
    window.normal = window.defaultNormal;
    window.relax = window.defaultRelax;

    // TODO(rushiagr): the textboxes still show the previous value. Either remove these
    // two lines or remove those
    createCookie("normalCookie", window.normal, 365*20);
    createCookie("relaxCookie", window.relax, 365*20);
    
    window.startAfresh();
}


function modifyTimes() {
    // Take the values from the two textboxes and apply the changes
    var normalCookieStr = document.getElementById('normalDurationMins').value;
    var relaxCookieStr = document.getElementById('relaxDurationSecs').value;

    if(isNaN(Number(normalCookieStr)) || isNaN(Number(relaxCookieStr))) {
        alert("Please check the number you have entered.");
        return;
    }

    // Rounding off to the nearest second
    var normalMilli = Math.round(Number(normalCookieStr)*60*1000/1000)*1000;
    var relaxMilli = Math.round(Number(relaxCookieStr)*1000/1000)*1000;

    if(relaxMilli >= normalMilli) {
        alert("Duration of break can't be more than or equal to normal working period :)");
        return;
    }

    window.normal = normalMilli;
    window.relax = relaxMilli;

    createCookie("relaxPeriodCookieMilliSec", window.relax, 365*20);
	
	if(window.normal!=readCookie("normalPeriodCookieMilliSec"))	{
		createCookie("normalPeriodCookieMilliSec", window.normal, 365*20);
		window.startAfresh();
	}

}

function clearIntervalsAndTimeouts() {
    clearInterval(window.alreadySetInterval);
    clearTimeout(window.alreadySetTimeout);
}

function loop() {
    resetWatch(window.normal);
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
        var poppedUpWindow = window.open('popupPage.html', '', config='height=200,width=500');
    } else {
        window.soundFile1.play();
    }
    resetWatch(window.relax);
    setDisplayForBool(0);

    window.alreadySetTimeout = setTimeout(function(){
        if(window.isPopup) {
            poppedUpWindow.close();
        } else {
            window.soundFile2.play();
        }
        resetWatch(window.normal - window.relax);
        setDisplayForBool(1);
    }, window.relax);
}

function setDisplayForBool(boolVal) {
    // Changes the display colour, and text depending on which period is going on now
    // 0 stands for relax/break period, 1 stands for normal period
    if(boolVal==1) {
        watchColour = "#3498db";
    } else if(boolVal==0) {
        watchColour = "#FF6103";
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

function clickApply(event) {
    if(event.keyCode == 13) {
        modifyTimes();
    }
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
