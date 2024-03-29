function findNZBId(elem) {
    var url = $(elem).attr('href');
    
    var splitstr = url.split(/browse\/post\/([^\/]+)/g);
    return splitstr[1];
    
}

function addToSABnzbdFromIconClick() {

    if(!gConfig.enable_newzbin) {
        // If disabled, skip the dl
        return true;
    }

    // Find the newzbin id from the href
    var nzbid = findNZBId(this);
    if(nzbid) {
    
        // Set the image to an in-progress image
        var img = chrome.extension.getURL('images/sab2_16_fetching.png');
        $(this).find('img').attr("src", img);
        
        var addLink = this;
        
        addToSABnzbd(addLink, nzbid, "addid");
    }

    
    return false;

}

function addToSABnzbdFromCheckbox(checkbox) {

    if(!gConfig.enable_newzbin) {
        // If disabled, skip the dl
        return true;
    }

    var link = $(checkbox).closest('tr').find('a[title="Send to SABnzbd"]');
    // Find the nzb id from the links href
    var nzbid = findNZBId(link);
    if (nzbid) {
        var img = chrome.extension.getURL('images/sab2_16_fetching.png');
        // Set the image to an in-progress image
        $(link).find('img').attr("src", img);
        // Uncheck the download
        $(checkbox).attr('checked', '');
        // Remove the styling that gets applied when a checkbox is checked
        // For some reason they apply it to a multiple tbody elements
        $(checkbox).closest('tbody').removeClass('select');
        
        addToSABnzbd(link, nzbid, "addid");
    }

}

// Add a common CSS for styling purposes
var commonCss = chrome.extension.getURL('css/common.css');
$('head').append('<link rel="stylesheet" href="' + commonCss + '" type="text/css" />');

// Add the SABnzbd download icon
$('a[title="Download report NZB"]').each(function() {
    // Change the title to "Send to SABnzbd"
    $(this).attr("title", "");
    
    // Change the nzb download image to our own custom one
    var img = chrome.extension.getURL('images/sab2_16.png');
    $(this).find('img')
    .attr("src", img)
    .attr("width", '16')
    .attr("height",'16');

    // Change the on click handler to send to sabnzbd
    $(this).click(addToSABnzbdFromIconClick);
    
});

// Add a send to sabnzbd button to send multiple posts
if(document.URL.indexOf('/post/') == -1) {
    // Listing page
    $('#topActionsForm table tr td:first').append('<button id="sendMultiple">Send to SABnzbd</button>');
    $('#sendMultiple').click(function() {

        if(!gConfig.enable_newzbin) {
            // If disabled, skip the dl
            return true;
        }

        $('table.dataTabular input:checkbox:checked').each(function() {
            addToSABnzbdFromCheckbox(this);
        });
        return false;
    });
} else {
    // Single post page
    $('.main table.dataIrregular tr:first').after('<tr><th>SABnzbd:</th><td><a href="' + document.URL + '" id="addSABnzbdLink"><img id="addSABnzbdImg" src="" /></a></td></tr>');
    // Change the nzb download image to our own custom one
    var img = chrome.extension.getURL('images/sab2_16.png');
    $('#addSABnzbdImg')
    .attr("src", img)
    .attr("width", '16')
    .attr("height",'16');

    // Change the on click handler to send to sabnzbd
    $('#addSABnzbdLink').click(addToSABnzbdFromIconClick);
}




