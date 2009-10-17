function findNZBId(elem) {
    var url = $(elem).attr('href');
    
    var splitstr = url.split(/browse\/post\/(\d+)\/nzb/g);
    return splitstr[1];
    
}

function addToSABnzbdFromNewzbin() {
    // Set the image to an in-progress image
    var img = chrome.extension.getURL('images/sab2_16_fetching.png');
    $(this).find('img').attr("src", img);
    
    // Find the newzbin id from the href
    var nzbid = findNZBId(this);
    var addLink = this;
    
    addToSABnzbd(addLink, nzbid, "addid");
    
    return false;

}

$('a[title="Download report NZB"]').each(function() {
    // Change the title to "Send to SABnzbd"
    $(this).attr("title", "Send to SABnzbd");
    
    // Change the nzb download image
    var img = chrome.extension.getURL('images/sab2_16.png');
    $(this).find('img').attr("src", img);

    // Change the on click handler to send to sabnzbd
    $(this).click(addToSABnzbdFromNewzbin);
    
});

