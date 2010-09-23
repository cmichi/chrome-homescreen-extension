currentTabsPage = 0;
tabsPerPage = 7;

currentFavsPage = 0;
favsPerPage = 14;

maxSavedClosedTabs = 100000;

allRecentlyClosedTabs = JSON.parse(localStorage.recentlyClosedTabs);



String.prototype.trunc = function(n) {
    return this.substr(0, n - 1) + (this.length > n ? '...': '');
};


function navi(page, prefix, entriesPerPage, sanatizedObject) {
    if (page == 0) {
        $("#"+prefix+"_previous_inactive").css("display", "block");
        $("#"+prefix+"_previous_active").css("display", "none");
    } else {
        $("#"+prefix+"_previous_inactive").css("display", "none");
        $("#"+prefix+"_previous_active").css("display", "block");
    }

	if (sanatizedObject.length > (page * entriesPerPage) + entriesPerPage) {
        $("#"+prefix+"_next_inactive").css("display", "none");
        $("#"+prefix+"_next_active").css("display", "block");
	} else {
        $("#"+prefix+"_next_inactive").css("display", "block");
        $("#"+prefix+"_next_active").css("display", "none");
	}
    

}


function displayRecentlyClosedTabs(page) {
	if (page < 0) return;	
	
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
    for (i = sanatizedObject.length - ((tabsPerPage * page) + tabsPerPage); 
		 i < sanatizedObject.length  && i < sanatizedObject.length - ((tabsPerPage * page)); 
		 i++) {
		if (sanatizedObject[i] != null) {
			_ob = JSON.parse(sanatizedObject[i]);
        	liste = "<li><a title='" + convert(_ob.title) + "' href='" + convert(_ob.url) + "'>" + convert(_ob.title.trunc(33)) + "</a></li>" + liste;
		}
    }

    $("#recentlyClosedTabsList").html(liste);
	navi(page, "tabs", tabsPerPage, sanatizedObject);
	currentTabsPage = page;
}


function _log(msg) {
	$("#log").css("display", "block");
	$("#log").html($("#log").html() + "<br />" + msg);	
}

function init() {
	displayRecentlyClosedTabs(0);	
	displayFavs(0);
}



function displayFavs(page) {
    if (page < 0) return;
	
	chrome.bookmarks.getTree(function(a) {
		
		// have to sanatize the array
		sanatizedObject = new Array();
		ob = a[0].children[0].children;
		for (i = 0; i < ob.length; i++) {
			if (ob[i].children == null) 
				sanatizedObject.push(ob[i]);
		}

		td = "";
		for (i = (page * favsPerPage); i < (page * favsPerPage) + favsPerPage; i++) {
			if (typeof(sanatizedObject[i]) != "undefined") {
				if (i == (page * favsPerPage) || i % 2 == 0)
					td += "<tr>";
			
				td += '<td width="180" valign="middle" align="left"><a href="' + convert(sanatizedObject[i].url) + '">' + convert(sanatizedObject[i].title.trunc(18)) + '</a></td>';
			
				if (i == (page * favsPerPage) || i % 2 == 0)
				  td += '<td width="30">&nbsp;</td>';
			
				if (i % 2 == 1)
					td += '</tr><tr><td height="10"></td></tr>';
			}
		}
		td += "</tr>";
		
		$("#favTable").html(td);		
		navi(page, "favs", tabsPerPage, sanatizedObject);
		currentFavsPage = page;
	});
}


function convert(txt) {
	return txt;
}
