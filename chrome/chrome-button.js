
var domain = 'https://www.getupdatr.com';

// update link count
function udpateLinkCount (uid) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", domain+'/linkcount?uid='+uid, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status === 200) {
                chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
                chrome.browserAction.setBadgeText({text: xhr.response});
            } else {
                chrome.browserAction.setBadgeText({text: ''});
            }
        }
    }
    xhr.send();
}


// 1
// check if logged in on browser open
chrome.cookies.get({"url": domain, "name": 'uid'}, function (cookie) {
    if (!cookie) {
        window.open(domain+'/login','_blank');
        chrome.browserAction.setBadgeText({text: ''});
    } else {
        udpateLinkCount(cookie.value);
    }
});


// 2
// opens a new tab with Updatr when clicked and updates unread links count
chrome.browserAction.onClicked.addListener(function () {
    chrome.cookies.get({url: domain, name: 'uid'}, function (cookie) {
        if (!cookie) {
            window.open(domain+'/login','_blank');
            chrome.browserAction.setBadgeText({text: ''});
        } else {
            // after activating check after every active change for 15 min
            var updateListener = udpateLinkCount.bind(this, cookie.value);
            chrome.tabs.onActivated.addListener(updateListener);

            setTimeout(function () {
                chrome.tabs.onActivated.removeListener(updateListener);
            }, 150000);

            window.open(domain,'_blank');
        }
    });
});


// 3
// check for new count every hour
chrome.alarms.onAlarm.addListener(function (alarm) {
    chrome.cookies.get({"url": domain, "name": 'uid'}, function (cookie) {
        if (cookie) {
            udpateLinkCount(cookie.value);
        }
    });
});
chrome.alarms.create('updatrRefresh', {periodInMinutes: 60});
