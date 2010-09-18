maxEntriesPerPage = 7;
maxSavedClosedTabs = 100;
log = $("log");
currentPage = 0;
allRecentlyClosedTabs = JSON.parse(localStorage.recentlyClosedTabs);

String.prototype.trunc = function(n) {
    return this.substr(0, n - 1) + (this.length > n ? '...': '');
};


function displayRecentlyClosedTabs(page) {
    if (page < 0) return;
    if (page == 0) {
        $("#previous_inactive").css("display", "block");
        $("#previous_active").css("display", "none");
    } else {
        $("#previous_inactive").css("display", "none");
        $("#previous_active").css("display", "block");
    }

	// we cannot be sure, that there are only correct objects in the allRecentlyClosedTabs variable
	// so we sanatize it
	sanatizedObject = new Array();
	for (i = 0; i < allRecentlyClosedTabs.length; i++) {
        if (allRecentlyClosedTabs[i] != null)  {
			if (i > maxSavedClosedTabs)
				// delete it for perfomance reasons
				allRecentlyClosedTabs.splice(i, 1);
			else
				sanatizedObject.push(allRecentlyClosedTabs[i]);
		}
	}
	
	localStorage.recentlyClosedTabs = JSON.stringify(allRecentlyClosedTabs);
		
    liste = "";		
	// in fact we are paging backwards through the list
    for (i = sanatizedObject.length - ((maxEntriesPerPage * page) + maxEntriesPerPage); 
		 i < sanatizedObject.length  && i < sanatizedObject.length - ((maxEntriesPerPage * page)); 
		 i++) {
		if (sanatizedObject[i] != null) {
			_ob = JSON.parse(sanatizedObject[i]);
        	liste = "<li><a title='" + convert(_ob.title) + "' href='" + convert(_ob.url) + "'>" + convert(_ob.title.trunc(33)) + "</a></li>" + liste;
		}
    }

	if (sanatizedObject.length > (page * maxEntriesPerPage) + maxEntriesPerPage) {
        $("#next_inactive").css("display", "none");
        $("#next_active").css("display", "block");
	} else {
        $("#next_inactive").css("display", "block");
        $("#next_active").css("display", "none");
	}

    $("#recentlyClosedTabsList").html(liste);
	currentPage = page;
}


function _log(msg) {
	$("#log").css("display", "block");
	$("#log").html($("#log").html() + "<br />" + msg);	
}

function init() {
	displayRecentlyClosedTabs(0);	
	displayFavorites();
}


function displayFavorites() {
	chrome.bookmarks.getTree(function(a) {
		//_log(a);
	
		fertig = new Array();

		ob = a[0].children[0].children;
		for (i = 0; i < ob.length; i++) {
			if (ob[i].children == null) {
				// _log(ob[i].title);
				fertig.push(ob[i]);
			}
		}

		td = "";
		for (i = 0; i < fertig.length; i++) {
			if (i == 0 || i % 2 == 0)
				td += "<tr>";
			
			td += '<td width="180" valign="middle" align="left"><a href="' + convert(fertig[i].url) + '">' + convert(fertig[i].title) + '</a></td>';
			
			if (i == 0 || i % 2 == 0)
			  td += '<td width="30">&nbsp;</td>';
			
			if (i % 2 == 1)
				td += '</tr><tr><td height="10">&nbsp;</td></tr>';
		}
		td += "</tr>";

		$("#favTable").html(td);
	});
}


function next() {
    displayRecentlyClosedTabs(currentPage + 1);
}

function previous() {
    displayRecentlyClosedTabs(currentPage - 1);
}


chrome.extension.onRequest.addListener( function(request) { 
	window.location.reload();
});


function convert(txt) {
	if(!txt) return '';
	txt = txt.replace(/&/g,"&amp;");
	var new_text = '';
	for(var i = 0; i < txt.length; i++) {
		var c = txt.charCodeAt(i);
		if(typeof ENTITIES[c] != 'undefined') {
			new_text += '&' + ENTITIES[c] + ';';
		} else if(c < 128) {
			new_text += String.fromCharCode(c);
		}else {
			new_text += '&#' + c +';';
		}
	}
 
	return new_text.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/'/g, "").replace(/"/g, "");
}
var ENTITIES = {34: "quot", 60: "lt", 62: "gt", 38: "amp", 160: "nbsp", 161: "iexcl", 162: "cent", 163: "pound", 164: "curren", 165: "yen", 166: "brvbar", 167: "sect", 168: "uml", 169: "copy", 170: "ordf", 171: "laquo", 172: "not", 173: "shy", 174: "reg", 175: "macr", 176: "deg", 177: "plusmn", 178: "sup2", 179: "sup3", 180: "acute", 181: "micro", 182: "para", 183: "middot", 184: "cedil", 185: "sup1", 186: "ordm", 187: "raquo", 188: "frac14", 189: "frac12", 190: "frac34", 191: "iquest", 192: "Agrave", 193: "Aacute", 194: "Acirc", 195: "Atilde", 196: "Auml", 197: "Aring", 198: "AElig", 199: "Ccedil", 200: "Egrave", 201: "Eacute", 202: "Ecirc", 203: "Euml", 204: "Igrave", 205: "Iacute", 206: "Icirc", 207: "Iuml", 208: "ETH", 209: "Ntilde", 210: "Ograve", 211: "Oacute", 212: "Ocirc", 213: "Otilde", 214: "Ouml", 215: "times", 216: "Oslash", 217: "Ugrave", 218: "Uacute", 219: "Ucirc", 220: "Uuml", 221: "Yacute", 222: "THORN", 223: "szlig", 224: "agrave", 225: "aacute", 226: "acirc", 227: "atilde", 228: "auml", 229: "aring", 230: "aelig", 231: "ccedil", 232: "egrave", 233: "eacute", 234: "ecirc", 235: "euml", 236: "igrave", 237: "iacute", 238: "icirc", 239: "iuml", 240: "eth", 241: "ntilde", 242: "ograve", 243: "oacute", 244: "ocirc", 245: "otilde", 246: "ouml", 247: "divide", 248: "oslash", 249: "ugrave", 250: "uacute", 251: "ucirc", 252: "uuml", 253: "yacute", 254: "thorn", 255: "yuml", 34: "quot", 60: "lt", 62: "gt", 38: "amp"};
