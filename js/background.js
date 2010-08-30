globalTabRegistry = new Array();
localStorage.recentlyClosedTabs = JSON.stringify(new Array());
allNewTabs = new Array();

function updateAllNewTabPages() {
	// all opened 'new tab' pages have to be updated
	// so that they show the latest closed tabs

	for (i = 0; i < allNewTabs.length; i++) {
		if (allNewTabs[i] != null)
			chrome.tabs.sendRequest(allNewTabs[i], {});
	}	
}

chrome.tabs.onRemoved.addListener(function (tabId) {	
	tab = JSON.parse(globalTabRegistry[tabId]);
	
	if (tab["url"] != "chrome://newtab/") {
		obj = JSON.parse(localStorage.recentlyClosedTabs);
		// items have to be in order how they were close, 
		// not how they have been created
		obj.push(globalTabRegistry[tabId]); 
		localStorage.recentlyClosedTabs = JSON.stringify(obj);

		updateAllNewTabPages();
	}
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)  {
	ob =  {"title" : tab.title, "url" : tab.url};
	globalTabRegistry[tab.id] = JSON.stringify(ob);
	allNewTabs[tab.id] = null;
});


chrome.tabs.onCreated.addListener(function (tab) {
	allNewTabs.push(tab.id);
	allNewTabs[tab.id] = tab.id;
});