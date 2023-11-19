var enabled = true;
//background work, try using for on/off or gathering data
function toggle(info) {
    console.log('background listen passed', info);
    if(!enabled) return {cancel: false};
return {cancel: true};
}

chrome.webRequest.onBeforeRequest.addListener(
    toggle,
    {urls: "<all_urls>"},
    );