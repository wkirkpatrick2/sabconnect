
function setPref(key, value) {
  var config = {};
  if (localStorage.config) {
    config = JSON.parse(localStorage.config);
  }
  config[key] = value;
  localStorage.config = JSON.stringify(config);
}
function getPref(key) {
  if (!localStorage.config) {
    return undefined;
  }
  var config = JSON.parse(localStorage.config);
  return config[key];
}


// Load the config objects into memory since we cannot access them directly in content scripts yet
var gConfig = new Object();

function fetch(url){
  var port = chrome.extension.connect({name: "notifyChannel"});
  port.postMessage({key:'addurl', get:url});
}

function getConfig(key,get) {
  if (get == undefined){
    get = 'get'
  }
  var port = chrome.extension.connect({name: "notifyChannel"});
  port.postMessage({key:key, get:get});
}

// Also listen for new channels from the extension for when the button is
// pressed.
chrome.extension.onConnect.addListener(function(port, name) {
  port.onMessage.addListener(function(msg) {
    console.log("get<="+msg);
    //console.log(msg);
    //console.log("common.onMessage: value:" + msg.get + "--" + msg.value);
    if (msg.value) {
        gConfig[msg.key] = msg.value;
    }
  });
});

//getConfig('active_daemon','gvar');
//console.log(gConfig);
