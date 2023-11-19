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
            //chrome.scripting.executeScript({
            //    target: {tabId: getCurrentTab()},
            //    files: ['../backend/html_parse.js'],
            //})
        }
    });
}

document.getElementById('onoff').addEventListener('click', poweron);

//show swear word count
chrome.storage.local.get(["profanityPageCount"]).then((result) => {
    console.log("Value currently is " + result['profanityPageCount']);
    const word_count = document.getElementById('word_count');
    word_count.innerHTML = result['profanityPageCount'];
});

//total profanity count
chrome.storage.local.get(["totalProfanity"]).then((result) => {
    console.log("Value currently is " + result['totalProfanity']);
    const word_count = document.getElementById('total_count');
    word_count.innerHTML = result['totalProfanity'];
});


