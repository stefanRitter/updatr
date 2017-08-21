
// TODO: check for updates in sync with the cronjob's schedule

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


// opens a new tab with Updatr when clicked and updates unread links count
chrome.browserAction.onClicked.addListener(function () {
    chrome.cookies.get({url: domain, name: 'uid'}, function (cookie) {
        if (!cookie) {
            window.open(domain+'/login','_blank');
            chrome.browserAction.setBadgeText({text: ''});
        } else {
            udpateLinkCount(cookie.value);
            window.open(domain,'_blank');
        }
    });
});

// check if logged in on browser open
chrome.cookies.get({"url": domain, "name": 'uid'}, function (cookie) {
    if (!cookie) {
        window.open(domain+'/login','_blank');
        chrome.browserAction.setBadgeText({text: ''});
    } else {
        udpateLinkCount(cookie.value);
    }
});
