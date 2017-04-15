function AutoUdarPl() {
    this.help = "#";
    this.name = "АвтоУдар";
    this.id = "AutoUdar";
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
        auto: false,
        magic_life: 0,
        magic: [0, 0, 0, 0, 0, 0, 0, 0, 0]
    };
    this.started = false;
    this.handleTimeout = null;
    this.BattleID = 0;
    this.BattleWin = null;
    this.LastStrike = 0;
    this.corpse = false;
    this.contentHTML =
        '<div id="autoudar" class="pl_wrap">\
            <div class="pl_section">\
                <div class="pl_section_title">Запуск</div>\
                <input id="autoudar_start" type="button" value="Старт" /><br>\
                <input style="margin-top:2px" id="autoudar_auto" class="pl_checkbox" type="checkbox"/>Автостарт\
            </div>\
            <div class="pl_section">\
                <div class="pl_section_title">Удар/Блок</div>\
                 <table>\
                     <tr>\
                         <td>\
                             <input id="autoudar_attack_1" class="pl_checkbox" type="checkbox"/>В голову<br />\
                             <input id="autoudar_attack_2" class="pl_checkbox" type="checkbox"/>В корпус<br />\
                             <input id="autoudar_attack_3" class="pl_checkbox" type="checkbox"/>В пояс<br />\
                             <input id="autoudar_attack_4" class="pl_checkbox" type="checkbox"/>В ноги<br />\
                         </td>\
                         <td>\
                             <input id="autoudar_defend_1" class="pl_checkbox" type="checkbox"/>Голову<br />\
                             <input id="autoudar_defend_2" class="pl_checkbox" type="checkbox"/>Корпус<br />\
                             <input id="autoudar_defend_3" class="pl_checkbox" type="checkbox"/>Пояс<br />\
                             <input id="autoudar_defend_4" class="pl_checkbox" type="checkbox"/>Ноги<br />\
                         </td>\
                     </tr>\
                 </table>\
            </div>\
            <div class="pl_section">\
                <div class="pl_section_title">Автохил</div>\
                <table>\
                    <tr>\
                        <td>\
                            <input id="autoudar_life"" class="pl_numbox" type="text" value="0" />Остановиться при HP менее&nbsp;*0-до упора<br />\
                            <input id="autoudar_magic_life"" class="pl_numbox" type="text" value="0" />Автохил при HP менее&nbsp;*0-не использовать\
                        </td>\
                    </tr>\
                    <tr>\
                        <td>\
                            <div style="display: inline-table">\
                            <input id="autoudar_h0" class="pl_numbox r_textbox" type="text" value="0" /> встройки<br />\
                            <input id="autoudar_h1" class="pl_numbox r_textbox" type="text" value="0" /> хилка 60<br />\
                            <input id="autoudar_h2" class="pl_numbox r_textbox" type="text" value="0" /> хилка 90<br />\
                            <input id="autoudar_h3" class="pl_numbox r_textbox" type="text" value="0" /> хилка 120<br />\
                            </div>\
                            <div style="display: inline-table">\
                            <input id="autoudar_h4" class="pl_numbox r_textbox" type="text" value="0" /> хилка 150<br />\
                            <input id="autoudar_h5" class="pl_numbox r_textbox" type="text" value="0" /> хилка 180<br />\
                            <input id="autoudar_h6" class="pl_numbox r_textbox" type="text" value="0" /> хилка 270<br />\
                            <input id="autoudar_h7" class="pl_numbox r_textbox" type="text" value="0" /> хилка 360<br />\
                            </div>\
                            <div style="display: inline-table">\
                            <input id="autoudar_h8" class="pl_numbox r_textbox" type="text" value="0" /> хилка 720\
                            </div>\
                        </td>\
                    </tr>\
                </table>\
            </div>\
        </div>';
    this.Start = function (win) {
        var This = this;
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
                    if (this.options.auto == 1) {
                        this.Begin();
                        return;
                    }
                }
                clearTimeout(this.handleTimeout);
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
                    $("input[name=battle]", doc.body).click();
                }, 2000);
        }
        else if (doc.body.innerHTML.indexOf('>Ожидаем, пока бой закончат другие игроки...') != -1) {
            if (this.started)
                this.handleTimeout = setTimeout(function () {
                    $("input[name=battle]", doc.body).click();
                }, 3000);
        }
        else {
            this.corpse = false;
            this.SetAreas(doc);
            if (this.started) {
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
                    var temp = this.LastStrike - (new Date()).getTime();
                    var dt = 2000 + temp;
                    if (dt < 1500) dt = 1500;
                    this.handleTimeout = setTimeout(function () {
                        $("#go", doc.body).click();
                        This.LastStrike = (new Date()).getTime();
                    }, dt);
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
                    $("#autoudar_start").val('Стоп');
                    this.Attack();
                    /*if(document.hidden && top.SoundOff === false) {
                        func.notify('Внимание!', 'Ваш бой начался.');
                    }*/
                } else {
                    alert("Окно боя еще не привязано. Первый удар нанесите сами");
                }
            }
        }

    }
    this.End = function () {
        this.started = false;
        $("#autoudar_start").val('Старт');
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
                        magic_life: 0,
                        magic: [0, 0, 0, 0, 0, 0, 0, 0, 0]
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
            var menu_item = $('<input type="button" value="Автоудар"/>');
            menu_item.bind('click', function () {
                if (This.master.Current != This) {
                    This.master.Current.Dispose();
                }
                This.master.Current = This;
                This.ToggleContent();
            })
            this.menuitem = $(menu_item);
            return this.menuitem;
        } else {
            return this.menuitem;
        }
    }
    this.ToggleContent = function () {
        var This = this;
        if (!this.created) {
            $(this.cid).html(this.contentHTML);

            if (this.started) {
                $("#autoudar_start").val("Стоп");
            }
            $("#autoudar_start").bind("click", function () {
                if (!This.started) This.Begin();
                else This.End();
            });

            $("#autoudar .pl_checkbox").change(function () {
                if (this.id == "autoudar_auto") {
                    This.options.auto = $(this).is(":checked");
                } else {
                    This.options.areas.block.splice(0, This.options.areas.block.length);
                    This.options.areas.hit.splice(0, This.options.areas.hit.length);
                    $("#autoudar .pl_checkbox:checked").each(function () {
                        if (this.id.indexOf('autoudar_attack') != -1) {
                            var option = this.id.replace('autoudar_attack_', '');
                            option = parseInt(option, 10);
                            if (!isNaN(option))
                                This.options.areas.hit.push(option);
                        } else if (this.id.indexOf('autoudar_defend') != -1) {
                            var option = this.id.replace('autoudar_defend_', '');
                            option = parseInt(option, 10);
                            if (!isNaN(option))
                                This.options.areas.block.push(option);
                        }
                    });
                }
                This.master.SaveOptions(This.id, This.options);
            });

            $(this.options.areas.hit).each(function () {
                $("#autoudar_attack_" + this).attr("checked", "checked");
            });
            $(this.options.areas.block).each(function () {
                $("#autoudar_defend_" + this).attr("checked", "checked");
            });


            $("#autoudar .pl_numbox, #autoudar .r_textbox").keydown(function (e) {
                var key = e.charCode || e.keyCode || 0;
                return (key == 8 || key == 46 || (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
            });
            $("#autoudar .pl_numbox,  #autoudar .r_textbox").keyup(function () {
                if (this.id == 'autoudar_life')
                    This.options.life = parseInt($(this).val(), 10);
                if (this.id == 'autoudar_magic_life')
                    This.options.magic_life = parseInt($(this).val(), 10);
                if (this.id.indexOf('autoudar_h') != -1) {
                    var i = parseInt(this.id.replace('autoudar_h', ''), 10);
                    This.options.magic[i] = parseInt($(this).val(), 10);
                }
                This.master.SaveOptions(This.id, This.options);
            });


            $('#autoudar_life').val(this.options.life);
            $('#autoudar_magic_life').val(this.options.magic_life);
            for (var i = 0; i < 9; i++)
                $('#autoudar_h' + i).val(this.options.magic[i]);

            if (this.options.auto)
                $('#autoudar_auto').attr("checked", "checked");

            this.created = true;
        } else {
            $("#autoudar").toggle();
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
        for (var i = 0; i < 9; i++) {
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
                //Восстановление энергии 150HP
                //Малый свиток «Восстановление 180HP»
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
                            if (heal_order[i] == 8 && heal[2] == 720) {
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