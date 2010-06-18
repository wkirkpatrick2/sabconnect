function findNZBId(elem) {
    var url = $(elem).attr('href');

    // 0.5a6 needs nzb-details not nzb-download in url
    url = url.replace('nzb-download', 'nzb-details');
    
    return 'http://nzbmatrix.com' + url;
    
}

function addToSABnzbdFromNZBMatrix() {

    // Find the newzbin id from the href
    var nzbid = findNZBId(this);
    if(nzbid) {
        // Set the image to an in-progress image
        $(this).find('img').attr("src", imgload);
        var addLink = this;
        addToSABnzbd(addLink, nzbid, "addurl");
    }

    
    return false;

}

var replaceIcon=false;
var imgsab  = chrome.extension.getURL('images/sab2_16.png');
var imgnzb  = chrome.extension.getURL('images/nzb.png');
var imgload = chrome.extension.getURL('images/load-arrows.gif'); 

function loader(){
    $('img[title="Download NZB"]').each(function() {
        if (replaceIcon){
            $(this).addClass('send2sab')
                .attr("title", "Send to SABnzbd+")
                .attr("src", imgsab)
                .parent().attr('href','javascript:return(false);');

        }else{
            $(this).attr("src", imgnzb).attr("title","Download NZB!")
                .parent()
                .prepend('<a class="send2sab" href="javascript:return(false);" ><img title="Send to SABnzbd+" src="'+imgsab+'" /></a>');
        }
    });
}

loader();

console.log(gConfig);



$('.send2sab').live('click',addToSABnzbdFromNZBMatrix);

document.body.addEventListener('DOMNodeInserted', function(event){
    if (event.srcElement != undefined && event.srcElement.innerHTML != undefined && event.srcElement.innerHTML.match('<tbody>')){
        loader();
    }
}, false);