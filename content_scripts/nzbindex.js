//  C:\dev\.chromium\nzb-marshal
var debug = (window.location.protocol == 'file:');

function res(id){
	if (debug){
		// test data held in   ../nzb-marshal-test/file.html
		return '../nzb-marshal/' + id;
	}else{
		return chrome.extension.getURL(id);
	}
}

$('b.niftycorners').css('display','none').remove();
$('#menu ul').appendTo('#languages').wrap('<div class="menu1"></div>').attr('id','menu1');

$('#results thead tr.line td:first').html('').append($('h1')).css('width',100);

//$('#results h1').appendTo('#header');  // move group name
//$('#search').appendTo('#header');      // move search results around



/*
$('#results label:first').each(function(){
	var txt = $(this).html().replace('<wbr/>','');
	alert(txt);
	
});
*/

ilo		= res('nzbindex.nl/lights-off.css');
inzb	= res('images/nzb.png');
isab	= res('images/sab2_16.png');
isabr	= res('images/sab2_16_red.png');
isabg	= res('images/sab2_16_green.png');
inzb32	= res('images/nzb32.png');
isab32	= res('images/sab2_32.png');
ilst	= res('images/text_list.png');
info	= res('images/nfo.png');


/* search only */
if (  (!window.location.pathname.match(/^\/groups\//i) || (window.location.pathname.match(/^\/groups\/*\//i)) )  ){
	/* $('#results thead tr').add('#results tfoot tr').prepend('<td width="100px">'); */
	
	$('#results tbody tr').click(function(e){
		//if ( ['IMG','A','INPUT','LABEL'].include(e.target.nodeName) )
		//	return
		
		var c = $('input[type="checkbox"]',this);
		
		if (c.attr('checked')){
			c.removeAttr('checked');
		}else{
			c.attr('checked','checked');
		}
		
		
	}).each(function(){
		$(this).children('td:first').prepend('<div class="buttons"></div>');
		var btns = $('div.buttons',this);
		
		$('a:contains("Download")',this)
			.addClass('download')
			.html('<img alt="Download NZB" class="download" src="'+inzb+'">')
			.appendTo(btns);
		
		$('a:contains("View collection")',this)
			.addClass('collection')
			.html('<img alt="View Collection" src="'+ilst+'" />')
			.appendTo(btns);
			
		$('a:contains("View NFO")',this)
			.addClass('nfo')
			.html('<img alt="View NFO" src="'+info+'" />')
			.appendTo(btns);
		
		//$('input',this).appendTo(btns);
		
		
		$('a.download',this).clone().removeClass('download').addClass('sab').prependTo(btns).click(function(){
			$(this).children('img').attr('src',isabr);
			//console.log('phpid: '	+$.cookie('PHPSESSID') 	);
			//console.log('href: '	+$(this).attr('href')	);
			
			uri = $(this).attr('href') + "?PHPSESSID=" + $.cookie('PHPSESSID');
			
			$.ajax({url:'http://127.0.0.1:8080/api', method:'post', data:{mode:'addurl',name:uri,apikey:'9a3c02d5d6ab1df7d4c176e28a63303e'},
				success:function(data){
					$(this).children('img').attr('src',isab);
				},
				error:function(data){
					console.log(data);
				}
			});
			
			
			return false;
			// .removeAttr('href').attr('link',$('a.download',this).attr('href'))
			
		}).children('img').attr('src',isab);
	});
		
		
	
}


/*	aka individual post details */
var is_release = (!debug && window.location.pathname.match(/^\/release\//i)) || (debug && window.location.pathname.match(/nzbindex-release\.htm/i))
if ( is_release ){
	
	$('tbody div.info').hide();
	
	$('#results').before('<table class="title"><tr> <td id="d1"></td> <td id="d2"></td> </tr></table>');
	
	$('a:contains("Download")')
		.appendTo($('#d1'))
		.addClass('download')
		.html('<img alt="Download NZB" class="download" src="'+inzb32+'"><span>Download</span>')
		.wrap('<div id="dll" class="download_large inlineplz">');
	
	$('h2').parent().eq(0).appendTo('#d2')
	
	/* $('span.poster:contains(@)').addClass('redtext'); */
}


$('div.fileinfo').next().remove();
fi = $('div.fileinfo').prepend('[').append(']').replaceText('-','');
//fi.replaceText('-','');

/* $('div.info').hide().hover(function(){$(this).show()},function(){$(this).hide()}) */


$('#maxsize').insertAfter('#minsize');
$('#minsize').after(' - '); /*.prev().html('Size Range (MB)');*/
$('td:contains("Maximum size:")').parent().hide();
$('td:contains("Minimum size:")').html('Size Range:');

$('#results tbody tr:nth-child(even)').addClass('results_even');

$('input[type="button"][value*="SPAM"]:first').hide();
$('input[type="button"][value*="Notice"]:first').hide();


/* $('tfoot input[value*="SPAM"]').hide();
	$('tfoot input[value*="Notice"]').hide(); */


// move checkboxes into horizontal layout

$('.searchblock input[type="checkbox"]').each(function(){
	$(this).parent().addClass('checkbox');
})

/*
$('#hidecross').add('#complete').add('#hidespambox').each(function(){
	
	$(this).parent().contents().appendTo ( $('chx')  );
	
});
*/

/*
$('#hidecross').parents('tbody').append('<tr><td id="chx" class=bx colspan=10>test</td></tr>');


*/
//if (!window.location.pathname.match(/^\/group\//i))
//	advanced();



//$("body").append('<div id="nzb-marshal" style="">nzb-marshal <a id="lights">lights on</a></div>');

// $("body").append('<link rel="stylesheet" type="text/css" href="'+ilo+'" disabled="true">')


console.log(gConfig);
