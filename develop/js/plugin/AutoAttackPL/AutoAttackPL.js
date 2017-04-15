function AutoAttackPL() {
    this.help = "";
    this.name = "Нападение";
    this.id = "autoattack";
    this.master = null;
    this.menuitem = null;
    this.created = false;
    this.mid = null;
    this.cid = null;
    this.started = false;
    this.enabled = false;
    this.klansoff = [];
    this.handletime = null;
    this.onlineWin = null;
    this.options = {
        attack_by: 0,
        type: 0,
        align: [false, null, false, false, null, null, false],
        login: 0,
        scrolls_type: 1,
        cast_num: 'I',
        scrolls_id: 0,
        minlvl: 0,
        maxlvl: 0,
        spam_type: '',
        spam_count: 0
    };
    this.contentHTML =
        '<div id="' + this.id + '" class="pl_wrap">\
        <div class="pl_section">\
            <div class="pl_section_title">Нападение/Каст/Лечение</div>\
            <div style="height:20px;overflow:hidden;" id="info"></div>\
            <div>\
                Искать: <select class="pl_selectbox" id="autoattack_attack_by">\
                <option value="0"></option>\
                <option value="filter">по списку онлайн</option>\
                <option value="login">по логину жертвы</option>\
                </select>\
                <input id="autoattack_start" type="button" value="Старт"/>\
            </div>\
            <div id="autoattack_align">\
                <!--<input class="pl_checkbox" type="checkbox" value="0"/>серые-->\
                склонность: <input class="pl_checkbox" type="checkbox" value="3"/>тёмные\
                <input class="pl_checkbox" type="checkbox" value="2"/>нейтралы\
                <input class="pl_checkbox" type="checkbox" value="6"/>светлые  |  \
                уровни:<input id="autoattack_minlvl" class="pl_numbox" type="number" min="0" value="0" /> \
                - <input id="autoattack_maxlvl" class="pl_numbox" type="number" min="0" value="0" />\
            </div>\
            <hr>\
            <div>\
                Логин:<input id="autoattack_login" class="pl_textbox" type="text" value="" />\
                <select class="pl_selectbox" id="autoattack_scrolls_type">\
                <option value="1">свиток</option>\
                <option value="0">встройка</option>\
                </select>\
                <input id="autoattack_scrolls_id" class="pl_textbox" type="text" value="0"/>\
                <div class="tooltip"  data-tooltip="Обновить свитки" style="display:inline;"><span class="pl_refresh_btn"></span></div>\
            </div>\
            <hr>\
            <div>\
                <div class="pl_button tooltip" data-tooltip="Нападение">\
                    <label>\
                        <input data-item="Нападение" class="pl_radiobox" type="radio" name="autoattack_type" value="1"><span class="attack">&nbsp;<b></b></span>\
                    </label>\
                </div>\
                <div class="pl_button tooltip" data-tooltip="Кулачное нападение">\
                    <label>\
                        <input data-item="Кулачное нападение" class="pl_radiobox" type="radio" name="autoattack_type" value="2"><span class="attackk">&nbsp;<b></b></span>\
                    </label>\
                </div>\
                <div class="pl_button tooltip" data-tooltip="Кровавое нападение">\
                    <label>\
                        <input data-item="Кровавое нападение" class="pl_radiobox" type="radio" name="autoattack_type" value="3"><span class="attackb">&nbsp;<b></b></span>\
                    </label>\
                </div>\
                <div class="pl_button tooltip" data-tooltip="Кровавое нападение «Вендетта»">\
                    <label>\
                        <input data-item="Кровавое нападение «Вендетта»" class="pl_radiobox" type="radio" name="autoattack_type" value="4"><span class="attackbv">&nbsp;<b></b></span>\
                    </label>\
                </div>\
                <div class="pl_button tooltip" data-tooltip="Разбойное нападение">\
                    <label>\
                        <input data-item="Разбойное нападение" class="pl_radiobox" type="radio" name="autoattack_type" value="5"><span class="attack0">&nbsp;<b></b></span>\
                    </label>\
                </div>\
                <div class="pl_button tooltip" data-tooltip="Кровавое Разбойное нападение">\
                    <label>\
                        <input data-item="Кровавое Разбойное нападение" class="pl_radiobox" type="radio" name="autoattack_type" value="6"><span class="attack1">&nbsp;<b></b></span>\
                    </label>\
                </div>\
                <hr width="1" size="26" style="float: left;margin: 0 3px;">\
                <div class="pl_button tooltip" data-tooltip="Противостояние">\
                    <label>\
                        <input class="pl_radiobox" type="radio" name="autoattack_type" value="7"><span class="attackopp">&nbsp;<b>∞</b></span>\
                    </label>\
                </div>\
                <div class="pl_button tooltip" data-tooltip="Нападение на центральной площади">\
                    <label>\
                        <input class="pl_radiobox" type="radio" name="autoattack_type" value="8"><span class="attackcp">&nbsp;<b>∞</b></span>\
                    </label>\
                </div>\
            </div>\
            <div class="clearfix"></div>\
            <hr>\
            <div>\
                <select style="float:left;margin-top:4px;" id="autoattack_cast_num" class="pl_selectbox">\
                    <option value="I">I</option>\
                    <option value="II">II</option>\
                    <option value="III">III</option>\
                </select>\
                <div class="pl_button tooltip" data-tooltip="Вой Грифона">\
                    <label>\
                        <input data-item="Вой Грифона" class="pl_radiobox" type="radio" name="autoattack_type" value="9"><span class="wrath_air">&nbsp;<b></b></span>\
                    </label>\
                </div>\
                <div class="pl_button tooltip" data-tooltip="Обман Химеры">\
                    <label>\
                        <input data-item="Обман Химеры" class="pl_radiobox" type="radio" name="autoattack_type" value="10"><span class="wrath_ground">&nbsp;<b></b></span>\
                    </label>\
                </div>\
                <div class="pl_button tooltip" data-tooltip="Укус Гидры">\
                    <label>\
                        <input data-item="Укус Гидры" class="pl_radiobox" type="radio" name="autoattack_type" value="11"><span class="wrath_water">&nbsp;<b></b></span>\
                    </label>\
                </div>\
                <div class="pl_button tooltip" data-tooltip="Гнев Ареса">\
                    <label>\
                        <input data-item="Гнев Ареса" class="pl_radiobox" type="radio" name="autoattack_type" value="12"><span class="wrath_ares">&nbsp;<b></b></span>\
                    </label>\
                </div>\
                <hr width="1" size="26" style="float: left;margin: 0 3px;">\
            </div>\
            <div class="clearfix"></div>\
            <hr>\
            <div>\
                <div class="pl_button tooltip" data-tooltip="Лечение легких травм">\
                    <label>\
                        <input data-item="Лечение легких травм" class="pl_radiobox" type="radio" name="autoattack_type" value="13"><span class="cure1">&nbsp;<b></b></span>\
                    </label>\
                </div>\
                <div class="pl_button tooltip" data-tooltip="Лечение средних травм">\
                    <label>\
                        <input data-item="Лечение средних травм" class="pl_radiobox" type="radio" name="autoattack_type" value="14"><span class="cure2">&nbsp;<b></b></span>\
                    </label>\
                </div>\
                <div class="pl_button tooltip" data-tooltip="Лечение тяжелых травм">\
                    <label>\
                        <input data-item="Лечение тяжелых травм" class="pl_radiobox" type="radio" name="autoattack_type" value="15"><span class="cure3">&nbsp;<b></b></span>\
                    </label>\
                </div>\
                <div class="pl_button tooltip" data-tooltip="Вылечить травму?">\
                    <div class="cure" id="autoattack_cure"></div>\
                </div>\
            </div>\
            <div class="clearfix"></div>\
            <hr>\
            <!--<div>\
                <div class="pl_button tooltip" data-tooltip="Спам магией">\
                    <label>\
                        <input data-item="Спам магией" class="pl_radiobox" type="radio" name="autoattack_type" value="16"><span class="magic_spam">&nbsp;<b></b></span>\
                    </label>\
                </div>\
                <select style="float:left;margin-top:5px;" id="autoattack_spam_type" class="pl_selectbox">\
                    <option value=""></option>\
                    <option value="Бумага">Бумага</option>\
                    <option value="Восстановление энергии 15HP">Восстановление энергии 15HP</option>\
                    <option value="Восстановление энергии 60HP">Восстановление энергии 60HP</option>\
                </select>\
                &nbsp;кол-во:<input style="margin-top:7px;" id="autoattack_spam_count" class="pl_numbox" type="number" min="0" value="0" />\
                <div id="autoattack_spam_start" class="button-big btn" title="Я твой рюкзак шатал">Я твой рюкзак шатал</div>\
            </div>\
            <div class="clearfix"></div>-->\
        </div>\
    </div>';
    this.Start = function (win) {
        if (this.started) {
            if (win.document.URL.indexOf('/fbattle.php') != -1) {
                this.EndAttack();
            }
            if (win.document.URL.indexOf('/ch.php?online') != -1) {
                this.onlineWin = win;
            }
        }
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
                        attack_by: 0,
                        type: 0,
                        align: [false, null, false, false, null, null, false],
                        login: 0,
                        scrolls_type: 1,
                        cast_num: 'I',
                        scrolls_id: 0,
                        minlvl: 0,
                        maxlvl: 0,
                        spam_type: '',
                        spam_count: 0
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
    this.GetEnemies = function () {
        var This = this;

        return new Promise(function (resolve, reject) {
            var enemies = [];

            switch (This.options.attack_by) {
                case "filter":

                    try {
                        if (This.onlineWin == null) {
                            reject(new Error("Запускаем охоту..."));
                            return;
                        }
                        var html = This.onlineWin.document.body.innerHTML;


                        if (typeof html != 'undefined') {
                            var users = func.searchAll("w\\(([^\\)]+)\\);", html);
                            html = null;

                            if (users.length > 0) {
                                for (var u in users) {
                                    users[u] = users[u].replace(/(')/g, '');
                                    var user = users[u].split(',');

                                    var login = user[0],
                                        align = +user[2],
                                        clan = user[3],
                                        level = +user[4];

                                    if (
                                        ( (This.options.minlvl == 0 && This.options.maxlvl == 0) ||
                                        level >= This.options.minlvl && level <= This.options.maxlvl) &&
                                        ( align != This.master.user.align &&
                                        (align != 0 &&
                                        align != 4 &&
                                        align.toString().indexOf('1.') == -1) ) &&
                                        (This.options.align[2] || This.options.align[3] || This.options.align[6]) &&
                                        +user[6] == 0 &&
                                        +user[7] == 0 &&
                                        +user[8] == 0
                                    ) {
                                        enemies.push(login);
                                    }
                                }
                                users = null;

                                if (enemies.length > 0) {
                                    resolve(enemies);
                                }
                                else {
                                    reject(new Error("Нет подходящих, продолжаем поиск..."));
                                }
                            }
                            else {
                                reject(new Error('Список пуст, продолжаем поиск...'));
                            }
                        }
                        else {
                            reject(new Error("Ошибка разбора html"));
                        }
                    }
                    catch (e) {
                        reject(new Error(e.message));
                    }
                    finally {
                        top.onlineReload(true);
                    }

                    break;

                case "login":
                    enemies = This.options.login.split(',');
                    if (enemies.length > 0) {
                        resolve(enemies);
                    } else {
                        reject(new Error('Список пуст, продолжаем поиск...'))
                    }

                    break;
            }


        });
    }
    this.DoAttack = function (url, data, enemy) {
        var This = this;
        var info = document.getElementById('info');

        if (!this.started && (This.options.type != 13 && This.options.type != 14 && This.options.type != 15)) {
            return;
        }
        if (info !== null) {
            var text = 'Нападаем...';
            if (This.options.type == 9 || This.options.type == 10 || This.options.type == 11 || This.options.type == 12) {
                text = 'Кастуем...';
            }
            else if (This.options.type == 13 || This.options.type == 14 || This.options.type == 15) {
                text = 'Лечим...';
            }
            info.innerHTML = "<font  color=#003388>" + enemy + ":&nbsp;</font><font  color=red>" + text + "</font>";
        }


        var expected = [
            'На сегодня лимит исчерпан',
            'Мазохист',
            'Нападения в этой локации запрещены',
            'Персонаж в другом городе',
            'Не так быстро',
            'Тут это не работает',
            'Персонаж тяжело травмирован',
            'Персонаж в другой комнате',
            'Персонаж "' + enemy + '" не найден',
            'У персонажа нет травм',
            'У персонажа нет тяжелых, средних или легких травм',
            'У персонажа нет средних или легких травм',
            'У персонажа нет легких травм',
            'Для лечения других персонажей необходима лицензия лекаря',
            'У вас не хватает требований для использования этой магии',
            'Вы должны находиться в одной комнате с тем, кому хотите передать вещи',
            'Незачем передавать самому себе'
        ];


        func.query(url, data)
            .then(function (html) {

                if (html.indexOf('value="Вперед') > -1 || html.indexOf('Все прошло удачно') > -1 || html.indexOf('" исцелен') > -1) {
                    if (info !== null)
                        info.innerHTML = "<font color=red>Успех!</font>";

                    if (This.master.plugins['Nastroika'].options.sound) {
                        func.sound("dp");
                    }
                    This.EndAttack();
                    if (This.options.type > 0 && This.options.type < 9)
                        top.frames['main'].location = '/fbattle.php';

                    func.notify('Автонападение', 'Успех!');
                } else {
                    var result = '';
                    //var effects = func.searchAll("(?:<font color=red>|</fieldset>)\s*(?:<b>)?([^<'\"\+]+)(?:</b>)?\s*(?:</font>|<br>\s*<br>\s*<filedset>)?", html);
                    var effects = func.searchAll("(?:<font color=red>|</fieldset>)\s*(?:<b>)?([^<'\+]+)(?:</b>)?\s*(?:</font>|<br>\s*<br>\s*<filedset>)?", html);
                    for (var e in effects) {
                        if (effects[e].indexOf('Данную вещь') < 0 && effects[e].indexOf('ойна') < 0 && effects[e].indexOf('начнется') < 0 && effects[e].indexOf('станет привязан') < 0) {
                            result += effects[e] + ' ';
                        }
                    }
                    for (var i in expected) {
                        if (result.indexOf(expected[i]) > -1) {
                            result = expected[i];
                            break;
                        }
                    }

                    if (!result) {
                        if (info !== null)
                            info.innerHTML = "<font  color=#003388><font  color=red>Неизвестная ошибка</font>";
                    } else {
                        if (info !== null)
                            info.innerHTML = "<font  color=#003388>" + enemy + ":&nbsp;</font> <font color=red>" + result + "</font>";
                    }
                }

            })
            .catch(function (error) {
                if (info !== null)
                    info.innerHTML = "<font color=red>" + error.message + "</font>";
            });

    }
    this.BeginAttack = function () {
        var This = this,
            info = document.getElementById('info'),
            delayRequests = 2000;
        clearTimeout(this.handletime);

        if (This.options.attack_by == "login" && +This.options.type != 7 && +This.options.type != 8 && +This.options.login == 0) {
            This.EndAttack();
            if (info !== null)
                info.innerHTML = "<font  color=red>Укажите жертву...</font>";
            return;
        }

        this.GetEnemies()
            .then(function (enemies) {
                var url, data, enemy;

                switch (This.options.type) {
                    case "1"://нападение
                    case "2"://нападение
                    case "3"://нападение
                    case "4"://нападение
                    case "5"://нападение
                    case "6"://нападение
                    case "9"://каст
                    case "10"://каст
                    case "11"://каст
                    case "12"://каст
                    case "13"://лечение
                    case "14"://лечение
                    case "15"://лечение
                    {
                        url = "main.php?edit=1&use=" + This.options.scrolls_id;
                        enemy = func.rand(enemies);
                        data = "sd=4&target=" + func.strEncode(enemy);
                        This.DoAttack(url, data, enemy);
                        break;
                    }

                    case "7"://ДП
                    {
                        url = "myabil.php";
                        enemy = func.rand(enemies);
                        data = "abit=undefined&sd4=" + This.master.user.id + "&use=opposition&target=" + func.strEncode(enemy);
                        This.DoAttack(url, data, enemy);
                        break;
                    }

                    case "8"://ЦП
                    {
                        url = "city.php?attack=1";
                        enemy = func.rand(enemies);
                        data = "sd4=6&target=" + func.strEncode(enemy);
                        This.DoAttack(url, data, enemy);
                        break;
                    }

                    case "16":
                    {
                        var to_id = func.getIdByLogin(enemies[0])
                            .then(function (to_id) {
                                url = "give.php?to_id=" + to_id + "&id_th=" + This.options.scrolls_id + "&setobject=" + This.options.scrolls_id + "&s4i=" + func.cookie('PHPSESSID') + "&sd4=" + This.master.user.id + "&tmp=0&gift=1";
                                enemy = enemies[0];
                                data = "is_sale=2&set=100&count=" + This.options.spam_count;
                                This.DoAttack(url, data, enemy);
                            });
                        break;
                    }

                    /*default:
                     {
                     This.EndAttack();
                     }*/

                }
            })
            .catch(function (error) {
                if (info !== null)
                    info.innerHTML = "<font  color=red>" + error.message + "</font>";
            })
            .then(function () {
                if (This.started) {
                    This.handletime = setTimeout(function () {
                        This.BeginAttack();
                    }, delayRequests);
                }
            });

    }
    this.EndAttack = function () {
        clearTimeout(this.handletime);
        this.started = false;
        this.onlineWin = null;
        //$("#autoattack_start").val("Старт");
        document.getElementById('autoattack_start').value = "Старт";
        setTimeout(function () {
            document.getElementById('info').innerHTML = '';
        }, 3000);

    }
    this.ToggleContent = function () {
        var This = this;

        if (!this.created) {
            $(this.cid).html(this.contentHTML);

            //attack_by
            $("#autoattack_attack_by").on("change", function () {
                This.options.attack_by = $(this).val();
                This.master.SaveOptions(This.id, This.options);
            });
            $("#autoattack_attack_by option[value='" + This.options.attack_by + "']").prop('selected', true);

            //scrolls_type
            $("#autoattack_scrolls_type").on("change", function () {
                This.options.scrolls_type = $(this).val();
                This.master.SaveOptions(This.id, This.options);
                if (This.options.type != 7 && This.options.type != 8) {
                    var item = This.options.type == 16 ? This.options.spam_type : $("#" + This.id + " .pl_radiobox[type=radio]:checked").data('item');
                    if (This.options.scrolls_type == 1) {
                        This.loadScrolls(1, item);
                    }
                    else if (This.options.scrolls_type == 0) {
                        This.loadInserts(0, item);
                    }
                }
            });
            $("#autoattack_scrolls_type option[value='" + This.options.scrolls_type + "']").prop('selected', true);

            //cast_num
            $("#autoattack_cast_num").on("change", function () {
                This.options.cast_num = $(this).val();
                This.master.SaveOptions(This.id, This.options);
                if (This.options.type >= 9 && This.options.type <= 12) {
                    var item = $("#" + This.id + " .pl_radiobox[type=radio]:checked").data('item');
                    if (This.options.scrolls_type == 1) {
                        This.loadScrolls(1, item);
                    }
                    else if (This.options.scrolls_type == 0) {
                        This.loadInserts(0, item);
                    }
                }
            });
            $("#autoattack_cast_num option[value='" + This.options.cast_num + "']").prop('selected', true);

            //spam_type
            $("#autoattack_spam_type").on("change", function () {
                This.options.spam_type = $(this).val();
                This.master.SaveOptions(This.id, This.options);
                if (This.options.type == 16 && This.options.scrolls_type == 1) {
                    This.loadScrolls(1, This.options.spam_type);
                }
            });
            $("#autoattack_spam_type option[value='" + This.options.spam_type + "']").prop('selected', true);


            //checkbox
            $("#" + this.id + "  .pl_checkbox[type=checkbox]").each(function () {
                //var self = this;
                $(this).on("change", function () {
                    var option = parseInt(this.value, 10);
                    This.options.align[option] = this.checked;
                    This.master.SaveOptions(This.id, This.options);
                });
                var id = this.value;
                this.checked = This.options.align[id];
            });

            //number
            $("#" + this.id + " .pl_numbox[type=number]", document).each(function () {
                $(this).change(function () {
                    var id = this.id.replace("autoattack_", "");
                    This.options[id] = parseInt($(this).val(), 10);
                    This.master.SaveOptions(This.id, This.options);
                });
                var id = this.id.replace("autoattack_", "");
                $("#autoattack_" + id, document).val(This.options[id]);
            });

            //radio
            $("#" + this.id + " .pl_radiobox[type=radio]", document).each(function () {
                var self = this;
                $(this).change(function () {
                    var id = this.name.replace("autoattack_", "");
                    This.options[id] = $(this).val();
                    This.master.SaveOptions(This.id, This.options);

                    if (This.options.type != 7 && This.options.type != 8) {
                        if (This.options.scrolls_type == 1) {
                            This.loadScrolls(1, This.options.type == 16 ? This.options.spam_type : $(this).data('item'));
                        }
                        else if (This.options.scrolls_type == 0) {
                            This.loadInserts(0, This.options.type == 16 ? This.options.spam_type : $(this).data('item'));
                        }
                    }
                });
            });
            $("#" + this.id + " .pl_radiobox[value=" + This.options.type + "]", document).attr("checked", "checked");

            //TEXTBOX
            $("#" + this.id + " .pl_textbox", document).each(function () {
                $(this).keyup(function () {
                    var id = this.id.replace("autoattack_", "");
                    This.options[id] = $(this).val();
                    This.master.SaveOptions(This.id, This.options);
                });
                var id = this.id.replace("autoattack_", "");
                //$(this).val(This.options[id]);
                this.value = This.options[id];
            });


            //Start autoattack
            $("#" + this.id + " #autoattack_start").on("click", function () {
                if (!This.started) {
                    var error = false;


                    if (!This.enabled) {
                        error = "Плагин выключен. Перейдите в пункт верхнего меню *Настройки* и включите его";
                    }
                    else if (+This.options.type == 0) {
                        error = "Ну хоть что-то выбери )";
                    }
                    else if (+This.options.type == 16) {
                            error = "Для спама другая кнопка";
                    }
                    else if (This.options.type >= 13 && This.options.type <= 15) {
                        error = "Для лечения другая кнопка";
                    }
                    else if (This.options.attack_by == 0) {
                        error = "Как искать будем жертву?";
                    }
                    else if (This.options.attack_by == "filter" && !This.options.align[0] && !This.options.align[2] && !This.options.align[3] && !This.options.align[6]) {
                        error = "Склонку бы выбрать...";
                    }
                    else if (This.options.attack_by == "login" && +This.options.login == 0) {
                        error = "А терпилу указать?";
                    }
                    else if (This.options.type != 7 && This.options.type != 8 && +This.options.scrolls_id == 0) {
                        error = "Нет свитков =(";
                    }


                    if (error === false) {
                        This.started = true;
                        $(this).val("Стоп");
                        This.BeginAttack();
                    }
                    else {
                        This.EndAttack();
                        func.notify(This.name, error, 'http://i.oldbk.com/i/sh/attack.gif');
                    }
                } else {
                    This.EndAttack();
                }
            });

            //Refresh scrolls
            $("#" + this.id + " .pl_refresh_btn").on("click", function () {
                if (This.options.type != 7 && This.options.type != 8 && This.options.type != 16) {
                    var item = $("#" + This.id + " .pl_radiobox[type=radio]:checked").data('item');
                    if (This.options.scrolls_type == 1) {
                        This.loadScrolls(1, item);
                    }
                    else if (This.options.scrolls_type == 0) {
                        This.loadInserts(0, item);
                    }

                    $("#info").html("Свитки \"" + item + "\" обновлены");
                    setTimeout(function () {
                        $("#info").html("");
                    }, 2000);
                }
            });

            //Cure
            $("#" + this.id + " #autoattack_cure").on("click", function () {
                if (This.options.type == 13 || This.options.type == 14 || This.options.type == 15) {
                    var error = false;
                    if (This.options.attack_by == "filter") {
                        error = true;
                        alert("Собрался первого встречного вылечить?");
                    }
                    else if (+This.options.scrolls_id == 0) {
                        error = true;
                        alert("Нечем лечить");
                    }
                    else if (+This.options.login == 0) {
                        error = true;
                        alert("Введите логин");
                    }

                    if (!error) {
                        This.BeginAttack();
                    } else {
                        This.EndAttack();
                    }
                }
                else
                    alert("Нужно выбрать свиток лечения");
            });

            //Spam start
            $("#" + this.id + " #autoattack_spam_start").on("click", function () {
                $("#info").append('<img src="http://i.oldbk.com/i/smiles/tongue2.gif" width="15" height="15" border="0" alt="">');
            });

            if (this.started) {
                $("#autoattack_start").val('Стоп');
            }

            if (This.options.type != 0 && This.options.type != 7 && This.options.type != 8) {
                var item = This.options.type == 16 ? This.options.spam_type : $("#" + This.id + " .pl_radiobox[type=radio]:checked").data('item');
                if (This.options.scrolls_type == 1) {
                    This.loadScrolls(1, item);
                }
                else if (This.options.scrolls_type == 0) {
                    This.loadInserts(0, item);
                }
            }

            this.created = true;
        } else {
            $("#" + this.id).toggle();
        }
        this.master.ResizeFrame();


    }
    this.loadScrolls = function (r, item) {
        var This = this;

        if (This.options.type != 7 && This.options.type != 8) {
            var prefix = '';
            if (This.options.type >= 9 && This.options.type <= 12)
                prefix = " " + This.options.cast_num;

            This.master.Parseitm(r, [item + prefix])
                .then(function (list) {
                    if (list.counts[item + prefix] > 0) {
                        This.options.scrolls_id = (This.options.type == 16) ? list[item + prefix][0][0] : func.rand(list[item + prefix])[0];
                    }
                    else {
                        This.options.scrolls_id = 0;
                    }
                    $("#" + This.id + " div.pl_button[data-tooltip='" + ((This.options.type == 16) ? "Спам магией" : item) + "']  span>b").html(list.counts[item + prefix] ? list.counts[item + prefix] : 0);
                    $("#autoattack_scrolls_id").val(This.options.scrolls_id);
                    This.master.SaveOptions(This.id, This.options);
                });
        }

    }
    this.loadInserts = function (r, item) {
        var This = this;

        if (This.options.type != 7 && This.options.type != 8) {
            var prefix = '';
            if (This.options.type >= 9 && This.options.type <= 12)
                prefix = " " + This.options.cast_num;

            This.master.Parseitm(r, [item + prefix], true)
                .then(function (list) {
                    var count = 0;
                    if (list.inserts.length > 0) {
                        This.options.scrolls_id = 0;

                        for (var i in list.inserts) {
                            if (list.inserts[i][1] == (item + prefix)) {
                                This.options.scrolls_id = list.inserts[i][0];
                                count = list.inserts[i][2];
                                break;
                            }
                        }
                    }
                    else {
                        This.options.scrolls_id = 0;
                    }
                    $("#" + This.id + " div.pl_button[data-tooltip='" + ((This.options.type == 16) ? "Спам магией" : item) + "']  span>b").html(count);
                    $("#autoattack_scrolls_id").val(This.options.scrolls_id);
                    This.master.SaveOptions(This.id, This.options);
                });

        }
    }
    this.Dispose = function () {
        this.created = false;
    }
}