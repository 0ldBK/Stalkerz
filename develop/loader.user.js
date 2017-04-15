// ==UserScript==
// @name			<%= client %> plugin
// @namespace		<%= panelDir %>
// @description		Панель плагинов для OldBK
// @author          <%= client %>
// @version			<%= version %>
// @include			http://*.oldbk.com/*
// @match			http://*.oldbk.com/*
// @updateURL 		<%= updateURL %>
// @downloadURL		<%= downloadURL %>
// @icon			http://i.oldbk.com/i/icon/oldbk_48x48.png
// @grant 			none
// ==/UserScript==

var Loader = {

    called: false,

    base_url: "<%= panelDir %>",

    attr: function (el, at, value) {
        at = {'for': 'htmlFor', 'class': 'className'}[at] || at;
        if (!value) {
            return el[at] || el.getAttribute(at) || '';
        }
        else {
            if (at == 'style') {
                el.style.cssText = value;
                return;
            }

            el[at] = value;

            if (el.setAttribute) {
                el.setAttribute(at, value);
            }
        }
    },

    newElem: function (tag, params) {
        params = params || {};
        var elem = document.createElementNS ? document.createElementNS('http://www.w3.org/1999/xhtml', tag) : document.createElement(tag);

        for (var pr in params) {
            this.attr(elem, pr, params[pr]);
        }

        return elem;
    },

    append: function (el, where) {
        (where || document.body).appendChild(el);
    },

    core: function () {
        var This = this;
        return new Promise(function (resolve) {
            var uid = document.cookie.match(/battle=([^;]+)/i);
            var session = document.cookie.match(/PHPSESSID=([^;]+)/i);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", This.base_url + 'php/panel.php', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        var json = JSON.parse(this.responseText);
                        if (json) {
                            resolve(json.data);
                        }
                    }
                }
            };
            xhr.send('gid=' + uid[1] + '&gses=' + session[1] + '&cache=' + Math.random());
        });
    },

    ready: function () {

        var This = this, head;

        if (document.URL.indexOf("/battle.php") != -1 && (window == window.top)) {
            this.settings_panel();
            head = document.getElementsByTagName("head");
            head = (head.length > 0) ? head[0] : document.body;

            var css = this.newElem('link', {
                type: "text/css",
                href: This.base_url + "css/core.css",
                rel: "stylesheet"
            });
            this.append(css, head);

            var jstorage = document.createElement("script");
            jstorage.setAttribute("type", "text/javascript");
            jstorage.setAttribute("charset", "utf-8");
            jstorage.setAttribute("src", This.base_url + "js/lib/jStorage.js");
            jstorage.onload = function () {
                This.core()
                    .then(function (data) {
                        if (data) {
                            var core = This.newElem('script', {
                                type: "text/javascript",
                                charset: "utf-8",
                                src: data
                            });
                            This.append(core, head);
                        }
                    });

            };
            head.appendChild(jstorage);
        }
        else if (document.URL.indexOf("/refreshed.html") != -1 && window.name == "plfr") {

            head = document.getElementsByTagName("head");
            head = (head.length > 0) ? head[0] : document.body;

            var global_js = this.newElem('script', {
                type: "text/javascript",
                charset: "utf-8",
                src: "http://capitalcity.oldbk.com/i/globaljs.js"
            });
            this.append(global_js, head);
            global_js = null;

            var showthing_js = this.newElem('script', {
                type: "text/javascript",
                charset: "utf-8",
                src: "i/showthing.js"
            });
            this.append(showthing_js, head);
            showthing_js = null;

            var m_css = this.newElem('link', {
                type: "text/css",
                href: "http://i.oldbk.com/i/main.css",
                rel: "stylesheet"
            });
            this.append(m_css, head);
            m_css = null;

            var fr_css = this.newElem('link', {
                type: "text/css",
                href: This.base_url + "css/frame.css",
                rel: "stylesheet"
            });
            this.append(fr_css, head);
            fr_css = null;

            document.body.style.backgroundColor = "#d7d7d7";
            head = null;
        }
        else if (window != window.top) {
            head = document.getElementsByTagName("head");
            head = (head.length > 0) ? head[0] : document.body;

            var global_js = this.newElem('script', {
                type: "text/javascript",
                charset: "utf-8",
                src: "http://capitalcity.oldbk.com/i/globaljs.js"
            });
            this.append(global_js, head);
            global_js = null;


            var js_raise_event = this.newElem('script', {type: "text/javascript", charset: "utf-8"});
            js_raise_event.text = '(function() {\n' +
                '	var timeout_h = null;\n' +
                '	function navigate_event() {\n' +
                '		clearTimeout(timeout_h);\n' +
                '			try {\n' +
                '				if (typeof(top.window.PM) == "undefined") {\n' +
                '					timeout_h = setTimeout(function() { navigate_event(); }, 500);\n' +
                '				} else {\n' +
                '					if (top.window.PM.finished) {\n' +
                '						timeout_h = top.window.PM.FrameReLoad(window);\n' +
                '					} else {\n' +
                '						timeout_h = setTimeout(function() { navigate_event(); }, 1000);\n' +
                '					}\n' +
                '				}\n' +
                '			} catch (e) {\n' +
                '				timeout_h = setTimeout(function() { navigate_event(); }, 500);\n' +
                '			}\n' +
                '	}\n' +
                '	navigate_event();\n' +
                '})();';
            this.append(js_raise_event, head);
            js_raise_event = null;

            head = null;
        }
    },

    settings_panel: function () {
        document.getElementsByName("main")[0].outerHTML = '<frameset id="plfs" framespacing="0" border="0" frameborder="0" cols="*,0">' +
            '	<frame name="main" src="main.php?top=' + Math.random() + '">' +
            '	<frame name="plfr" src="refreshed.html">' +
            '</frameset>';


        var b = document.body,
            f = this.newElem('div', {
                id: 'settings'
            });
        b.parentNode.appendChild(f);
    },

    contentLoaded: function (win, fn) {

        var done = false, top = true,

            doc = win.document,
            root = doc.documentElement,
            modern = doc.addEventListener,

            add = modern ? 'addEventListener' : 'attachEvent',
            rem = modern ? 'removeEventListener' : 'detachEvent',
            pre = modern ? '' : 'on',

            init = function (e) {
                if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
                (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
                if (!done && (done = true)) fn.call(win, e.type || e);
            },

            poll = function () {
                try {
                    root.doScroll('left');
                } catch (e) {
                    setTimeout(poll, 50);
                    return;
                }
                init('poll');
            };

        if (doc.readyState == 'complete') fn.call(win, 'lazy');
        else {
            if (!modern && root.doScroll) {
                try {
                    top = !win.frameElement;
                } catch (e) {
                }
                if (top) poll();
            }
            doc[add](pre + 'DOMContentLoaded', init, false);
            doc[add](pre + 'readystatechange', init, false);
            win[add](pre + 'load', init, false);
        }

    },

    init: function (w) {
        var This = this;
        this.contentLoaded(w, function () {
            This.ready();
        });
    }


};
Loader.init(window);