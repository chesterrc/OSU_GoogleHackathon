//get tabid
var activeTabId;
//this does not work
chrome.tabs.onActivated.addListener(function(activeInfo) {
    activeTabId = activeInfo.tabId;
});

function getActiveTab(callback) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var tab = tabs[0];

    if (tab) {
        callback(tab);
    } else {
        chrome.tabs.get(activeTabId, function (tab) {
        if (tab) {
            callback(tab);
        } else {
            console.log('No active tab identified.');
        }
    });

    }
});
}

//power on
function poweron() {
    chrome.storage.sync.get('state', function(data) {
        if (data.state === 'on') {
            chrome.storage.sync.set({state: 'off'});
            //change img src
            document.getElementById('onoff_img').src = '../images/start-button.png'
        } else {
            chrome.storage.sync.set({state: 'on'});
            document.getElementById('onoff_img').src = '../images/pause.png'
            var query = { active: true, currentWindow: true };
            chrome.scripting.executeScript({
                target: activeTabId,
                files: ['../backend/html_parse.js'],
            })
        }
    });
}

document.getElementById('onoff').addEventListener('click', poweron);