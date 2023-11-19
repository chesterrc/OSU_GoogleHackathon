//get tabid
function callback(tabs) {
    var currentTab = tabs[0]; // there will be only one in this array
    console.log(currentTab);
    return currentTab.id
}

async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let tab = await chrome.tabs.query(queryOptions, callback);
    console.log(tab);
    return tab;
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
            //change img src
            document.getElementById('onoff_img').src = '../images/pause.png'
            //call function to get tabid
            //activeTabId = grabTab();
            chrome.scripting.executeScript({
                target: {tabId: getCurrentTab()},
                files: ['../backend/html_parse.js'],
            })
        }
    });
}

document.getElementById('onoff').addEventListener('click', poweron);

//show swear word count
var count = chrome.storage.local
const word_count = document.getElementById('word_count')
word_count.innerHTML = count;


