var PluginFrame = top.window;
var PluginRuins = PluginFrame.PM.plugins["Ruins"];

function rw(name, id, align, klan, level, slp, trv, deal, battle, war, r, rk, hh) {
	var fight = '';
	var altext = '';
	var txt = '';

	if (align.length > 0) {
		if (align > 1 && align < 2 && klan != "FallenAngels") altext = "Паладин";
		if (align > 1 && align < 2 && klan == "FallenAngels") altext = "Падший ангел";
		if ( align == 3 ) altext = "Тёмный";
		if ( align == 2 ) altext = "Нейтрал";
		if ( align == 6 ) altext = "Светлый";
		if ( align == 1 ) altext = "Светлый";
		if ( align == "2.4") altext = "Нейтрал";
		align = '<img src="http://i.oldbk.com/i/align_'+align+'.gif" title="'+altext+'" width=12 height=15>';
	}

	if (battle > 0) { fight = '2'}
	if (klan.length > 0) { klan = '<A HREF="http://oldbk.com/encicl/klani/clans.php?clan='+klan+'" target=_blank><img src="http://i.oldbk.com/i/klan/'+klan+'.gif" title="'+klan+'" ></A>';}
	if (deal == 1 && id != 7363) { klan += '<img src="http://i.oldbk.com/i/deal.gif" width=15 height=15 title="Дилер">';}

	color = "";
	if (r > 0) {
		if (r == 1) {
			color = "blue";
		}
		if (r == 2) {
			color = "red";
		}
	}
	if (PluginRuins.master.user.name == name) {
		PluginRuins.Team = color;
	}
	colorstart = "<font color="+color+">";
	colorend = "</font>";
	if (color.length == 0) {
		colorstart = "";
		colorend = "";
	}
	keyowner = "";
	if (rk > 0) keyowner = " <img border=0 src=\"http://i.oldbk.com/i/sh/ruin_k.gif\"> ";

	txt = keyowner+'<img OnClick="top.AddToPrivate(\''+name+'\', top.CtrlPress,event); return false;" src="http://i.oldbk.com/i/lock'+fight+'.gif" style="cursor:pointer;" title="Приват" width=20 height=15></A>'+align+klan+'<span OnClick="top.AddTo(\''+name+'\',event); return false;" class="ahm" style="cursor:pointer;">'+colorstart+name+colorend+'</span>['+level+']<a href="http://capitalcity.oldbk.com/inf.php?'+id+'" target=_blank title="Инф. о '+name+'">'+'<IMG SRC="http://i.oldbk.com/i/inf.gif" WIDTH=12 HEIGHT=11 BORDER=0 ALT="Инф. о '+name+'"></a>';
	if (slp>0) { txt += ' <IMG SRC="http://i.oldbk.com/i/sleep2.gif" WIDTH=24 HEIGHT=15 BORDER=0 ALT="Наложено заклятие молчания">'; }
	if (PluginRuins.Team != color) {
		txt += ' <b><a style="color: maroon" href=# onclick="AttackRuins(\''+name+'\');"> X</a></b>';
	}
	txt += '<BR>';
	return txt;
}

function AttackRuins(name) {
	top.frames['main'].findlogin('Напасть на','ruines.php','attack');
	PluginFrame.$("#attack", top.frames['main'].document.body).val(name);
	// PluginFrame.$("input", top.frames['main'].document.body)[3].click();
	PluginFrame.$("input[type='submit']", top.frames['main'].document.body)[1].click();
}

function RuinsChat() {
	var i1 = document.body.innerHTML.indexOf("w('");
	if (i1 != -1) {
		var i2 = document.body.innerHTML.indexOf("</script>", i1);
		var i3 = document.body.innerHTML.indexOf("</td>", i2);
		var logins = document.body.innerHTML.substring(i1, i2).replace(/w\(/g, "rw(").split(";");
		var txt = '';
		for (var i = 0; i < logins.length - 1; i++) {
			txt += eval(logins[i]);
		}
		document.body.innerHTML = document.body.innerHTML.substring(0, i1) + "</script>\n" + txt + "\n" + document.body.innerHTML.substring(i3);
	}
}

RuinsChat();