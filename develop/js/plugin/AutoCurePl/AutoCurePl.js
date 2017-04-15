function AutoCurePl() {
    this.help = "#";
    this.name = "Автолекарь";
    this.id = "autocure";
    this.master = null;
    this.menuitem = null;
    this.started = false;
    this.enabled = false;
    this.options = {
        l: 0,
        m: 0,
        h: 0,
        l_c: 0,
        m_c: 0,
        h_c: 0,
        recharge: false,
        mode: 0,
        refreshchat: 5,
        keywords: ['легк', 'лёгк', 'тяж', 'средн'],
        kit: 0,
        blacklist: [],
        resethp: false,
        tochat: false,
        tochat_txt: []
    };
    this.handleTimeout = null;
    this.lastMsgID = null;
    this.contentHTML =
        '<div id="' + this.id + '" class="pl_wrap">\
        <div class="pl_section">\
            <div class="pl_section_title">Выбор режима</div>\
                <legend>Режим:</legend>\
                <input type="radio" class="pl_radiobox" id="autocure_auto" name="autocure_mode" value="1"><label for="autocure_auto">Авто</label><br>\
                <input type="radio" class="pl_radiobox" id="autocure_manual" name="autocure_mode" value="2"><label for="autocure_manual">Ручной</label><br>\
                <input type="radio" class="pl_radiobox" id="autocure_combine" name="autocure_mode" value="3"><label for="autocure_combine">Комбинированный</label><br>\
                <div style="text-align: center; padding-top: 10px"><input type="button" id="autocure_start" value="Старт"></div>\
        </div>\
        <div class="pl_section">\
            <div class="pl_section_title">Доп. настройки</div>\
                <input type="checkbox" class="pl_checkbox" id="autocure_recharge" name="autocure_recharge"><label>&nbsp;Автоперезарядка</label><br>\
                <input type="checkbox" class="pl_checkbox" id="autocure_resethp" name="autocure_resethp"><label>&nbsp;Сброс ХП</label><br>\
                <input type="checkbox" class="pl_checkbox" id="autocure_tochat" name="autocure_tochat"><label>&nbsp;Сообщения в чат</label><br>\
                <label for="autocure_refreshchat">Обновление чата: </label><input type="text" class="pl_numbox" id="autocure_refreshchat">сек.\
        </div>\
        <div class="pl_section">\
            <div class="pl_section_title">ID встроек/Цены</div>\
                <legend><b>Легкая</b></legend>\
                id: <input type="text" class="pl_textbox" id="autocure_l">  Цена: <input type="text" class="pl_textbox" id="autocure_l_c">\
                <legend><b>Средняя</b></legend>\
                id: <input type="text" class="pl_textbox" id="autocure_m">  Цена: <input type="text" class="pl_textbox" id="autocure_m_c">\
                <legend><b>Тяжелая</b></legend>\
                id: <input type="text" class="pl_textbox" id="autocure_h">  Цена: <input type="text" class="pl_textbox" id="autocure_h_c"><br><br>\
                <!--<label>Комплект лекаря id:</label>-->\
                <!--<input type="text" class="pl_textbox" id="autocure_kit">-->\
        </div>\
        <div class="pl_section">\
            <div class="pl_section_title">Ключевые слова</div>\
                <legend>Ключевые слова:</legend>\
                <textarea style="min-width:150px;width:200px;height:21px;resize:horizontal;"  id="autocure_keywords" class="pl_textareabox"></textarea>\
                <legend>Фразы для чата</legend>\
                <textarea style="min-width:150px;width:200px;height:21px;resize:horizontal;"  id="autocure_tochat_txt" class="pl_textareabox"></textarea>\
                <legend>Блэклист</legend>\
                <textarea style="min-width:150px;width:200px;height:21px;min-height: 3em;overflow: auto;" id="autocure_blacklist" class="pl_textareabox"></textarea>\
                <input type="button" id="autocure_save" value="Сохранить">\
                <input type="button" id="autocure_load" value="Загрузить">\
        </div>\
    </div>';
    this.Start = function (win) {

    }
    this.ApplyOptions = function () {
        var This = this;
        if (this.master != null) {
            if (this.master.global_options[this.id]) {
                if (this.master.global_options[this.id].enabled)
                    This.Enable();
                else
                    This.Disable();

                if (Object.keys(this.master.global_options[this.id].value).length > 0) {
                    This.options = this.master.global_options[this.id].value;
                }
                else {
                    This.options = {
                        l: 0,
                        m: 0,
                        h: 0,
                        l_c: 0,
                        m_c: 0,
                        h_c: 0,
                        recharge: false,
                        mode: 0,
                        refreshchat: 5,
                        keywords: ['легк', 'лёгк', 'тяж', 'средн'],
                        kit: 0,
                        blacklist: [],
                        resethp: false,
                        tochat: false,
                        tochat_txt: []
                    };
                }
            }
        }
    }
    this.Enable = function () {
        this.enabled = true;
        var mi = this.MenuItem();
        if (mi != null) {
            mi.css('display', 'inherit');
        }
    }
    this.Disable = function () {
        this.enabled = false;
        var mi = this.MenuItem();
        if (mi != null) {
            mi.css('display', 'none');
        }
    }
    this.MenuItem = function () {
        if (this.master != null && this.menuitem == null) {
            var This = this;
            This.mid = this.master.menu_id;
            This.cid = this.master.content_id;
            var menu_item = $('<input type="button" value="' + this.name + '"/>');
            menu_item.bind('click', function () {
                if (This.master.Current != This) {
                    This.master.Current.Dispose();

                }
                This.master.Current = This;
                This.ToggleContent();
            })
            this.menuitem = $(menu_item);
            return this.menuitem;
        } else
            return this.menuitem;
    }
    this.ToggleContent = function () {
        var This = this;

        if (!this.created) {
            $(this.cid).html(this.contentHTML);

            this.master.SetEvents(this, "autocure", "mode");

            if (This.started) {
                $("#autocure_start").val('Стоп');
                $("#autocure_auto").attr('disabled', true);
                $("#autocure_manual").attr('disabled', true);
                $("#autocure_combine").attr('disabled', true);
            }

            $("#autocure_start").bind("click", function () {
                if (!This.started) {
                    This.Begin();
                } else {
                    This.End();
                }
            });

            $("#autocure_save").bind("click", function () {
                var blist = {"blist": This.options.blacklist};
                $.ajax({
                    type: 'POST',
                    data: {'save': blist},
                    url: top.panelDir + "php/blacklist.php"
                });
            });

            $("#autocure_load").bind("click", function () {
                $.ajax({
                    type: "POST",
                    data: {"load": "blist"},
                    url: top.panelDir + "php/blacklist.php",
                    dataType: 'json',
                    success: function (data) {
                        var jstr = func.evalJSON(data);
                        This.options.blacklist = jstr['blist'];
                        This.master.SaveOptions(This.id, This.options);
                        $('#autocure_blacklist').val(This.options.blacklist.join('|'));
                    }
                });
            });

            $("#autocure_resethp").on("change", function () {
                if (This.started) {
                    if (!This.options.resethp) {
                        This.master.plugins['ResetHP'].Stop();
                    } else {
                        This.master.plugins['ResetHP'].Begin();
                    }
                }
            });


            this.created = true;
        } else {
            $("#" + this.id + "").toggle();
        }
        this.master.ResizeFrame();
    }
    this.Dispose = function () {
        this.created = false;
    }
    this.Begin = function () {
        var This = this;
        $("#autocure_start").val("Стоп");
        $("#autocure_auto, #autocure_manual, #autocure_combine").attr('disabled', true);

        if (this.options.resethp) {
            This.master.plugins['ResetHP'].Begin();
        }

        if (!This.started) {
            This.started = true;
            top.ChatDelay = This.options.refreshchat;
            top.RefreshChat();


            switch (This.options.mode) {
                case "1":
                    top.srld = func.addCallListener(top.srld, {
                        after: function (props) {
                            This.ParseChat(top.frames.chat.MsgArray);
                        },
                        error: function (props) {
                            console.log('error', props);
                        }
                    });
                    break;

                case "2":
                    top.AddTo = func.addCallListener(top.AddTo, {
                        before: function (props) {
                            var login = props.args[0];
                            if (props.args[1].altKey) {
                                //if(props.args[1].shiftKey){

                                This.ParseUser(login, function (pinfo) {
                                    //Проверяем блэклист
                                    var resbl = func.search('(' + pinfo['login'] + '|' + pinfo['klan'] + ')', This.options.blacklist.join('|'));
                                    if (resbl && resbl.length >= 1) {
                                        func.message(resbl + ' в черном списке.', 'Автолекарь');
                                        return;
                                    }
                                    if (pinfo['travma'] == 0) {
                                        func.message('У персонажа нет травм', 'Автолекарь');
                                        return;
                                    }
                                    This.Cure(pinfo, function (pinfo) {
                                        if (pinfo['error']) {
                                            func.message(pinfo['result'], 'Автолекарь');
                                            return;
                                        }

                                        if (pinfo['result'].indexOf('исцелен')) {
                                            if (This.options.tochat && This.options.tochat_txt.length >= 1) {
                                                top.frames['bottom'].document.forms[0].text.value = This.options.tochat_txt[Math.floor(Math.random() * This.options.tochat_txt.length)];
                                                top.AddToPrivate(pinfo['login']);
                                                top.frames['bottom'].document.forms[0].submit();
                                            }
                                        }

                                        if (This.options.resethp) {
                                            This.master.plugins['ResetHP'].Begin();
                                        }

                                        func.message(pinfo['result'], 'Автолекарь');
                                        if (pinfo['magic']['id'] != 0) {
                                            This.CheckId(pinfo, function (pinfo) {
                                                if (pinfo['magic']['remains'] == 0) {
                                                    if (This.options.recharge) {
                                                        func.message('Встройка, #id: ' + pinfo['magic']['id'] + ', заряд [' + pinfo['magic']['remains'] + '/' + pinfo['magic']['max'] + ']', 'Автолекарь');
                                                        This.End();

                                                        This.master.CheckRoom(function (ismyroom) {
                                                            if (ismyroom != "Зал Тьмы") {
                                                                This.Begin();
                                                                return;
                                                            }
                                                            func.message("Запомнили комнату " + ismyroom + "");
                                                            This.master.Route('Ремонтная мастерская', function () {
                                                                func.message("До ремонтки дошли, перезаряжаем и валим назад в " + ismyroom + "");
                                                                This.Recharge(pinfo['magic']['id'], function () {
                                                                    This.master.Route(ismyroom, function () {
                                                                        This.master.CheckRoom(function (wehere) {
                                                                            if (wehere == 'Зал Тьмы') {
                                                                                console.log("we here");
                                                                                This.Begin();
                                                                            }
                                                                        });
                                                                    });
                                                                })
                                                            });
                                                        });
                                                    }
                                                    else {
                                                        func.message('Встройка, #id: ' + pinfo['magic']['id'] + ', заряд [' + pinfo['magic']['remains'] + '/' + pinfo['magic']['max'] + ']', 'Автолекарь');
                                                    }
                                                }
                                                else {
                                                    func.message('Встройка, #id: ' + pinfo['magic']['id'] + ', заряд [' + pinfo['magic']['remains'] + '/' + pinfo['magic']['max'] + ']', 'Автолекарь');
                                                }
                                            });
                                        }
                                    });
                                });
                            }
                        },
                        error: function (props) {
                            console.log('error', props);
                        }
                    });
                    break;

                case "3":
                    top.srld = func.addCallListener(top.srld, {
                        after: function (props) {
                            This.ParseChat(top.frames.chat.MsgArray);
                        },
                        error: function (props) {
                            console.log('error', props);
                        }
                    });
                    top.AddTo = func.addCallListener(top.AddTo, {
                        before: function (props) {
                            var login = props.args[0];
                            if (props.args[1].altKey) {
                                This.ParseUser(login, function (pinfo) {
                                    //Проверяем блэклист
                                    var resbl = func.search('(' + pinfo['login'] + '|' + pinfo['klan'] + ')', This.options.blacklist.join('|'));
                                    if (resbl && resbl.length >= 1) {
                                        func.message(resbl + ' в черном списке.', 'Автолекарь');
                                        return;
                                    }
                                    if (pinfo['travma'] == 0) {
                                        func.message('У персонажа нет травм', 'Автолекарь');
                                        return;
                                    }
                                    This.Cure(pinfo, function (pinfo) {
                                        if (pinfo['error']) {
                                            func.message(pinfo['result'], 'Автолекарь');
                                            return;
                                        }

                                        if (pinfo['result'].indexOf('исцелен')) {
                                            if (This.options.tochat && This.options.tochat_txt.length >= 1) {
                                                top.frames['bottom'].document.forms[0].text.value = This.options.tochat_txt[Math.floor(Math.random() * This.options.tochat_txt.length)];
                                                top.AddToPrivate(pinfo['login']);
                                                top.frames['bottom'].document.forms[0].submit();
                                            }
                                        }

                                        if (This.options.resethp) {
                                            This.master.plugins['ResetHP'].Begin();
                                        }

                                        func.message(pinfo['result'], 'Автолекарь');
                                        if (pinfo['magic']['id'] != 0) {
                                            This.CheckId(pinfo, function (pinfo) {
                                                if (pinfo['magic']['remains'] == 0) {
                                                    if (This.options.recharge) {
                                                        func.message('Встройка, #id: ' + pinfo['magic']['id'] + ', заряд [' + pinfo['magic']['remains'] + '/' + pinfo['magic']['max'] + ']', 'Автолекарь');
                                                        This.End();

                                                        This.master.CheckRoom(function (ismyroom) {
                                                            if (ismyroom != "Зал Тьмы") {
                                                                This.Begin();
                                                                return;
                                                            }
                                                            func.message("Запомнили комнату " + ismyroom + "");
                                                            This.master.Route('Ремонтная мастерская', function () {
                                                                func.message("До ремонтки дошли, перезаряжаем и валим назад в " + ismyroom + "");
                                                                This.Recharge(pinfo['magic']['id'], function () {
                                                                    This.master.Route(ismyroom, function () {
                                                                        This.master.CheckRoom(function (wehere) {
                                                                            if (wehere == 'Зал Тьмы') {
                                                                                console.log("we here");
                                                                                This.Begin();
                                                                            }
                                                                        });
                                                                    });
                                                                })
                                                            });
                                                        });
                                                    }
                                                    else {
                                                        func.message('Встройка, #id: ' + pinfo['magic']['id'] + ', заряд [' + pinfo['magic']['remains'] + '/' + pinfo['magic']['max'] + ']', 'Автолекарь');
                                                    }
                                                }
                                                else {
                                                    func.message('Встройка, #id: ' + pinfo['magic']['id'] + ', заряд [' + pinfo['magic']['remains'] + '/' + pinfo['magic']['max'] + ']', 'Автолекарь');
                                                }
                                            });
                                        }
                                    });
                                });
                            }
                        },
                        /*after: function(props) {
                         console.log('after', props);
                         },*/
                        error: function (props) {
                            console.log('error', props);
                        }
                    });
                    break;
            }
        }
    }
    this.End = function () {
        var This = this;
        top.ChatDelay = 15;
        top.NextRefreshChat();
        this.started = false;
        $("#autocure_start").val("Старт");
        $("#autocure_auto, #autocure_manual, #autocure_combine").attr('disabled', false);
        if (this.options.resethp) {
            This.master.plugins['ResetHP'].Stop();
        }

        top.AddTo = function AddTo(login, event) {
            if (window.event) {
                event = window.event;
            }
            if (event && event.ctrlKey) {
                login = login.replace('%', '%25');
                while (login.indexOf('+') >= 0) login = login.replace('+', '%2B');
                while (login.indexOf('#') >= 0) login = login.replace('#', '%23');
                while (login.indexOf('?') >= 0) login = login.replace('?', '%3F');
                window.open('http://capitalcity.oldbk.com/inf.php?login=' + login, '_blank')
            } else {

                var o = top.frames['main'].Hint3Name;

                if ((o != null) && (o != "")) {
                    var login_element = top.frames['main'].document.getElementById(o);
                    if (login_element) {
                        login_element.value = login;
                        login_element.focus();
                    }
                    else {
                        var o = top.frames['main'].document.getElementById("enterlogin");
                        if ((o != null) && (o != "")) {
                            o.value = login;
                            o.focus();
                        } else {
                            top.frames['bottom'].window.document.F1.text.focus();
                            top.frames['bottom'].document.forms[0].text.value = 'to [' + login + '] ' + top.frames['bottom'].document.forms[0].text.value;
                        }
                    }
                } else {
                    var o = top.frames['main'];
                    if (o) {
                        o = o.frames['leftmap'];
                        if (o) {
                            var login_element = o.document.getElementById("jointo");
                            if (login_element != undefined) {
                                login_element.value = login;
                                login_element.focus();
                            }
                            else {
                                top.frames['bottom'].window.document.F1.text.focus();
                                top.frames['bottom'].document.forms[0].text.value = 'to [' + login + '] ' + top.frames['bottom'].document.forms[0].text.value;
                            }
                        } else {
                            top.frames['bottom'].window.document.F1.text.focus();
                            top.frames['bottom'].document.forms[0].text.value = 'to [' + login + '] ' + top.frames['bottom'].document.forms[0].text.value;
                        }
                    }
                }
            }
        }

        top.srld = function srld() {
            if (top.frames['chat'].viewmask[9] == 0)
                top.frames['chat'].window.scrollBy(0, 65000);
        }
    }
    this.ParseChat = function (data, callback) {
        var This = this;
        var msgArr = [];

        for (var i = 0; i < data.length; i++) {
            if (data[i][1] == "1") {
                msgArr.push(data[i][0]);
            }
        }

        var lastMsg = msgArr[msgArr.length - 1];
        if (lastMsg == undefined) return;

        var gpatt = this.options.keywords;
        gpatt = gpatt.join('|');
        //var patt = 'AddTo\\(\\\'(.+?)\\\'\\,.*?id\\=(.+?)\\>\\<font.*?\\>\\s*('+gpatt+')[а-яАёЁ-Я]{0,4}\\<\\/font\\>';
        var patt = 'AddTo\\(\\\'(.+?)\\\'\\,.*?id\\=(.+?)\\>\\<font.*?\\>\\s*(' + gpatt + ')[^кийо\\s]{0,4}\\<\\/font\\>';
        var res = func.search(patt, lastMsg.toString());
        if (res && res.length > 1) {


            var login = res[0];
            var idmsg = res[1];
            var txtmsg = res[2];
            if (idmsg != this.lastMsgID) {
                this.lastMsgID = idmsg;

                this.ParseUser(login, function (pinfo) {
                    //Проверяем блэклист
                    var resbl = func.search('(' + pinfo['login'] + '|' + pinfo['klan'] + ')', This.options.blacklist.join('|'));
                    if (resbl && resbl.length >= 1) {
                        func.message(resbl + ' в черном списке.', 'Автолекарь');
                        return;
                    }

                    if (pinfo["travma"] == 0) {
                        func.message('У персонажа нет травм', 'Автолекарь');
                        return;
                    }

                    This.Cure(pinfo, function (pinfo) {
                        if (pinfo['error']) {
                            func.message(pinfo['result'], 'Автолекарь');
                            if (pinfo['result'] == "У вас не хватает требований для использования этой магии" || pinfo['result'] == "") {
                                This.End();
                            }
                            return;
                        }
                        func.message(pinfo['result'], 'Автолекарь');

                        if (pinfo['result'].indexOf('исцелен')) {
                            if (This.options.tochat && This.options.tochat_txt.length >= 1) {
                                top.frames['bottom'].document.forms[0].text.value = This.options.tochat_txt[Math.floor(Math.random() * This.options.tochat_txt.length)];
                                top.AddToPrivate(pinfo['login']);
                                top.frames['bottom'].document.forms[0].submit();
                            }
                        }

                        if (This.options.resethp) {
                            This.master.plugins['ResetHP'].Begin();
                        }

                        if (pinfo['magic']['id'] != 0) {
                            This.CheckId(pinfo, function (pinfo) {
                                if (pinfo['magic']['remains'] == 0) {
                                    if (This.options.recharge) {
                                        func.message('Встройка, #id: ' + pinfo['magic']['id'] + ', заряд [' + pinfo['magic']['remains'] + '/' + pinfo['magic']['max'] + ']', 'Автолекарь');
                                        This.End();

                                        This.master.CheckRoom(function (ismyroom) {
                                            if (ismyroom != "Зал Тьмы") {
                                                This.Begin();
                                                return;
                                            }
                                            func.message("Запомнили комнату " + ismyroom + "");
                                            This.master.Route('Ремонтная мастерская', function () {
                                                func.message("До ремонтки дошли, перезаряжаем и валим назад в " + ismyroom + "");
                                                This.Recharge(pinfo['magic']['id'], function () {
                                                    This.master.Route(ismyroom, function () {
                                                        This.master.CheckRoom(function (wehere) {
                                                            if (wehere == 'Зал Тьмы') {
                                                                console.log("we here");
                                                                This.Begin();
                                                            }
                                                        });
                                                    });
                                                })
                                            });
                                        });
                                    }
                                    else {
                                        func.message('Встройка, #id: ' + pinfo['magic']['id'] + ', заряд [' + pinfo['magic']['remains'] + '/' + pinfo['magic']['max'] + ']', 'Автолекарь');
                                    }
                                }
                                else {
                                    func.message('Встройка, #id: ' + pinfo['magic']['id'] + ', заряд [' + pinfo['magic']['remains'] + '/' + pinfo['magic']['max'] + ']', 'Автолекарь');
                                }
                            });
                        }
                    });
                });
            } else {
                console.log("Тот же id");
                return;
            }
        } else {
            console.log("совпадений нет");
            return;
        }
    }
    this.ParseUser = function (login, callback) {
        var This = this,
            pinfo = {
                'login': login,
                'travma': 0,
                'klan': '',
                'coast': 0,
                'result': '',
                'magic': {
                    'id': 0,
                    'remains': -1,
                    'max': -1
                },
                'error': false
            };

        func.query("http://capitalcity.oldbk.com/inf.php?login=" + func.strEncode(login) + "&short=1&r=" + Math.random())
            .then(function (data) {
                if (data) {
                    //data = data.split('\n');
                    for (var i = 0; i < data.length; i++) {
                        var i2 = data[i].split('=');
                        var key = i2[0];
                        var val = i2[1];
                        if (key == "travma") {
                            val = parseInt(val, 10);
                            if (isNaN(val)) {
                                console.log('isNaN');
                                return;
                            }
                            pinfo['travma'] = val;
                        }
                        if (key == "klan") {
                            pinfo['klan'] = val;
                        }
                    }
                    callback(pinfo);
                }
            })
            .catch(func.errorLog);
    }
    this.Cure = function (pinfo, callback) {
        //У персонажа нет травм
        //У персонажа нет тяжелых, средних или легких травм...
        //У персонажа нет средних или легких травм...
        //У персонажа нет легких травм...
        var This = this;

        if (pinfo['travma'] == 0) {
            pinfo['error'] = true;
            pinfo['result'] = 'У персонажа нет травм';
            callback(pinfo);
            return;
        }

        if (pinfo['travma'] == 11) {
            pinfo['magic']['id'] = This.options.l;
        }
        else if (pinfo['travma'] == 12) {
            pinfo['magic']['id'] = This.options.m;
        }
        else if (pinfo['travma'] == 13) {
            pinfo['magic']['id'] = This.options.h;
        }

        if (this.options.resethp) {
            This.master.plugins['ResetHP'].Stop();
        }

        var req = func.XHR();
        if (req) {
            req.open('POST', 'main.php?edit=1&use=' + pinfo['magic']['id'], true);
            req.onload = function () {
                var html = req.responseText;
                html = html.split('\n').join('');
                var res = func.search('b\\>?(.+?)\\<\\/.*?\\<HTML', html);
                if (res && res.length > 1) {
                    var errResMsgarr = ['У персонажа нет травм',
                        'У персонажа нет тяжелых, средних или легких травм',
                        'У персонажа нет средних или легких травм',
                        'У персонажа нет легких травм',
                        'Для лечения других персонажей необходима лицензия лекаря',
                        'У вас не хватает требований для использования этой магии'//,
                        //'Свиток рассыпался в ваших руках'
                    ];
                    var errResMsgstr = errResMsgarr.join('|');
                    var res2 = func.search('(' + errResMsgstr + ')', res);
                    if (res2 && res2.length > 1) {
                        pinfo['error'] = true;
                    }
                    console.log(res);
                    pinfo['result'] = res;
                } else {
                    pinfo['result'] = 'Не верно указана встройка или её вообще нет в рюкзаке';
                    pinfo['error'] = true;
                }
                callback(pinfo);
            }
            req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
            req.send('sd4=6&target=' + func.strEncode(pinfo['login']));
        }
    }
    this.CheckId = function (pinfo, callback) {
        var This = this, sum = 0, url = '';

        $.post('/main.php?edit=1&razdel=0&all=1', {
            'ssave': 1,
            'rzd0': 0,
            'rzd1': 1,
            'rzd2': 1,
            'rzd3': 1,
            'rzd4': 1,
            'rzd5': 1
        }, function (data) {
            data = data.split('\n').join('');

            var tr = $("table table table td img[onclick*='" + pinfo['magic']['id'] + "']", data).parent().parent().html();

            var patt = '[^>](\\d+)\\/(\\d+) шт\\.\\<';
            var res = func.search(patt, tr);
            if (res && res.length > 1) {
                var remains = parseInt(res[0], 10);
                var max = parseInt(res[1], 10);
                pinfo['magic']['remains'] = remains;
                pinfo['magic']['max'] = max;
            }
            callback(pinfo);

            $.post('/main.php?edit=1&razdel=0', {
                'ssave': 1,
                'rzd0': 1,
                'rzd1': 1,
                'rzd2': 1,
                'rzd3': 1,
                'rzd4': 1,
                'rzd5': 1
            });
        });

    }
    this.Recharge = function (id, callback) {
        //http://capitalcity.oldbk.com/repair.php?razdel=2&it=320865437

        $.get("/repair.php?razdel=2&it=" + id, function (data) {
            //callback();
            /*var bad = false;
             if(data.indexOf("Войти в счет") > -1) {
             if(!stopEcr)
             $.message('Войдите в личный счёт для перезаряда екровых встроек!', "Перезарядка");
             stopEcr = true, bad = true;
             }
             if(data.indexOf("У вас не хватает еврокредитов") > -1) {
             if(!stopEcr)
             $.message('У вас не хватает еврокредитов!', "Перезарядка");
             stopEcr = true, bad = true;
             }
             if(data.indexOf("У вас не хватает денег") > -1) {
             if(!stopCr)
             $.message('У вас не хватает кредитов!', "Перезарядка");
             stopCr = true, bad = true;
             }
             if(!bad) charge++;

             if(all < 1) {
             var message = "Перезарядка окончена. Вещей перезаряжено: "+charge+". ";
             if(stopEcr) message += "Не все екровые вещи перезаряжены. ";
             if(stopCr) message += "Не все кредовые вещи перезаряжены. ";

             if(dress) {
             This.dressSet('repair-tmp', false, function() {
             $.message(message+"Комплект одет.", "Перезарядка");
             top.frames.main.location.href = top.frames.main.location.href;
             });
             } else {
             $.message(message, "Перезарядка");
             top.frames.main.location.href = top.frames.main.location.href;
             }
             }*/
        }).done(function () {
            callback();
        });
    }
}