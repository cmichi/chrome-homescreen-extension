maxEntriesPerPage = 7;
log = document.getElementById("log");
currentPage = 0;
ob = JSON.parse(localStorage.recentlyClosedTabs);

String.prototype.trunc = function(n) {
    return this.substr(0, n - 1) + (this.length > n ? '...': '');
};


function display(page) {
    if (page < 0) return;
    if (page == 0) {
        document.getElementById('previous_inactive').style.display = "block";
        document.getElementById('previous_active').style.display = "none";
    } else {
        document.getElementById('previous_inactive').style.display = "none";
        document.getElementById('previous_active').style.display = "block";
    }


	sanatizedObject = new Array();
	for (i = 0; i < ob.length; i++) {
        if (ob[i] != null) 
			sanatizedObject.push(ob[i]);
	}
		
    liste = "";		
	// es wird eigentlich rückwärts geblättert		
    for (i = sanatizedObject.length - ((maxEntriesPerPage * page) + maxEntriesPerPage); 
		 i < sanatizedObject.length  && i < sanatizedObject.length - ((maxEntriesPerPage * page)); 
		 i++) {
		if (sanatizedObject[i] != null) {
			_ob = JSON.parse(sanatizedObject[i]);
        	liste = "<li><a title='" + _ob.title + "' href='" + _ob.url + "'>" + _ob.title.trunc(32) + "</a></li>" + liste;
		}
    }

	if (sanatizedObject.length > (page * maxEntriesPerPage) + maxEntriesPerPage) {
        document.getElementById('next_inactive').style.display = "none";
        document.getElementById('next_active').style.display = "block";
	} else {
        document.getElementById('next_inactive').style.display = "block";
        document.getElementById('next_active').style.display = "none";
	}

    document.getElementById("recentlyClosedTabsList").innerHTML = liste;
	currentPage = page;
}


function log(msg) {
	document.getElementById('log').innerHTML = document.getElementById('log').innerHTML + "<br />" + _ob.title;	
}

function init() {
	display(0);	
}



function next() {
    display(currentPage + 1);
}

function previous() {
    display(currentPage - 1);
}


chrome.extension.onRequest.addListener( function(request) { 
	window.location.reload();
});