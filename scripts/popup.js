//power on or off the event
function enable(event) {
    crhome.storage.sync.get('state', function(data){
        if (data.sate === 'on'){
            chrome.storage.sync.set({state:'off'});
            //add in different images
        } else{
            chrome.storage.sync.set({state:'on'});
            chrome.tabs.executeScript(null, {file: '../backend/html_parse.js'})
        }
    })
};

const btn = document.getElementById('press-button');
btn.addEventListener('click', enable);