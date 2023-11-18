//power on or off the event
function enable(event) {
    var id = chrome.runtime.id;
    chrome.management.get(id, function(ex)
    {
        if(ex.enabled){
            chrome.management.setEnabled(id, false);
        } else{
            chrome.management.setEnabled(id, true);
        }
    });
}

const btn = document.getElementById('press-button');
btn.addEventListener('click', enable);