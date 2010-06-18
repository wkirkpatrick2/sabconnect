// Scrape the users userid and hash to add to download links
var rssURL = $('link[title="RSS 1.0"]').attr('href');
// These will fail if nzbs.org changes the RSS feed at all
var match = /i=([^&]*)/i.exec(rssURL);
var user = match[1];
var match = /h=([^&]*)/i.exec(rssURL);
var hash = match[1];



//http://nzbs.org/index.php?action=getnzb&nzbid=307942
function addToSABnzbdFromNZBORG() {
    var img = chrome.extension.getURL('images/sab2_16_fetching.png');
    $(this).find('img').attr("src", img);
    
    // Find the newzbin id from the href
    var url = 'http://nzbs.org/';
    var nzburl = url.concat($(this).attr('href'));
    // Add the authentication to the link about to be fetched
    nzburl += '&i=' + user;
    nzburl += '&h=' + hash;
    //var addLink = this;
    data = {};
    data.opts = {};
    data.opts.name = nzburl;
    fetch(data);
    //addToSABnzbd(addLink, nzburl, "addurl");
    return false;

}

var imgsab = chrome.extension.getURL('/images/sab2_16.png');
var imgnzb = chrome.extension.getURL('/images/nzb.png');

// Loop through each download link and prepend a link+img to add to sabnzbd
$('.dlnzb').each(function() {
    var href = $(this).attr('href');
    var slink = '<a class="addSABnzbd" href="' + href + '"><img src="' + imgsab + '" /></a> ';
    var dlink = '<a class="getnzb" href="' + href + '"><img src="' + imgnzb + '" /></a> ';
    $(this).closest('td').hide();
    $(this).closest("tr").find("input").before(slink).before(dlink);
    
    $('.addSABnzbd').click(addToSABnzbdFromNZBORG);
    
});

