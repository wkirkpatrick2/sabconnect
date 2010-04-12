
var SABConnect = {
  daemon_url:function(daemon){
      if (!daemon.apikey === undefined){
        return checkEndSlash(daemon.url) + 'api?apikey='+daemon.apikey;
      }else{
        return checkEndSlash(daemon.url) + 'api';
      }
    },

  info:function(data){
      var daemon  = data.daemon;
      var opts    = data.opts;
      var success = data.success;
      var error   = data.error;

      if (opts === undefined){opts = {};}

      var url = SABConnect.daemon_url(daemon);
      opts.apikey = daemon.apikey;
      opts.mode   = 'queue';
      opts.output = 'json';

      $.ajax({
        type: "GET",
        url: url ,
        data: opts ,
        success: function(data){
          var isError = false;
          var errMsg  = '';
          if (opts.output == 'json'){
            data = JSON.parse(data);
            //console.log( 'success?:' + data.error );
                          
            if (! (data.error === undefined)){
              errMsg = data.error;
              isError = true;
            }
          }else{
            if (data.startsWith("error:")){
              isError = true;
            }
          }
          if (isError){
            error(errMsg);
          }else{
            success();
          }
        },
        error: error
      });
    },

  queue_json:function(data){
      if (opts === undefined){opts = {};}
      data.opts.mode   = 'queue';
      data.opts.output = 'json';
      this.info(data);
  },

  queue_xml:function(data){
      if (opts === undefined){opts = {};}
      data.opts.mode   = 'queue';
      data.opts.output = 'xml';
      this.info(data);
  }
};

function checkEndSlash(input) {
    if (input.charAt(input.length-1) == '/') {
        return input;
    } else {
        var output = input+'/';
        return output;
    }
}


/*

            // Cache the latest update (probably not needed)
            //gSabInfo = data;

            if(data.queue.speed) {
                // Convert to bytes
                var bytesPerSec = data.queue.kbpersec*1024;
                //var speed = fileSizes(bytesPerSec, 0) + '/s';
                var speed = data.queue.speed + 'B/s';
            } else {
                var speed = '-';
            }
            setPref('speed', speed);

            // Do not run this on a quickUpdate (unscheduled refresh)
            if(!quickUpdate) {
                var speedlog = getPref('speedlog');

                if(speedlog.length >= 10) {
                    // Only allow 10 values, if at our limit, remove the first value (oldest)
                    speedlog.shift()
                }

                speedlog.push(data.queue.kbpersec);
                setPref('speedlog', speedlog);
            }



            if(data.queue.mbleft && data.queue.mbleft > 0) {
                // Convert to bytes
                var bytesLeft = data.queue.mbleft*1048576;
                var queueSize = fileSizes(bytesLeft);
            } else {
                var queueSize = '';
            }
            setPref('sizeleft', queueSize);

            setPref('queue', data.queue.slots);

            setPref('status', data.queue.status);
            setPref('paused', data.queue.paused);

            // Update the badge
            var badge = {};
            // Set the text on the object to be the number of items in the queue
            // +'' = converts the int to a string.
            badge.text = data.queue.noofslots+'';
            chrome.browserAction.setBadgeText(badge);


            // Update the background based on if we are downloading
            if(data.queue.kbpersec && data.queue.kbpersec > 1) {
                badgeColor = {}
                badgeColor.color = new Array(0, 213, 7, 100);
                chrome.browserAction.setBadgeBackgroundColor(badgeColor)
            } else {
                // Not downloading
                badgeColor = {}
                badgeColor.color = new Array(255, 0, 0, 100);
                chrome.browserAction.setBadgeBackgroundColor(badgeColor)
            }


 */




function addToSABnzbd(addLink, nzb, mode) {

    

    // This is currently run by a content script
    // Should change it to run in background.html
    // The error function is always called - even on success, probably due to this

    var sabApiUrl = constructApiUrl();
    var data = constructApiPost(false);
    data.mode = mode;
    data.name = nzb;
    
    $.ajax({
        type: "GET",
        url: sabApiUrl,
        dataType: 'json',
        data: data,
        success: function(data) {
        
            /*// If there was an error of some type, report it to the user and abort!
            if(data.error) {
                var img = chrome.extension.getURL('images/sab2_16_red.png');
                $(addLink).find('img').attr("src", img);
                alert(data.error);
            }*/
        
            
            $(addLink).find('img').attr("src", img);
        },
        error: function() {
            // This seems to get called on a success message from sabnzbd.
            //var img = chrome.extension.getURL('sab2_16_red.png');
            var img = chrome.extension.getURL('images/sab2_16_green.png');
            $(addLink).find('img').attr("src", img);
            
            //alert("Could not contact SABnzbd \n Check it is running and your settings are correct");
        }
    });
 
    
}

function moveQueueItem(nzoid, pos) {

    var sabApiUrl = constructApiUrl();
    var data = constructApiPost(true);
    data.mode = 'switch';
    data.value = nzoid;
    data.value2 = pos;
    

    $.ajax({
        type: "POST",
        url: sabApiUrl,
        data: data,
        success: function(data) {
            // Since data has changed, refresh the jobs. Does not update the graph because the first param is true
            fetchInfo(true);
        },
        error: function() {
            $('#error').html('Failed to move item, please check your connection to SABnzbd');
        }
    });
 
    
}

function queueItemAction(action, nzoid, callBack) {

    var sabApiUrl = constructApiUrl();
    var data = constructApiPost(true);
    data.mode = 'queue';
    data.name = action;
    data.value = nzoid;    

    $.ajax({
        type: "POST",
        url: sabApiUrl,
        data: data,
        success: function(data) {
            // Since data has changed, refresh the jobs. Does not update the graph because the first param is true
            fetchInfo(true, callBack);
        },
        error: function() {
            $('#error').html('Failed to move item, please check your connection to SABnzbd');
        }
    });
 
    
}
