maxEntriesPerPage = 7;
thereIsANextPage = false;
log = document.getElementById("log");
currentPage = 0;
ob = JSON.parse(localStorage.recentlyClosedTabs);

String.prototype.trunc = function(n) {
    return this.substr(0, n - 1) + (this.length > n ? '...': '');
};


function display(page) {
    thereIsANextPage = false;
    if (page < 0) return;
    if (page == 0) {
        document.getElementById('previous_inactive').style.display = "block";
        document.getElementById('previous_active').style.display = "none";
    } else {
        document.getElementById('previous_inactive').style.display = "none";
        document.getElementById('previous_active').style.display = "block";
    }

    count = 0;
    liste = "";
    c = 0;
    onPage = 0;
    currentPage = page;

    //	for (var i = 0; i <10; i++) {
    for (var i = ob.length; i > 0; i--) {
        //		log.innerHTML = log.innerHTML + "<br />" + ob[i];
        if (ob[i] != null) {
            _ob = JSON.parse(ob[i]);

            if (_ob.url != "chrome://newtab/") {
                c++;
                if (c > maxEntriesPerPage) {
                    onPage++
                    c = 0;
                }
                if (onPage == page) {
                    count++;
//                    log.innerHTML = log.innerHTML + "<br />" + _ob.title;
                    title = _ob.title;

                    //					if (title.length())
                    liste += "<li><a title='" + _ob.title + "' href='" + _ob.url + "'>" + title.trunc(32) + "</a></li>";

                    if (count == maxEntriesPerPage + 1) {
                        thereIsANextPage = true;
                        break;
                    }
                }
            }
        }
    }



	if (thereIsANextPage) {
        document.getElementById('next_inactive').style.display = "none";
        document.getElementById('next_active').style.display = "block";
	} else {
        document.getElementById('next_inactive').style.display = "block";
        document.getElementById('next_active').style.display = "none";
	}

    //alert(liste);
    document.getElementById("recentlyClosedTabsList").innerHTML = liste;
}

function init() {
	/*
	// all "new tab" pages have to be registered in localStorage
	
	chrome.tabs.getSelected(integer windowId, registerTab);
	thisTabId = 
	_a = JSON.parse(localStorage.allNewTabs);
	_a[] = 
	*/
	display(0);	
//	alert(localStorage.recentlyClosedTabs);
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

//window.document.onFocus=alert('huhu');