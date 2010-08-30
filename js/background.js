globalTabRegistry = new Array();
localStorage.recentlyClosedTabs = JSON.stringify(new Array());
//alert(localStorage.recentlyClosedTabs);
allNewTabs = new Array();

function updateAllNewTabPages() {
	// all opened 'new tab' pages have to be updated
	// so that they show the latest closed tabs
//	alert(allNewTabs + "!!!!!!!!!!!");
	for (i = 0; i < allNewTabs.length; i++) {
		if (allNewTabs[i] != null) {
//			alert(allNewTabs[i] + "XXXX");
//			alert('sending...');
			chrome.tabs.sendRequest(allNewTabs[i]);
			
//			chrome.tabs.get(allNewTabs[i], function abcd(tab) { tab })
		}
	}	
}

chrome.tabs.onRemoved.addListener(function (tabId) {
	ob = JSON.parse(localStorage.recentlyClosedTabs);
	ob[tabId] = globalTabRegistry[tabId];
	localStorage.recentlyClosedTabs = JSON.stringify(ob);
	
	updateAllNewTabPages();
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)  {
	ob =  {"title" : tab.title, "url" : tab.url};
	globalTabRegistry[tab.id] = JSON.stringify(ob);
//	allNewTabs[tab.id] = null;
});


chrome.tabs.onCreated.addListener(function (tab) {
	allNewTabs.push(tab.id);
	allNewTabs[tab.id] = tab.id;
//	alert(allNewTabs + "====");
	
	//ob =  {"title" : tab.title, "url" : tab.url};
	//globalTabRegistry[tab.id] = JSON.stringify(ob);
});