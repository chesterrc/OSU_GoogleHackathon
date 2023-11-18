var enabled = true;
//function checks if extension is enabled or disabled
function toggle(info) {
    console.log('background listen passed', info);
    if(!enabled) return {cancel: false};
return {cancel: true};
}

chrome.webRequest.onBeforeRequest.addListener(
    toggle,
    {urls: "<all_urls>"},
    );