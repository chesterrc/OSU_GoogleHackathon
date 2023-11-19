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
    img = document.getElementById('onoff_img');


    chrome.storage.sync.get('state', function(data) {
        if (data.state === 'on') {
            chrome.storage.sync.set({state: 'off'});
            img.src = '../images/start-button.png'
        } else {
            chrome.storage.sync.set({state: 'on'});
            img.src = '../images/pause.png'
        }
    });
}


imgContainer = document.getElementById('onoff');
img = document.createElement('img');

chrome.storage.sync.get('state', function(data) {
    img.src = data.state === 'on' ? '../images/pause.png' : '../images/start-button.png'
});
img.id = 'onoff_img';
imgContainer.appendChild(img);
img.style.height = '120px';
img.style.width = '120px';



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