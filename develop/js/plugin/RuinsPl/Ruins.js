var PluginFrame = top.window;
var PluginRuins = PluginFrame.PM.plugins["Ruins"];

function ShowMap() {
	var loc = "fight";
	if (document.URL.indexOf("/ruines.php") != -1) {
		var i1 = document.body.innerHTML.indexOf('<td class="H3" align="right">');
		var i2 = document.body.innerHTML.indexOf('&nbsp;', i1);
		loc = document.body.innerHTML.substr(i1 + 29, i2 - i1 - 29);
	}
	if (PluginRuins.RuinsFrame < 2) {
		var html_doc = document.getElementsByTagName("head");
		if (html_doc.length > 0)
			html_doc = html_doc[0];
		else
			html_doc = document.body;
		var js_plugin = document.createElement("script");
		js_plugin.setAttribute("type", "text/javascript");
		js_plugin.setAttribute("src", "<%= panelDir %>js/plugin/RuinsPl/RuinsMap.js?" + Math.random());
		js_plugin.setAttribute("charset", "utf-8");
		html_doc.appendChild(js_plugin);
		js_plugin = null;
		PluginRuins.RuinsFrame = 2;
	} else {
		top.frames["plfr"].RefreshMap(loc);
	}
}

ShowMap();