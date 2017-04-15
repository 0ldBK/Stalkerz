function RestalPl() {
    this.help = "#";
    this.name = "Ристалка";
    this.id = "Restal";
    this.master = null;
    this.menuitem = null;
    this.created = false;
    this.mid = null;
    this.cid = null;
    this.enabled = false;
    this.bots = {//Фoбoс (kлoн 31)
        l7: ["Дикий охотник [7]", "Жрица огня [7]", "Одержимость [7]", "Одержимый раб [7]", "Поработитель [7]", "Посланец смерти [7]", "Сгусток грязи [7]", "Каменный страж [8]", "Невольник [8]", "Огненный страж [8]", "Cын Ареса [14]"],
        l8: ["Дикий охотник [7]", "Жрица огня [7]", "Одержимость [7]", "Одержимый раб [7]", "Поработитель [7]", "Посланец смерти [7]", "Сгусток грязи [7]", "Каменный страж [8]", "Невольник [8]", "Огненный страж [8]", "Сын Ареса [11]"],
        l9: ["Бронт [8]", "Медуза [8]", "Алкионей [9]", "Бриарей [9]", "Гиес [9]", "Котт [9]", "Паллант [9]", "Стероп [9]", "Сфено [9]", "Эвриала [9]", "Аэлла [10]", "Сын Ареса [11]"],
        l10: ["Бронт [8]", "Медуза [8]", "Алкионей [9]", "Бриарей [9]", "Гиес [9]", "Паллант [9]", "Сфено [9]", "Эвриала [9]", "Apг [10]", "Аэлла [10]", "Сын Ареса [11]", "Фобоc [11]", "Сын Аресa [12]"],
        l11: ["Медуза [8]", "Алкионей [9]", "Паллант [9]", "Астерий [11]", "Гидра [11]", "Грифон [11]", "Сын Ареса [11]", "Фобоc [11]", "Сын Аресa [12]", "Cын Ареса [14]"],
        l12: ["Алкионей [9]", "Паллант [9]", "Астерий [11]", "Гидра [11]", "Грифон [11]", "Сын Ареса [11]", "Сын Аресa [12]", "Фобос [12]", "Cын Ареса [14]"],
        l13: ["Алкионей [9]", "Паллант [9]", "Астерий [11]", "Гидра [11]", "Грифон [11]", "Сын Ареса [11]", "Сын Аресa [12]", "Фобос [12]", "Фoбoс [13]", "Cын Ареса [14]"]
    };
    this.options = {
        areas: {hit: [1, 2, 3, 4], block: [1, 2, 3, 4]},
        life: 0,
        auto: false,
        minhp: 0,
        maxhp: 0,
        magic_life: 0,
        magic: [0, 0, 0, 0, 0, 0, 0, 0],
        bots: {}
    };
    this.contentHTML =
        '<div id="restal" class="pl_wrap">\
            <div class="pl_section">\
                <div class="pl_section_title">Запуск</div>\
                    <input id="r_start" type="button" value="Старт" />\
                    <!--<input id="restal_options" type="button" value="Опции" />-->\
                <div>\
                    <input style="margin-top:2px" id="restal_auto" class="pl_checkbox" type="checkbox"/>Автостарт&nbsp;<br />\
                </div>\
            </div>\
            <div class="pl_section">\
                <div class="pl_section_title">Удар/Блок</div>\
                    <table>\
                        <tr>\
                            <td>\
                                <input id="r_attack_1" class="pl_checkbox" type="checkbox"/>В голову<br />\
                                <input id="r_attack_2" class="pl_checkbox" type="checkbox"/>В корпус<br />\
                                <input id="r_attack_3" class="pl_checkbox" type="checkbox"/>В пояс<br />\
                                <input id="r_attack_4" class="pl_checkbox" type="checkbox"/>В ноги<br />\
                            </td>\
                            <td>\
                                <input id="r_defend_1" class="pl_checkbox" type="checkbox"/>Голову<br />\
                                <input id="r_defend_2" class="pl_checkbox" type="checkbox"/>Корпус<br />\
                                <input id="r_defend_3" class="pl_checkbox" type="checkbox"/>Пояс<br />\
                                <input id="r_defend_4" class="pl_checkbox" type="checkbox"/>Ноги<br />\
                            </td>\
                        </tr>\
                    </table>\
            </div>\
            <div class="pl_section">\
                <div class="pl_section_title">Автохил/ХП для ударов</div>\
                    <table>\
                        <tr>\
                            <td>\
                                Остановиться при HP менее:\
                            </td>\
                            <td>\
                                <input id="r_life" class="pl_numbox" type="text" value="0" />*0-до упора\
                            </td>\
                        </tr>\
                        <tr>\
                            <td>\
                                Автохил при HP менее:\
                            </td>\
                            <td>\
                                <input id="r_magic_life" class="pl_numbox" type="text" value="0" />*0-не использовать\
                            </td>\
                        </tr>\
                        <tr>\
                            <td>\
                                Не бить мобов с HP менее:\
                            </td>\
                            <td>\
                                <input id="r_minhp" class="pl_numbox" type="text" value="0" />*0-не следить\
                            </td>\
                        </tr>\
                        <tr>\
                            <td>\
                                Не бить мобов с HP более:\
                            </td>\
                            <td>\
                                <input id="r_maxhp" class="pl_numbox" type="text" value="0" />*0-не следить\
                            </td>\
                        </tr>\
                    </table>\
            </div>\
            <div class="pl_section">\
                <div class="pl_section_title">Автохил</div>\
                    <table>\
                        <tr>\
                            <td>\
                                <input id="r_h0" class="pl_numbox r_textbox" type="text" value="0"/> встройки<br />\
                                <input id="r_h1" class="pl_numbox r_textbox" type="text" value="0" /> хилка 60<br />\
                                <input id="r_h2" class="pl_numbox r_textbox" type="text" value="0" /> хилка 90<br />\
                                <input id="r_h3" class="pl_numbox r_textbox" type="text" value="0" /> хилка 120\
                            </td>\
                            <td>\
                                <input id="r_h4" class="pl_numbox r_textbox" type="text" value="0" /> хилка 150<br />\
                                <input id="r_h5" class="pl_numbox r_textbox" type="text" value="0" /> хилка 180<br />\
                                <input id="r_h6" class="pl_numbox r_textbox" type="text" value="0" /> хилка 270<br />\
                                <input id="r_h7" class="pl_numbox r_textbox" type="text" value="0" /> хилка 360\
                            </td>\
                        </tr>\
                    </table>\
            </div>\
            <div class="pl_section">\
                <div class="pl_section_title">Выбор мобов</div>\
                    <table>\
                        <tr>\
                            <td valign="top" >\
                                Не бьем:<br/><select id="r_bots1" multiple size=4></select>\
                            </td>\
                            <td style="width:5px;display:none"></td>\
                            <td valign="middle" >\
                                <input id="r_right" type="button" value=">>>"><br/>\
                                <input id="r_left" type="button" value="<<<">\
                            </td>\
                            <td style="width:5px;display:none"></td>\
                            <td valign="top" >\
                                Бьем:<br/><select id="r_bots" multiple size=4></select>\
                            </td>\
                        </tr>\
                    </table>\
            </div>\
        </div>';
    this.started = false;
    this.BattleID = 0;
    this.BattleWin = null;
    this.LastStrike = 0;
    this.Enemies = {};
    this.Start = function (win) {
        if (win.document.URL.indexOf("fbattle.php") != -1) {
            if (this.enabled) {
                this.BattleWin = win;
                var NewBattleID = parseInt($("input[name=batl]", win.document.body).val(), 10);
                if (isNaN(NewBattleID))
                    return;
                if (NewBattleID != this.BattleID) {
                    this.BattleID = NewBattleID;
                    if (this.options.auto == 1) {
                        this.Begin();
                        return;
                    }
                }
                this.Attack();
            }
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
    this.CheckEnemies = function (doc) {
        var This = this;
        var Enemies = {};
        $("#mes span", doc.body).each(function () {
            if (this.outerHTML.indexOf("ChangeEnemy") != -1) {
                var Enemy = this.innerHTML.replace(/\s+\(kлoн \d+\)/, "");
                if (This.Enemies[this.id]) Enemies[this.id] = This.Enemies[this.id];
                else Enemies[this.id] = {name: Enemy, level: 0, HP: 0, maxHP: 0};
                var pattern = new RegExp('>' + this.innerHTML.replace('(', '\\(').replace(')', '\\)') + '<\\/span><\\/u> \\[(\\d+)\\/(\\d+)\\]');
                var res = $("#mes", doc.body).html().match(pattern);
                if (res && res.length > 1) {
                    Enemies[this.id].HP = res[1];
                    Enemies[this.id].maxHP = res[2];
                }
            }
        });
        this.Enemies = Enemies;
    }
    this.CheckEnemy = function (doc, enemy) {
        if (this.Enemies[enemy].level == 0) {
            var pattern = /<B>.*?<\/B> \[(\d+)\]<a href="inf\.php/i;
            var res = $("td[width=250]:last", doc.body).html().match(pattern);
            if (res && res.length > 1) {
                this.Enemies[enemy].level = parseInt(res[1], 10);
                this.Enemies[enemy].name += " [" + res[1] + "]";
            }
        }
        if (this.Enemies[enemy].name in this.options.bots && (this.options.minhp == 0 || this.Enemies[enemy].HP >= this.options.minhp) && (this.options.maxhp == 0 || this.Enemies[enemy].HP <= this.options.maxhp)) return true;
        else {
            for (var id in this.Enemies) {
                if (this.Enemies[id].level == 0 || this.Enemies[id].name in this.options.bots && (this.options.minhp == 0 || this.Enemies[id].HP >= this.options.minhp) && (this.options.maxhp == 0 || this.Enemies[id].HP <= this.options.maxhp)) {
                    this.LastStrike = (new Date()).getTime();
                    $("#" + id, doc.body).click();
                    return false;
                }
            }
            if (this.started) setTimeout(function () {
                $("img[alt=Обновить]", doc.body).parent().click();
            }, 500);
            return false;
        }
    }
    this.Attack = function () {
        var This = this;
        var doc = this.BattleWin.document;
        if (doc.body.innerHTML.indexOf('>Бой закончен! Всего вами нанесено урона') != -1) {
            this.BattleID = 0;
            this.End();
            $("input[name=end]", doc.body).click();
        } else if (doc.body.innerHTML.indexOf('>Ожидаем хода противника...') != -1) {
            setTimeout(function () {
                $("input[name=battle]", doc.body).click();
            }, 500);
        } else if (doc.body.innerHTML.indexOf('>Ожидаем, пока бой закончат другие игроки...') != -1) {
            setTimeout(function () {
                $("input[name=battle]", doc.body).click();
            }, 5000);
        } else {
            var CurrentEnemy = parseInt($("input[name=enemy1]", doc.body).val(), 10);
            var span_html = $("#" + CurrentEnemy, doc.body)[0].outerHTML;
            $("#" + CurrentEnemy, doc.body)[0].outerHTML = "<img src='http://i.oldbk.com/i/fighttype30.gif'>" + span_html;
            this.SetAreas(doc);
            this.CheckEnemies(doc);

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
                        var dt = 1000 + this.LastStrike - (new Date()).getTime();
                        if (dt < 0) dt = 0;
                        setTimeout(function () {
                            This.LastStrike = (new Date()).getTime();
                            $("#go", doc.body).click();
                        }, dt);
                    }
                }
            }
        }
    }
    this.Begin = function () {
        if (!this.enabled) {
            alert("Плагин выключен. Перейдите в пункт верхнего меню *Настройки* и включите его");
        } else {
            if (!this.started && this.BattleID != 0) {
                if (this.BattleWin != null) {
                    this.started = true;
                    $("#r_start").val('Стоп');
                    this.Attack();
                } else {
                    alert("Окно боя еще не привязано. Первый удар нанесите сами");
                }
            }
        }
    }
    this.End = function () {
        this.started = false;
        $("#r_start").val('Старт');
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
                        auto: false,
                        minhp: 0,
                        maxhp: 0,
                        magic_life: 0,
                        magic: [0, 0, 0, 0, 0, 0, 0, 0],
                        bots: {}
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
    this.MenuItem = function () {
        if (this.master != null && this.menuitem == null) {
            var This = this;
            This.mid = this.master.menu_id;
            This.cid = this.master.content_id;
            var menu_item = $('<input type="button" value="Ристалка"/>');
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

            $(this.bots["l" + this.master.user.level]).each(function (i, bot) {
                if (bot in This.options.bots)
                    $("#r_bots").append($("<option value=" + i + ">" + bot + "</option>"));
                else
                    $("#r_bots1").append($("<option value=" + i + ">" + bot + "</option>"));
            });
            $("#r_right").bind("click", function () {
                if ($("#r_bots1").val()) {
                    This.options.bots[$("#r_bots1 option:selected").text()] = true;
                    $("#r_bots").append($("<option value=" + $("#r_bots1").val() + ">" + $("#r_bots1 option:selected").text() + "</option>"));
                    $("#r_bots1 option:selected").remove();
                }
                This.master.SaveOptions(This.id, This.options);
            });
            $("#r_left").bind("click", function () {
                if ($("#r_bots").val()) {
                    delete This.options.bots[$("#r_bots option:selected").text()];
                    $("#r_bots1").append($("<option value=" + $("#r_bots").val() + ">" + $("#r_bots option:selected").text() + "</option>"));
                    $("#r_bots option:selected").remove();
                }
                This.master.SaveOptions(This.id, This.options);
            });

            if (this.started) {
                $("#r_start").val("Стоп");
            }
            $("#r_start").bind("click", function () {
                if (!This.started) This.Begin();
                else This.End();
            });
            $("#r_options").bind("click", function () {
                if ($("#restal td:eq(2)").css("display") == "none")
                    $("#restal td:gt(1),#r_opt").show();
                else
                    $("#restal td:gt(1),#r_opt").hide();
                This.master.ResizeFrame();
            });
            $("#restal .pl_checkbox").change(function () {
                if (this.id == "r_auto") {
                    This.options.auto = $(this).is(":checked");
                } else {
                    This.options.areas.block.splice(0, This.options.areas.block.length);
                    This.options.areas.hit.splice(0, This.options.areas.hit.length);
                    $("#restal .pl_checkbox:checked").each(function () {
                        if (this.id.indexOf('r_attack') != -1) {
                            var option = this.id.replace('r_attack_', '');
                            option = parseInt(option, 10);
                            if (!isNaN(option))
                                This.options.areas.hit.push(option);
                        } else if (this.id.indexOf('r_defend') != -1) {
                            var option = this.id.replace('r_defend_', '');
                            option = parseInt(option, 10);
                            if (!isNaN(option))
                                This.options.areas.block.push(option);
                        }
                    });
                }
                This.master.SaveOptions(This.id, This.options);
            });

            $("#restal .pl_numbox, .r_textbox").keydown(function (e) {
                var key = e.charCode || e.keyCode || 0;
                return (key == 8 || key == 46 || (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
            });
            $("#restal .pl_numbox,.r_textbox").keyup(function () {
                if (this.id == 'r_life') {
                    This.options.life = parseInt($(this).val(), 10);
                }
                if (this.id == 'r_magic_life') {
                    This.options.magic_life = parseInt($(this).val(), 10)
                }
                ;
                if (this.id == 'r_minhp') {
                    This.options.minhp = parseInt($(this).val(), 10);
                }
                if (this.id == 'r_maxhp') {
                    This.options.maxhp = parseInt($(this).val(), 10);
                }
                if (this.id.indexOf('r_h') != -1) {
                    var i = parseInt(this.id.replace('r_h', ''), 10);
                    This.options.magic[i] = parseInt($(this).val(), 10);
                }
                This.master.SaveOptions(This.id, This.options);
            });
            $(this.options.areas.hit).each(function () {
                $("#r_attack_" + this).attr("checked", "checked");
            });
            $(this.options.areas.block).each(function () {
                $("#r_defend_" + this).attr("checked", "checked");
            });
            $('#r_life').val(this.options.life);
            $('#r_magic_life').val(this.options.magic_life);
            $('#r_minhp').val(this.options.minhp);
            $('#r_maxhp').val(this.options.maxhp);
            for (var i = 0; i < 8; i++) $('#r_h' + i).val(this.options.magic[i]);
            if (this.options.auto) $('#r_auto').attr("checked", "checked");
            this.created = true;
        } else {
            $("#restal").toggle();
        }
        this.master.ResizeFrame();
    }
    this.Dispose = function () {
        this.created = false;
        this.MenuItem().css("background-color", "");
    }
    this.Heal = function (doc, id) {
        this.BattleWin.location = 'fbattle.php?use=' + id + '&enemy=' + $("#penemy", doc).val() + '&defend=' + $("#txtblockzone", doc).val();
    }
    this.CheckHeal = function (doc) {
        var heal_order = [], pattern, res;
        for (var i = 0; i < 8; i++) {
            if (this.options.magic[i] > 0) heal_order[this.options.magic[i]] = i;
        }
        for (var i in heal_order) {
            if (heal_order[i] == 0) {
                pattern = /fbattle\.php\?use=(\d+)[\s\S]*?Встроена магия: (.*?)\'/i;
                res = $('body', doc).html().match(pattern);
                if (res && res.length > 0) {
                    this.Heal(doc, res[1]);
                    return true;
                }
            } else {
                pattern = /fbattle\.php\?use=(\d+)[\s\S]{150,230}Восстановление\s*(?:энергии)?\s*(\d+)HP/ig;
                res = $('body', doc).html().match(pattern);
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