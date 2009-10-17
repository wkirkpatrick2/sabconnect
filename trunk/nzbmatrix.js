function findNZBId(elem) {
    var url = $(elem).attr('href');

    // 0.5a6 needs nzb-details not nzb-download in url
    url = url.replace('nzb-download', 'nzb-details');
    
    return 'http://nzbmatrix.com' + url;
    
}

function addToSABnzbdFromNZBMatrix() {
    // Set the image to an in-progress image
    var img = chrome.extension.getURL('images/sab2_16_fetching.png');
    $(this).find('img').attr("src", img);
    
    // Find the newzbin id from the href
    var nzbid = findNZBId(this);
    var addLink = this;
    
    addToSABnzbd(addLink, nzbid, "addurl");
    
    return false;

}

$('img[title="Download NZB"]').each(function() {
    // Change the title to "Send to SABnzbd"
    $(this).attr("title", "Send to SABnzbd");
    
    // Change the nzb download image
    var img = chrome.extension.getURL('images/sab2_16.png');
    $(this).attr("src", img);

    // Change the on click handler to send to sabnzbd
    $(this).parent().click(addToSABnzbdFromNZBMatrix);
    
});
