top.panelDir = '<%= panelDir %>';
top.mp3 = {
    'dp': new Audio(top.panelDir + "mp3/trap.mp3"),
    'endlab': new Audio(top.panelDir + 'mp3/endlab.mp3')
};

var func = {
    rand: function (list) {
        return list[Math.floor((Math.random() * list.length))];
    },
    search: function (expr, html) {
        var res = html.match(new RegExp(expr, 'i'));
        if (res && res.length > 0) {
            res = res.slice(1, res.length);
            for (var i in res) {
                res[i] = Math.ceil(res[i]) == parseInt(res[i]) ? Math.ceil(res[i]) : res[i];
            }
            return res.length == 1 ? res[0] : res;
        }
        return [];
    },
    searchAll: function (expr, html) {
        var res = html.match(new RegExp(expr, 'ig')), R = [];
        if (res && res.length > 0) {
            for (var src in res) {
                R.push(this.search(expr, res[src]));
            }
        }
        return R;
    },
    strEncode: function (text, fallbackFunc) {
        var _escapeable = /["\\\x00-\x1f\x7f-\x9f]/g;
        var _meta = {'\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\'};
        var encodeFormFieldProc = {
            /**
             * Translation line: Main idea - Force browser Jscript engile to convert this to unicode using current page to build translation map
             */

            XlateLine: // DO NOT EDIT THE LINE BELLOW! It MUST contains single-byte characters with codes from 0x080 to 0xFF (Note: be careful with Copy-n-Paste!)
                'ЂЃ‚ѓ„…†‡€‰Љ‹ЊЌЋЏђ‘’“”•–—?™љ›њќћџ ЎўЈ¤Ґ¦§Ё©Є«¬­®Ї°±Ііґµ¶·ё№є»јЅѕїАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя',

            /**
             * Encodes text value in current browser codepage
             * like regular POST field form encoded when FORM tags posted
             * You can use this function instead of encodeURIComponent
             * @param {String} text Text to encode
             * @param {function} fallbackFunc [Optional] to be called to translate chars that not exist in current codepage
             * @return text param encoded like POST form param
             * @type String
             */

            encode: function (text, fallbackFunc) {
                if (this.isPageOnUTF8()) {
                    // Invalid context: We must not be called on UTF8 pages!
                    throw ('Script [encode_form_field.js] is designed for non-UTF8 pages only, use [encode_form_field_utf8_stub.js] on UTF8');
                    //return(encodeURIComponent(text));
                }

                if (fallbackFunc == null) {
                    // If no fallback is defined, use current default
                    fallbackFunc = this.encodeDefaultFallbackFunc;
                }

                text = '' + text; // Force text to be text

                var len = text.length;

                var result = '';

                var pos, text_char;

                for (var i = 0; i < len; i++) {
                    text_char = text.charAt(i);

                    if (text_char.charCodeAt(0) < 0x80) {
                        result += escape(text_char);
                    } else {
                        pos = this.XlateLine.indexOf(text_char);

                        if (pos >= 0) {
                            result += '%' + (pos + 0x80).toString(16).toUpperCase();
                        } else {
                            result += '' + fallbackFunc(text_char);
                        }
                    }
                }

                return (result);
            },


            /**
             * Default fallback function to be called to translate chars that not exist in current codepage
             * @param {String} charToEncode UNICODE character not found in current CP to encode
             * @return string represents encoded text to send instead of original character
             * @type String
             */

            encodeDefaultFallbackFunc: function (charToEncode) {
                // if incoming unicode character is not in current codepage, you have to translate it somehow
                // Examples of possible fallbacks is here:

                // return(escape(text_char)); // Send char as unicode %uXXXX
                // return('');                // Ignore this char
                // return(escape('?'));       // Send encoded question char
                return ('%26%23' + charToEncode.charCodeAt(0) + '%3B'); // Send &#{code}; [most browsers do this way on FORM encode]
            },

            /**
             * Detects UTF8 encoding. Internal use only.
             * Note: Do not use this script on UTF8 pages!
             * @return true if current encoding is UTF8
             * @type Boolean
             */

            isPageOnUTF8: function () {
                var pattern = 'Рђ'; // Single unicode character in UTF8 (cyrillic letter A)

                if (pattern.length == 1) {
                    return (true); // Converted to single character - UTF8
                } else {
                    return (false);
                }
            }
        };
        if (encodeFormFieldProc.isPageOnUTF8()) {
            // Invalid context: Script must not be used on UTF8 pages!
            throw ('Script [encode_form_field.js] is designed for non-UTF8 pages only, use [encode_form_field_utf8_stub.js] on UTF8');
        }
        return (encodeFormFieldProc.encode(text, fallbackFunc));
    },
    nowTime: function () {
        var now = new Date(Date.now() + (new Date()).getTimezoneOffset());
        var now_time = (now.getHours() < 10 ? '0' + now.getHours() : now.getHours()) + ':' + (now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes());
        var time = now_time.substr(0, 5);
        return time;
    },
    msToTime: function (duration) {
        var milliseconds = parseInt((duration % 1000) / 100)
            , seconds = parseInt((duration / 1000) % 60)
            , minutes = parseInt((duration / (1000 * 60)) % 60)
            , hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return {"hours": hours, "minutes": minutes, "seconds": seconds};
    },
    message: function (text, header, bot) {
        header = header ? header : 'Лог';
        bot = bot ? ' [<a href="javascript:top.AddTo(\'' + bot + '\')"><span oncontextmenu="return OpenMenu(event,4)">' + bot + '</span></a>]' : '';

        var mess = '<span class="date2" oncontextmenu="return false" >' + this.nowTime() + '</span>' +
            '<span class="stext">' + bot + ' <font style="color: #A51818;">&nbsp<b>' + header + '</b>: ' + text + '</font> </span>';

        top.p(mess, 5);
        top.frames["chat"].window.scrollBy(0, 65000);
    },
    cookie: function (name, value, options) {
        if (typeof value != 'undefined') {
            options = options || {};
            if (value === null) {
                value = '';
                options.expires = -1;
            }
            var expires = '';
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                } else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString();
            }

            var path = options.path ? '; path=' + (options.path) : '';
            var domain = options.domain ? '; domain=' + (options.domain) : '';
            var secure = options.secure ? '; secure' : '';
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        } else {
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
    },
    Bind: function (e, d, f) {
        try {
            if (d.addEventListener) {
                d.addEventListener(e, f, false)
            } else {
                d.attachEvent("on" + e, f)
            }
        } catch (ex) {
        }
    },
    sound: function (name) {
        if (top.mp3[name]) {
            top.mp3[name].volume = 1;
            top.mp3[name].play();
        }
    },
    classie: function (window) {
        function classReg(className) {
            return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
        }

        var hasClass, addClass, removeClass;

        if ('classList' in document.documentElement) {
            hasClass = function (elem, c) {
                return elem.classList.contains(c);
            };
            addClass = function (elem, c) {
                elem.classList.add(c);
            };
            removeClass = function (elem, c) {
                elem.classList.remove(c);
            };
        }
        else {
            hasClass = function (elem, c) {
                return classReg(c).test(elem.className);
            };
            addClass = function (elem, c) {
                if (!hasClass(elem, c)) {
                    elem.className = elem.className + ' ' + c;
                }
            };
            removeClass = function (elem, c) {
                elem.className = elem.className.replace(classReg(c), ' ');
            };
        }

        function toggleClass(elem, c, callback) {
            var fn = hasClass(elem, c) ? removeClass : addClass;
            fn(elem, c);
            if (callback) callback(elem);
        }

        window.classie = {
            // full names
            hasClass: hasClass,
            addClass: addClass,
            removeClass: removeClass,
            toggleClass: toggleClass,
            // short names
            has: hasClass,
            add: addClass,
            remove: removeClass,
            toggle: toggleClass
        };
    }(window),
    toJSON: function (o) {
        if (typeof(JSON) == 'object' && JSON.stringify)
            return JSON.stringify(o);
        var type = typeof(o);
        if (o === null)
            return "null";
        if (type == "undefined")
            return undefined;
        if (type == "number" || type == "boolean")
            return o + "";
        if (type == "string")
            return this.quoteString(o);
        if (type == 'object') {
            if (typeof o.toJSON == "function")
                return this.toJSON(o.toJSON());
            if (o.constructor === Date) {
                var month = o.getUTCMonth() + 1;
                if (month < 10)month = '0' + month;
                var day = o.getUTCDate();
                if (day < 10)day = '0' + day;
                var year = o.getUTCFullYear();
                var hours = o.getUTCHours();
                if (hours < 10)hours = '0' + hours;
                var minutes = o.getUTCMinutes();
                if (minutes < 10)minutes = '0' + minutes;
                var seconds = o.getUTCSeconds();
                if (seconds < 10)seconds = '0' + seconds;
                var milli = o.getUTCMilliseconds();
                if (milli < 100)milli = '0' + milli;
                if (milli < 10)milli = '0' + milli;
                return '"' + year + '-' + month + '-' + day + 'T' +
                    hours + ':' + minutes + ':' + seconds + '.' + milli + 'Z"';
            }
            if (o.constructor === Array) {
                var ret = [];
                for (var i = 0; i < o.length; i++)
                    ret.push(this.toJSON(o[i]) || "null");
                return "[" + ret.join(",") + "]";
            }
            var pairs = [];
            for (var k in o) {
                var name;
                var type = typeof k;
                if (type == "number")
                    name = '"' + k + '"'; else if (type == "string")
                    name = this.quoteString(k); else
                    continue;
                if (typeof o[k] == "function")
                    continue;
                var val = this.toJSON(o[k]);
                pairs.push(name + ":" + val);
            }
            return "{" + pairs.join(", ") + "}";
        }
    },
    evalJSON: function (src) {
        if (typeof(JSON) == 'object' && JSON.parse)
            return JSON.parse(src);
        return eval("(" + src + ")");
    },
    secureEvalJSON: function (src) {
        if (typeof(JSON) == 'object' && JSON.parse)
            return JSON.parse(src);
        var filtered = src;
        filtered = filtered.replace(/\\["\\\/bfnrtu]/g, '@');
        filtered = filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
        filtered = filtered.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
        if (/^[\],:{}\s]*$/.test(filtered))
            return eval("(" + src + ")");
        else
            throw new SyntaxError("Error parsing JSON, source is not valid.");
    },
    quoteString: function (string) {
        if (string.match(_escapeable)) {
            return '"' + string.replace(_escapeable, function (a) {
                    var c = _meta[a];
                    if (typeof c === 'string')return c;
                    c = a.charCodeAt();
                    return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
                }) + '"';
        }
        return '"' + string + '"';
    },
    addCallListener: function (funk, callbacks, prevent) {
        var successNumber = 0,
            errorNumber = 0,
            name = funk.name;

        return function () {
            var args = [].slice.call(arguments);
            var result, error;

            var props = {
                args: args,
                self: this,
                name: name
            }

            callbacks.before && callbacks.before(props);

            if (props.args[1] && props.args[1].altKey) return;

            try {
                result = funk.apply(this, arguments);
                props.successNumber = ++successNumber;
                props.result = result;
                props.status = 'success';
                callbacks.success && callbacks.success(props);
            } catch (e) {
                props.errorNumber = ++errorNumber;
                props.error = e;
                props.status = 'error';
                callbacks.error && callbacks.error(props);
            }

            callbacks.after && callbacks.after(props);

            return result;
        }
    },
    in_array: function (needle, haystack) {
        for (var i = 0, len = haystack.length; i < len; i++) {
            if (haystack[i] == needle)
                return true;
        }
        return false;
    },
    param: function (object, encoded) {
        var encodedString = '';
        for (var prop in object) {
            if (object.hasOwnProperty(prop)) {
                if (encodedString.length > 0) {
                    encodedString += '&';
                }
                if(!encoded)
                    encodedString += encodeURI(prop + '=' + object[prop]);
                else
                    encodedString += prop + '=' + object[prop];
            }
        }
        return encodedString;
    },
    query: function (url, data, credentials) {

        return new Promise(function (resolve, reject) {
            try {
                var xhr = new XMLHttpRequest();
                xhr.open((data ? "POST" : "GET"), url, true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                if (credentials) xhr.withCredentials = true;
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        if (this.status == 200) {
                            var html = this.responseText;
                            html = html.replace(/(\n|\r|\t)/g, "");
                            resolve(html);
                            html = null;
                        } else {
                            reject(new Error(this.statusText));
                        }
                    }
                };
                xhr.onerror = function () {
                    reject(new Error(this.statusText));
                };
                xhr.send((data ? data : null));
                xhr = null;
            }
            catch (e) {
                reject(e);
            }

        });

    },
    errorLog: function (err) {
        func.message(err.message, "Error");
    },
    is_allowed: function () {

        return new Promise(function (resolve, reject) {

            var TempId = func.cookie('battle');
            var TempSess = func.cookie("PHPSESSID");

            func.query(top.panelDir + 'php/access.php', 'gid=' + TempId + '&gses=' + TempSess)
                .then(function (data) {
                    data = func.evalJSON(data);
                    if (data) {
                        if (!data.accept) {
                            reject(new Error("Premission denied!"));
                        } else {
                            resolve(data);
                        }
                    }
                    else {
                        reject(new Error("No json data!"));
                    }
                });
        });
    },
    createModel: function (Model) {
        return eval("new " + Model + " ()");
    },
    q: function (window) {
        function q(d) {
            console.log(d);
        }

        window.q = q;
    }(window),
    selectText: function (id) {
        var range;
        if (document.selection) {
            range = document.body.createTextRange();
            range.moveToElementText(document.getElementById(id));
            range.select();
        } else if (window.getSelection) {
            range = document.createRange();
            range.selectNode(document.getElementById(id));
            window.getSelection().addRange(range);
        }
        document.execCommand('copy');
    },
    strip_tags: function (html) {
        var tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    },
    trim_spaces: function (str) {
        return str.replace(/\s\s+/g, ' ');
    },
    getIdByLogin: function (login) {

        return new Promise(function (resolve, reject) {
            func.query("http://capitalcity.oldbk.com/inf.php?login=" + func.strEncode(login) + "&short=1&r=" + Math.random())
                .then(function (html) {
                    var id = func.search("id=(\\d+)", html);
                    resolve(id);
                });
        });

    },
    notify: function (title, body, icon) {
        icon = icon || 'http://i.oldbk.com/i/icon/oldbk_512x512.png';

        function notify() {
            var notification = new Notification(title, {
                lang: 'ru-RU',
                body: body,
                icon: icon
            });
            notification.onclick = function (n) {
                n.preventDefault();
                window.focus();
            };
        }

        if (!("Notification" in window)) {
            alert("Браузер - хлам");
        }
        else if (Notification.permission === "granted") {
            notify();
        }
        else if (Notification.permission === 'default') {
            Notification.requestPermission()
                .then(function (permission) {
                    if (!('permission' in Notification)) {
                        Notification.permission = permission;
                    }
                    if (permission === "granted") {
                        notify();
                    }
                });
        }
        else if (Notification.permission === 'denied') {
            func.message('Низзя', 'Бан');
            func.message(body, title);
        }
    }
};

