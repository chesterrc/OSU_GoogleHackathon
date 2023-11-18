//power on or off the event
function enable(event) {
    console.log('clicked', event)
    tog = tog ? false : true;
    if(tog){
     //turn on...
        chrome.browserAction.setIcon({ path: 'start-button.png' });
        chrome.browserAction.setBadgeText({ text: 'ON' });
        chrome.tabs.executeScript(null, { file: 'content.js' }); 
    }else{
     //turn off...
        chrome.browserAction.setIcon({ path: 'disable.png'});
        chrome.browserAction.setBadgeText({ text: '' });
    }
};

const btn = document.getElementById('press-button');
btn.addEventListener('click', enable);