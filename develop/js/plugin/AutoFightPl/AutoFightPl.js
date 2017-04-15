function AutoFightPl() {
    this.help = "#";
    this.name = "АвтоВелик";
    this.id = "AutoFight";
    this.master = null;
    this.menuitem = null;
    this.created = false;
    this.mid = null;
    this.cid = null;
    this.enabled = false;
    this.options = {
        areas: {
            hit: [1, 2, 3, 4],
            block: [1, 2, 3, 4]
        },
        life: 0,
        auto: true,
        autovictory: false,
        color: false,
        autoanswer: true,
        answertime: 45,
        settings: false,
        cls: [
            [true, 0, 0],
            [true, 0, 0],
            [true, 0, 0],
            [false, 0, 21]
        ],
        magic_life: 0,
        magic: [0, 0, 0, 0, 0, 0, 0, 0],
        marinad: false,
        suicide: false
    };
    this.contentHTML =
        '<div id="autofight" class="pl_wrap">\
            <div class="pl_section">\
                <div class="pl_section_title">Запуск</div>\
                    <input id="af_start" type="button" value="Старт" />\
                    <!--<input id="af_options" type="button" value="Опции" />-->\
                    <div id="af_opt">\
                         <input style="margin-top:2px" id="af_auto" class="pl_checkbox" type="checkbox"/>Автостарт&nbsp;<br />\
                         <input id="af_color" class="pl_checkbox" type="checkbox"/>Окраска по классам<br>\
                         <input id="af_settings" class="pl_checkbox" type="checkbox"/>Ручная настройка противников.<br />\
                         <input id="af_autovictory" class="pl_checkbox" type="checkbox"/>Победа по тайму<br />\
                         <input id="af_marinad" class="pl_checkbox" type="checkbox"/>Маринад<br>\
                         *эксперементальная функция<br>\
                         <input id="af_suicide" class="pl_checkbox" type="checkbox"/>Суицид =)<br>\
                    </div>\
            </div>\
            <div class="pl_section">\
                <div class="pl_section_title">Удар/Блок</div>\
                    <table>\
                        <tr>\
                             <td>\
                                 <input id="af_attack_1" class="pl_checkbox" type="checkbox"/>В голову<br />\
                                 <input id="af_attack_2" class="pl_checkbox" type="checkbox"/>В корпус<br />\
                                 <input id="af_attack_3" class="pl_checkbox" type="checkbox"/>В пояс<br />\
                                 <input id="af_attack_4" class="pl_checkbox" type="checkbox"/>В ноги<br />\
                             </td>\
                             <td>\
                                 <input id="af_defend_1" class="pl_checkbox" type="checkbox"/>Голову<br />\
                                 <input id="af_defend_2" class="pl_checkbox" type="checkbox"/>Корпус<br />\
                                 <input id="af_defend_3" class="pl_checkbox" type="checkbox"/>Пояс<br />\
                                 <input id="af_defend_4" class="pl_checkbox" type="checkbox"/>Ноги<br />\
                             </td>\
                        </tr>\
                    </table>\
            </div>\
            <div class="pl_section">\
                <div class="pl_section_title">Доп.настройки</div>\
                    <table>\
                        <tr>\
                             <td>\
                                Остановиться при HP менее:&nbsp;\
                             </td>\
                             <td>\
                                <input id="af_life" class="pl_numbox" type="text" value="0" />*0-до упора\
                             </td>\
                        </tr>\
                        <tr>\
                             <td>\
                                Автохил при HP менее:\
                             </td>\
                             <td>\
                                <input id="af_magic_life" class="pl_numbox" type="text" value="0" />*0-не использовать\
                             </td>\
                        </tr>\
                        <tr>\
                             <td>\
                                <input id="af_autoanswer" class="pl_checkbox" type="checkbox"/>Автоответ после:\
                             </td>\
                             <td>\
                                <input id="af_answertime" class="pl_numbox" type="text" value="45" />сек.\
                             </td>\
                        </tr>\
                        <tr>\
                             <td>\
                             </td>\
                             <td>\
                             </td>\
                        </tr>\
                    </table>\
            </div>\
            <div class="pl_section">\
                <div class="pl_section_title">Выбор класса</div>\
                    <table border="0" cellspacing="0" cellpadding="0">\
                        <tr style="background-color:#d0d0d0;">\
                            <td>Бьем танков:</td>\
                            <td>\
                                <input id="af_cls_1" class="pl_checkbox" type="checkbox"/>\
                                мин. ур. <input id="af_minlvl_1" class="pl_numbox" type="text" value="0" />\
                                макс. ур. <input id="af_maxlvl_1" class="pl_numbox" type="text" value="0" />\
                            </td>\
                        </tr>\
                        <tr style="background-color:#d9ffd9;">\
                            <td>\
                                Бьем уворотов:\
                            </td>\
                            <td>\
                                <input id="af_cls_2" class="pl_checkbox" type="checkbox"/>\
                                мин. ур. <input id="af_minlvl_2" class="pl_numbox" type="text" value="0" />\
                                макс. ур. <input id="af_maxlvl_2" class="pl_numbox" type="text" value="0" />\
                            </td>\
                        </tr>\
                        <tr style="background-color:#d9d9ff;">\
                            <td>\
                                Бьем критов:\
                            </td>\
                            <td>\
                                <input id="af_cls_3" class="pl_checkbox" type="checkbox"/>\
                                мин. ур. <input id="af_minlvl_3" class="pl_numbox" type="text" value="0" />\
                                макс. ур. <input id="af_maxlvl_3" class="pl_numbox" type="text" value="0" />\
                            </td>\
                        </tr>\
                        <tr>\
                            <td>\
                                Бьем невидимок:\
                            </td>\
                            <td>\
                                <input id="af_cls_4" class="pl_checkbox" type="checkbox"/> *макс.ур.=0 - бьем всех, выше мин.ур.\
                            </td>\
                        </tr>\
                    </table>\
            </div>\
            <div class="pl_section">\
                <div class="pl_section_title">Хил</div>\
                <table>\
                    <tr>\
                        <td>\
                            <input id="af_h0" class="pl_numbox r_textbox" type="text" value="0" /> встройки<br />\
                            <input id="af_h1" class="pl_numbox r_textbox" type="text" value="0" /> хилка 60<br />\
                            <input id="af_h2" class="pl_numbox r_textbox" type="text" value="0" /> хилка 90<br />\
                            <input id="af_h3" class="pl_numbox r_textbox" type="text" value="0" /> хилка 120\
                        </td>\
                        <td>\
                            <input id="af_h4" class="pl_numbox r_textbox" type="text" value="0" /> хилка 150<br />\
                            <input id="af_h5" class="pl_numbox r_textbox" type="text" value="0" /> хилка 180<br />\
                            <input id="af_h6" class="pl_numbox r_textbox" type="text" value="0" /> хилка 270<br />\
                            <input id="af_h7" class="pl_numbox r_textbox" type="text" value="0" /> хилка 360\
                        </td>\
                    </tr>\
                </table>\
            </div>\
        </div>';
    this.started = false;
    this.handleTimeout = null;
    this.BattleID = 0;
    this.BattleTimeOut = 0;
    this.BattleWin = null;
    this.MyID = 0;
    this.DP = false;
    this.LastStrike = 0;
    this.corpse = false;
    this.Enemies = {};
    this.BattleOrder = [];
    this.AutoTime = {};
    this.AutoTimeM = {};
    this.Start = function (win) {
        if (win.document.URL.indexOf("fbattle.php") != -1) {
            if (this.enabled) {
                this.BattleWin = win;
                var NewBattleID = parseInt($("input[name=batl]", win.document.body).val(), 10);
                if (isNaN(NewBattleID)) {
                    clearTimeout(this.handleTimeout);
                    this.Attack();
                    return;
                }
                if (NewBattleID != this.BattleID) {
                    this.BattleID = NewBattleID;
                    var pattern = /href="?inf\.php\?(\d+)"? target/i;
                    var res = $("td[width=250]:first", win.document.body).html().match(pattern);
                    if (res && res.length > 1) this.MyID = res[1];
                    this.DP = false;
                    this.GetFighters();
                    return;
                }
                clearTimeout(this.handleTimeout);
                this.Attack();
            }
        }
    }
    this.Begin = function () {
        if (!this.enabled) {
            alert("Плагин выключен. Перейдите в пункт верхнего меню *Настройки* и включите его");
        } else {
            this.started = true;
            $("#af_start", document).val('Стоп');
            this.Attack();
        }
    }
    this.End = function () {
        this.started = false;
        $("#af_start", document).val('Старт');
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
                        areas: {
                            hit: [1, 2, 3, 4],
                            block: [1, 2, 3, 4]
                        },
                        life: 0,
                        auto: true,
                        autovictory: false,
                        autoanswer: true,
                        color: false,
                        answertime: 45,
                        settings: false,
                        cls: [
                            [true, 0, 0],
                            [true, 0, 0],
                            [true, 0, 0],
                            [false, 0, 21]
                        ],
                        magic_life: 0,
                        magic: [0, 0, 0, 0, 0, 0, 0, 0],
                        marinad: false,
                        suicide: false
                    };
                }
            }
        }
    }
    this.Enable = function () {
        this.enabled = true;
        var mi = this.MenuItem();
        if (mi != null) mi.css('display', 'inherit');
    }
    this.Disable = function () {
        this.enabled = false;
        var mi = this.MenuItem();
        if (mi != null) mi.css('display', 'none');
    }
    this.MenuItem = function (redraw) {
        if (this.master != null && (this.menuitem == null || redraw)) {
            var This = this;
            This.mid = this.master.menu_id;
            This.cid = this.master.content_id;
            // var menu_item = $('<a href="#" title="' + this.name + '"><div class="pbtn3" title="' + this.name + '"></div></a>');
            var menu_item = $('<input type="button" value="' + this.name + '"/>');
            menu_item.bind('click', function () {
                if (This.master.Current != This) {
                    This.master.Current.Dispose();
                }

                This.master.Current = This;
                This.ToggleContent();
            });
            this.menuitem = $(menu_item);
        }
        return this.menuitem;
    }
    this.ToggleContent = function () {
        var This = this;
        if (!this.created) {
            $(this.cid, document).html(this.contentHTML);
            if (this.started)
                $("#af_start", document).val("Стоп");

            $("#af_start", document).bind("click", function () {
                if (!This.started) This.Begin();
                else This.End();
            });
            $("#af_options", document).bind("click", function () {
                if ($("#autofight td:eq(2)", document).css("display") == "none")
                    $("#autofight td:gt(1),#af_opt", document).show();
                else
                    $("#autofight td:gt(1),#af_opt", document).hide();
                This.master.ResizeFrame();
            });
            $("#autofight .pl_checkbox", document).change(function () {
                if (this.id == "af_auto") {
                    This.options.auto = $(this).is(":checked");
                }
                else if (this.id == "af_autoanswer") {
                    This.options.autoanswer = $(this).is(":checked");
                }
                else if (this.id == "af_settings") {
                    This.options.settings = $(this).is(":checked");
                }
                else if (this.id.indexOf("af_cls_") != -1) {
                    var option = parseInt(this.id.replace('af_cls_', ''), 10) - 1;
                    This.options.cls[option][0] = $(this).is(":checked");
                }
                else if (this.id == "af_autovictory") {
                    This.options.autovictory = $(this).is(":checked");
                }
                else if (this.id == "af_color") {
                    This.options.color = $(this).is(":checked");
                }
                else if (this.id == "af_marinad") {
                    This.options.marinad = $(this).is(":checked");
                }
                else if (this.id == "af_suicide") {
                    This.options.suicide = $(this).is(":checked");
                }
                else {
                    This.options.areas.block.splice(0, This.options.areas.block.length);
                    This.options.areas.hit.splice(0, This.options.areas.hit.length);
                    $("#autofight .pl_checkbox:checked", document).each(function () {
                        if (this.id.indexOf('af_attack') != -1) {
                            var option = this.id.replace('af_attack_', '');
                            option = parseInt(option, 10);
                            if (!isNaN(option))
                                This.options.areas.hit.push(option);
                        } else if (this.id.indexOf('af_defend') != -1) {
                            var option = this.id.replace('af_defend_', '');
                            option = parseInt(option, 10);
                            if (!isNaN(option))
                                This.options.areas.block.push(option);
                        }
                    });
                }
                This.master.SaveOptions(This.id, This.options);
            });
            $("#autofight .pl_numbox, .r_textbox", document).keydown(function (e) {
                var key = e.charCode || e.keyCode || 0;
                return (key == 8 || key == 46 || (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
            });
            $("#autofight .pl_numbox, .r_textbox", document).keyup(function () {
                if (this.id == 'af_life') This.options.life = parseInt($(this).val(), 10);
                if (this.id == 'af_magic_life') This.options.magic_life = parseInt($(this).val(), 10);
                if (this.id == 'af_answertime') This.options.answertime = parseInt($(this).val(), 10);
                if (this.id.indexOf("af_minlvl_") != -1) {
                    var option = parseInt(this.id.replace('af_minlvl_', '')) - 1;
                    This.options.cls[option][1] = parseInt($(this).val(), 10);
                }
                if (this.id.indexOf("af_maxlvl_") != -1) {
                    var option = parseInt(this.id.replace('af_maxlvl_', '')) - 1;
                    This.options.cls[option][2] = parseInt($(this).val(), 10);
                }
                if (this.id.indexOf('af_h') != -1) {
                    var i = parseInt(this.id.replace('af_h', ''), 10);
                    This.options.magic[i] = parseInt($(this).val(), 10);
                }
                This.master.SaveOptions(This.id, This.options);
            });
            $(this.options.areas.hit).each(function () {
                $("#af_attack_" + this, document).attr("checked", "checked");
            });
            $(this.options.areas.block).each(function () {
                $("#af_defend_" + this, document).attr("checked", "checked");
            });
            $('#af_life', document).val(this.options.life);
            $('#af_magic_life', document).val(this.options.magic_life);
            $('#af_answertime', document).val(this.options.answertime);
            if (this.options.auto) $('#af_auto', document).attr("checked", "checked");
            if (this.options.autoanswer) $('#af_autoanswer', document).attr("checked", "checked");
            if (this.options.settings) $('#af_settings', document).attr("checked", "checked");
            if (this.options.autovictory) $('#af_autovictory', document).attr("checked", "checked");
            if (this.options.color) $('#af_color', document).attr("checked", "checked");
            if (this.options.marinad) $('#af_marinad', document).attr("checked", "checked");
            if (this.options.suicide) $('#af_suicide', document).attr("checked", "checked");


            for (var i = 0; i < this.options.cls.length; i++) {
                if (This.options.cls[i][0]) $("#af_cls_" + (i + 1), document).attr("checked", "checked");
                $("#af_minlvl_" + (i + 1), document).val(This.options.cls[i][1]);
                $("#af_maxlvl_" + (i + 1), document).val(This.options.cls[i][2]);
            }
            ;
            for (var i = 0; i < this.options.magic.length; i++) $('#af_h' + i, document).val(this.options.magic[i]);
            this.created = true;
        } else {
            $("#autofight", document).toggle();
        }
        this.master.ResizeFrame();
    }
    this.Dispose = function () {
        this.created = false;
        this.MenuItem().css("background-color", "");
    }
    this.ChangeEnemy = function (doc, login) {
        var This = this;

        var dt = 1000;
        if (dt < 1) dt = 1;

        if (doc.location == null) {
            this.handleTimeout = setTimeout(function () {
                This.ChangeEnemy(top.frames['main'].document, func.strEncode(login));
            }, dt);
        }
        else {
            this.handleTimeout = setTimeout(function () {
                doc.location.href = "http://capitalcity.oldbk.com/fbattle.php?login_target=" + func.strEncode(login);
            }, dt);
        }

    }
    this.SetAreas = function (doc) {
        var at = this.options.areas.hit;
        if (at.length == 0)
            at = [1, 2, 3, 4];
        var i = at.length;
        var inx = Math.floor(Math.random() * i);
        $("#A" + at[inx], doc.body).click();
        var def = this.options.areas.block;
        if (def.length == 0)
            def = [1, 2, 3, 4];
        var i = def.length;
        var inx = Math.floor(Math.random() * i);
        $("#D" + def[inx], doc.body).click();
    }
    this.GetFighters = function () {
        var This = this;

        func.query("logs.php?log=" + this.BattleID)
            .then(function (data) {
                if (data.indexOf('> (Противостояние) <IMG') != -1) This.DP = true;

                if (This.BattleTimeOut == 0) {
                    var regexp = /Бой идет с таймаутом (\d+) мин\./i;
                    var result = data.match(regexp);
                    if (result && result.length > 1) {
                        This.BattleTimeOut = parseInt(result[1], 10) * 60;
                    }
                }

                var pattern = /<B>(.*?)<\/B> \[(\d+|\?\?)\]<a href=inf\.php\?(\d+) target/g;
                res = data.match(pattern);
                if (res && res.length > 1) {
                    pattern = /<B>(.*?)<\/B> \[(\d+|\?\?)\]<a href=inf\.php\?(\d+) target/i;
                    if (This.DP) plevel = This.master.user.level;
                    else plevel = 0;
                    for (var i in res) {
                        var pers_info = res[i].match(pattern);
                        if (pers_info && pers_info.length > 1) {
                            if (pers_info[2] == "??" || pers_info[3].length == 10) {
                                This.Enemies[pers_info[3]] = {
                                    name: "<i>Невидимка</i>",
                                    level: plevel,
                                    cls: 4,
                                    order: 0,
                                    s: ""
                                };
                            } else {
                                plevel = parseInt(pers_info[2], 10);
                                This.Enemies[pers_info[3]] = {
                                    name: pers_info[1],
                                    level: parseInt(pers_info[2], 10),
                                    cls: 0,
                                    order: 0,
                                    s: ""
                                };
                            }
                        }
                    }
                }
                if (This.options.auto) This.Begin();
                else This.Attack();
            })
            .catch(func.errorLog);
    }
    this.CheckEnemies = function (doc, enemy) {
        /**
         * cls:0 - неопознан
         * cls:1 - танк
         * cls:2 - уворот
         * cls:3 - крит
         * cls:4 - невидимка
         */
        var Enemies = {};
        var Order = [];
        var minArr = [];
        var maxArr = [];
        for (var i = 0; i < 3; i++) {
            if (this.options.cls[i][0]) {
                minArr.push(this.options.cls[i][1]);
                maxArr.push(this.options.cls[i][2]);
            }
        }

        var min_level = Math.min.apply(Math, minArr);
        var max_level = Math.min.apply(Math, maxArr) == 0 ? 0 : Math.max.apply(Math, maxArr);


        var itsme = $("#" + this.MyID, doc.body);
        var s = $("#mes span", doc.body);
        for (var i = 0; i < s.length; i++) {
            if (s[i].outerHTML.indexOf("ChangeEnemy") != -1 && itsme.attr("class") != $(s[i]).attr("class")) {
                if (this.Enemies[s[i].id] === undefined) {
                    if (s[i].id.length == 10)
                        Enemies[s[i].id] = {
                            name: "<i>Невидимка</i>",
                            level: (this.DP ? this.master.user.level : 0),
                            cls: 4,
                            red: (s[i].className == "B3"),
                            order: 0,
                            s: false
                        };
                    else if (s[i].innerHTML != this.master.user.name) {
                        Enemies[s[i].id] = {
                            name: s[i].innerHTML,
                            level: 0,
                            cls: 0,
                            red: (s[i].className == "B3"),
                            order: 0,
                            s: false
                        };
                        Order.push([s[i].id, Enemies[s[i].id].order]);
                    }
                } else {
                    Enemies[s[i].id] = this.Enemies[s[i].id];
                    Enemies[s[i].id].red = (s[i].className == "B3");

                    if (this.options.color)
                        $(s[i]).css("background", (Enemies[s[i].id].cls == 1 ? "#d0d0d0" : (Enemies[s[i].id].cls == 2 ? "#d9ffd9" : (Enemies[s[i].id].cls == 3 ? "#d9d9ff" : ""))));

                    if (this.AutoTime[s[i].id] === undefined && s[i].className == "B3" && Enemies[s[i].id].level >= parseInt(this.master.user.level, 10) - 1 && Enemies[s[i].id].level <= parseInt(this.master.user.level, 10) + 1) {
                        this.AutoTime[s[i].id] = (new Date()).getTime();
                    }


                    if (this.options.marinad) {
                        Order.push([s[i].id, Enemies[s[i].id].order]);
                    }
                    else {
                        if (!this.options.marinad && this.Enemies[s[i].id].cls == 0 && (min_level <= this.Enemies[s[i].id].level && (max_level == 0 || max_level >= this.Enemies[s[i].id].level) || this.Enemies[s[i].id].level == 0)) {
                            Order.push([s[i].id, Enemies[s[i].id].order]);
                        }
                        else if (this.Enemies[s[i].id].s) {
                            Order.push([s[i].id, Enemies[s[i].id].order]);
                        }
                        else if (!this.options.marinad && this.Enemies[s[i].id].cls != 0 && this.options.cls[this.Enemies[s[i].id].cls - 1][0] && this.options.cls[this.Enemies[s[i].id].cls - 1][1] <= this.Enemies[s[i].id].level &&
                            (this.options.cls[this.Enemies[s[i].id].cls - 1][2] == 0 || this.options.cls[this.Enemies[s[i].id].cls - 1][2] >= this.Enemies[s[i].id].level)) {
                            Order.push([s[i].id, Enemies[s[i].id].order]);
                        }
                    }

                }
                if (this.options.settings) $(s[i]).prepend("<input type='checkbox' " + (Enemies[s[i].id].s ? "checked " : "") + "onclick='top.window.PM.plugins[\"AutoFight\"].Enemies[" + s[i].id + "].s = this.checked;'>");
            }
        }
        if (Enemies[enemy].cls == 0) {
            var pattern = /<B>.*?<\/B> \[(\d+)\]<a href="inf\.php/i;
            var res = $("td[width=250]:last", doc.body).html().match(pattern);
            if (res && res.length > 1) {
                Enemies[enemy].level = parseInt(res[1], 10);
                pattern = /Сила: (\d+)<br>Ловкость: (\d+)<br>Интуиция: (\d+)<br>Выносливость: (\d+)<br>/i;
                res = $("td[width=250]:last", doc.body).html().match(pattern);
                if (res && res.length > 1) {
                    if (parseInt(res[2], 10) > parseInt(res[3], 10) && parseInt(res[2], 10) > parseInt(res[1], 10)) Enemies[enemy].cls = 2;
                    else if (parseInt(res[3], 10) > parseInt(res[1], 10)) Enemies[enemy].cls = 3;
                    else Enemies[enemy].cls = 1;
                } else {
                    console.log("Ошибка определения параметров: " + enemy);
                    console.log(res);
                }
            }
            if (this.options.color)
                $("#" + enemy, doc.body).css("background", (Enemies[enemy].cls == 1 ? "#d0d0d0" : (Enemies[enemy].cls == 2 ? "#d9ffd9" : (Enemies[enemy].cls == 3 ? "#d9d9ff" : ""))));
        }
        Order.sort(function (a, b) {
            if (a[1] > b[1]) return 1;
            else if (a[1] < b[1]) return -1;
            else return 0;
        });
        this.Enemies = Enemies;
        this.BattleOrder = Order;
    }
    this.CheckEnemy = function (doc, enemy) {
        var This = this;

        if (this.options.autoanswer) {
            if (!(this.AutoTime[enemy] === undefined)) {
                if ((new Date()).getTime() - this.AutoTime[enemy] >= this.options.answertime * 1000 && this.Enemies[enemy].red) return true;
                else if (!this.Enemies[enemy].red) delete this.AutoTime[enemy];
            }
            for (var id in this.AutoTime) {
                if (this.Enemies[id] === undefined)
                    delete this.AutoTime[id];
                else if (this.Enemies[id].cls != 4 && (new Date()).getTime() - this.AutoTime[id] >= this.options.answertime * 1000 && this.Enemies[id].red) {
                    //this.LastStrike = (new Date()).getTime();
                    this.ChangeEnemy(doc, this.Enemies[id].name);
                    return false;
                } else if (!this.Enemies[id].red) delete this.AutoTime[id];
            }
        }

        if (this.options.marinad) {
            var btlltmt = (this.BattleTimeOut * 1000) - 20000;
            //var btlltmt = (This.BattleTimeOut * 1000) - 590000;
            if (this.LastStrike == 0) {
                this.LastStrike = (new Date()).getTime();
            }
            if ((new Date()).getTime() - this.LastStrike >= btlltmt) {
                return true;
            }
        }

        if (this.Enemies[enemy].cls != 0) {
            if (this.Enemies[enemy].s) return true;

            if (this.options.cls[this.Enemies[enemy].cls - 1][0] && this.options.cls[this.Enemies[enemy].cls - 1][1] <= this.Enemies[enemy].level &&
                (this.options.cls[this.Enemies[enemy].cls - 1][2] == 0 || this.options.cls[this.Enemies[enemy].cls - 1][2] >= this.Enemies[enemy].level) && !this.options.marinad) {
                return true;
            }
        }

        for (var i in this.BattleOrder) {
            var id = this.BattleOrder[i][0];
            this.Enemies[id].order++;
            if (this.Enemies[id].cls == 0 && this.Enemies[id].name != "<i>Невидимка</i>") {
                this.handleTimeout = setTimeout(function () {
                    //This.LastStrike = (new Date()).getTime();
                    This.ChangeEnemy(doc, This.Enemies[id].name);
                }, (This.options.marinad) ? 2000 : 1000);
                return false;
            } else if (this.Enemies[id].name != "<i>Невидимка</i>") {
                this.handleTimeout = setTimeout(function () {
                    //This.LastStrike = (new Date()).getTime();
                    This.ChangeEnemy(doc, This.Enemies[id].name);
                }, (This.options.marinad) ? 2000 : 1000);
                return false;
            }
        }
        if (this.options.suicide) {
            return true;
        }
        this.handleTimeout = setTimeout(function () {
            doc.location.href = "http://capitalcity.oldbk.com/fbattle.php?batl=" + This.BattleID
        }, 1000);
        return false;
    }
    this.KeyPressed = function (win, e) {
        var evt = (win.event) ? win.event : e;
        var key = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode : ((evt.which) ? evt.which : 0));
        if (key == 32) {
            if (this.started) this.End();
            else this.Begin();
            if (e.preventDefault) e.preventDefault();
            else return false;
        }
        else if (key == 13) {
            if (!this.started) {
                $("#go", win.body).click();
                if (e.preventDefault) e.preventDefault();
                else return false;
            }
        }
    }
    this.Attack = function () {

        var This = this;
        var doc = this.BattleWin.document;

        func.Bind('keypress', doc, function (e) {
            This.KeyPressed(doc, e);
        });

        if (doc.body.innerHTML.indexOf('>Бой закончен! Всего вами нанесено урона') != -1) {
            this.BattleID = 0;
            this.BattleTimeOut = 0;
            this.Enemies = {};
            this.BattleOrder = [];
            this.AutoTime = {};
            this.AutoTimeM = {};
            this.LastStrike = 0;
            this.End();
            if (!this.corpse) {
                This.master.NeedRepair();
                this.corpse = true;
            }
            $("input[name=end]", doc.body).click();
        }
        else if (doc.body.innerHTML.indexOf('>Ожидаем хода противника...') != -1) {
            if (this.started)
                this.handleTimeout = setTimeout(function () {
                    doc.location.href = "http://capitalcity.oldbk.com/fbattle.php";
                    //$("input[name=battle]", doc.body).click();
                }, 2000);
        }
        else if (doc.body.innerHTML.indexOf('>Ожидаем, пока бой закончат другие игроки...') != -1) {
            if (this.started)
                this.handleTimeout = setTimeout(function () {
                    // $("input[name=battle]", doc.body).click();
                    //top.frames["main"].location.href = "http://capitalcity.oldbk.com/fbattle.php";
                    doc.location.href = "http://capitalcity.oldbk.com/fbattle.php";
                }, 5000);
        }
        else if (doc.body.innerHTML.indexOf('>Противник долго не делает свой ход, вы можете закончить бой победителем') != -1) {
            if (this.options.autovictory) {
                this.End();
                $("input[name=victory_time_out]", doc.body).click();
                return true;
            }
        }
        else {
            this.corpse = false;
            var CurrentEnemy = parseInt($("input[name=enemy1]", doc.body).val(), 10);
            var span_html = $("#" + CurrentEnemy, doc.body)[0].outerHTML;
            $("#" + CurrentEnemy, doc.body)[0].outerHTML = "<img src='http://i.oldbk.com/i/fighttype30.gif'>" + span_html;
            this.SetAreas(doc);
            this.CheckEnemies(doc, CurrentEnemy);
            if (this.started) {
                var check = this.CheckEnemy(doc, CurrentEnemy);
                if (check) {
                    var myHP = 0;
                    var rhp = /(\d+?)\/(\d+)/mi;
                    var res = doc.getElementsByName('HP1')[0].nextSibling.innerHTML.match(rhp);
                    if (res.length > 1) myHP = parseInt(res[1], 10);

                    if (myHP > 0 && this.options.magic_life > 0 && this.options.magic_life > myHP) {
                        if (this.CheckHeal(doc)) return;
                    }
                    if (myHP > 0 && this.options.life > 0 && this.options.life > myHP) {
                        this.End();
                        alert('Уровень жизни достиг ограничения!');
                    } else {
                        //var dt = 1000 + this.LastStrike - (new Date()).getTime();
                        var dt = (this.options.marinad) ? 2000 : 1000;
                        //if (dt < 1) dt = 1;

                        this.handleTimeout = setTimeout(function () {
                            This.LastStrike = (new Date()).getTime();
                            $("#go", doc.body).click();
                        }, dt);
                    }
                }
            }
        }
    }
    this.Heal = function (doc, id) {
        this.BattleWin.location = 'fbattle.php?use=' + id + '&enemy=' + $("#penemy", doc).val() + '&defend=' + $("#txtblockzone", doc).val();
    }
    this.CheckHeal = function (doc) {
        var heal_order = [];
        for (var i = 0; i < 8; i++) {
            if (this.options.magic[i] > 0) heal_order[this.options.magic[i]] = i;
        }
        for (var i in heal_order) {
            if (heal_order[i] == 0) {
                var pattern = /fbattle\.php\?use=(\d+)[\s\S]*?Встроена магия: (.*?)\'/i;
                var res = $('body', doc).html().match(pattern);
                if (res && res.length > 0) {
                    this.Heal(doc, res[1]);
                    return true;
                }
            } else {
                var pattern = /fbattle\.php\?use=(\d+)[\s\S]{150,230}Восстановление\s*(?:энергии)?\s*(\d+)HP/ig;
                var res = $('body', doc).html().match(pattern);
                if (res && res.length > 0) {
                    pattern = /fbattle\.php\?use=(\d+)[\s\S]{150,230}Восстановление\s*(?:энергии)?\s*(\d+)HP/i;
                    for (var h = 0; h < res.length; h++) {
                        heal = res[h].match(pattern);
                        if (heal && heal.length > 0) {
                            if (heal_order[i] == 1 && heal[2] == 60) {
                                this.Heal(doc, heal[1]);
                                return true;
                            }
                            if (heal_order[i] == 2 && heal[2] == 90) {
                                this.Heal(doc, heal[1]);
                                return true;
                            }
                            if (heal_order[i] == 3 && heal[2] == 120) {
                                this.Heal(doc, heal[1]);
                                return true;
                            }
                            if (heal_order[i] == 4 && heal[2] == 150) {
                                this.Heal(doc, heal[1]);
                                return true;
                            }
                            if (heal_order[i] == 5 && heal[2] == 180) {
                                this.Heal(doc, heal[1]);
                                return true;
                            }
                            if (heal_order[i] == 6 && heal[2] == 270) {
                                this.Heal(doc, heal[1]);
                                return true;
                            }
                            if (heal_order[i] == 7 && heal[2] == 360) {
                                this.Heal(doc, heal[1]);
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }
}