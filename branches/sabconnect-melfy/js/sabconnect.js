

var SABConnect = {
    daemon_api:function(daemon){
        if (!daemon.apikey === undefined){
            return checkEndSlash(daemon.url) + 'api?apikey='+daemon.apikey;
        }else{
            return checkEndSlash(daemon.url) + 'api';
        }
    },

    daemon_url:function(daemon){
        return checkEndSlash(daemon.url);
    },

    info:function(data){
        var daemon  = data.daemon;
        var opts    = data.opts;
        var success = data.success;
        var error   = data.error;

        if (!(typeof success == 'function')){
            success = function(){};
        }

        if (!(typeof error == 'function')){
            error = function(){};
        }

        if (daemon === undefined){daemon = active_daemon;}

        if (opts === undefined){opts = {};}

        var url = this.daemon_api(daemon);
        opts.apikey = daemon.apikey;

        if (opts.mode === undefined)    {opts.mode   = 'queue';}
        if (opts.output === undefined)  {opts.output = 'json';}

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
                    success(data);
                }
            },
            error: error
        });
    },

    fetch:function(data){
        if (data.opts === undefined){data.opts = {};}
        var url = this.daemon_api(data.daemon);

        data.opts.mode   = 'queue';
        data.opts.output = 'json';
        this.info(data);
    },

    addurl:function(data){
      if (data.opts === undefined){data.opts = {};}
        data.opts.mode = 'addurl';
        this.info(data);
    },

    queue_json:function(data){
        if (data.opts === undefined){data.opts = {};}
        data.opts.mode   = 'queue';
        data.opts.output = 'json';
        this.info(data);
    },

    queue_xml:function(data){
        if (data.opts === undefined){data.opts = {};}
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





function addToSABnzbd(addLink, nzb, mode) {
    if (active_daemon == undefined){
        alert('active_daemon == undefined');
        return false;
    }

    

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
