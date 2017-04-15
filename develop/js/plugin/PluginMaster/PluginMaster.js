function PluginMaster() {
    this.name = "Plugin master";
    this.content_id = "#right_m";
    this.menu_id = "#left_m";
    this.position = "1";
    this.plugins = {};
    this.global_options = {};
    this.Current = {
        Dispose: function () {
            return false;
        }
    };
    this.default_state = false;
    this.finished = false;
    this.bot_time = -1;
    this.offset = 0;
    this.user = {id: 0, align: 0, clan: '', name: '', level: 0, city: '', vinos: 0, accept: false, dress: ''};
    this.href = '/main.php';
    this.LastUpdate = 0;
    this.handleHref = null;
    this.buttons = ((navigator.userAgent.toLowerCase().indexOf('chrome') > -1) ? 38 : 30);
    this.Complete = function () {
        this.finished = true;
        this.SaveOptions();
        this.ApplyPluginSettings();
    }
    this.SaveOptions = function (plugin, options) {
        if (plugin && options) {
            if (this.global_options[plugin].value)
                this.global_options[plugin].value = options;
        } else {
            this.CollectOptions();
        }
        if (this.global_options != null) {
            if ($.jStorage.storageAvailable()) {
                var expire = 1000 * 60 * 60 * 24 * 30;
                $.jStorage.set('GlobalOptions', func.toJSON(this.global_options), {TTL: expire});
            }
        }
    }
    this.CollectOptions = function () {
        var new_global_options = {};
        for (var pid in this.plugins) {
            new_global_options[pid] = {
                id: pid,
                value: this.plugins[pid].options,
                enabled: this.plugins[pid].enabled
            };
        }


        for (var go in this.global_options) {
            var found = false;

            for (var gn in new_global_options) {
                if (gn.id == go.id) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                new_global_options[go.id] = go;
            }
        }
        this.global_options = new_global_options;
    }
    this.AddPlugin = function (plugin) {
        this.plugins[plugin.id] = plugin;
        plugin.master = this;

        $("#left_m").append(plugin.MenuItem());
        if (this.global_options != null) {
            if (!this.global_options[plugin.id]) {
                this.global_options[plugin.id] = {
                    id: plugin.id,
                    value: {},
                    enabled: this.default_state
                };
            }
        }
        plugin.ApplyOptions();
    }
    this.FrameReLoad = function (win) {
        var This = this;

        if (/\/city\.php/.test(win.document.URL) == true && win.document.body.innerHTML.indexOf("Топаем на") != -1) win.cityg();

        if (
            win.document.URL.indexOf('.oldbk.com/') != -1 &&
            win.document.URL.indexOf('null') == -1 &&
            win.document.URL.indexOf('refreshed') == -1 &&
            win.document.URL.indexOf('plrfr') == -1 &&
            /\/ch\.php\?show/.test(win.document.URL) == false &&
            win.document.URL.indexOf('main.php') == -1 &&
            win.document.URL.indexOf('buttons') == -1 &&
            win.document.URL.indexOf('[object') == -1 &&
            win.document.URL.indexOf('%5Bobject') == -1
        ) {
            for (var pid in this.plugins) {
                if (this.plugins[pid].enabled) {
                    if (typeof this.plugins[pid].Start == 'function')
                        this.plugins[pid].Start(win);
                }
            }
        }

    }
    this.ResizeFrame = function () {

        var This = this;
        if (This.position == "3") {
            var b = top.document.body;
            var height1 = 0;
            var height2 = 33;

            if (classie.hasClass(document.getElementsByName('newplr')[0], 'active_frame')) {
                height1 = $("body", top.frames['newplr'].document).outerHeight();
                height2 = $("#cbp-spmenu-s3").outerHeight();
            }
            b.setAttribute("rows", "0," + (height2 + height1) + ",*,38");
        }
        else if (This.position == "4") {
            var b = top.document.body;
            var height1 = 0;
            var height2 = 38;

            if (classie.hasClass(document.getElementsByName('bottom')[0], 'active_frame')) {
                height1 = $("body", top.frames['bottom'].document).outerHeight();
                height2 = $("#cbp-spmenu-s4").outerHeight();
            }
            b.setAttribute("rows", "0, 33, *, " + (height2 + height1) + "");
        }

    }
    this.Init = function (User) {
        this.user.id = User.id;
        this.user.align = User.align;
        this.user.clan = User.clan;
        this.user.name = User.login;
        this.user.level = User.level;
        this.user.vinos = User.dex;
        this.user.accept = User.accept;
        this.user.dress = User.dress;
        User = null;
        this.position = ($.jStorage.get("MenuPosition")) ? $.jStorage.get("MenuPosition") : this.position;

        this.SettingPanel();
        if ($.jStorage.storageAvailable()) {
            if (!$.jStorage.get("GlobalOptions")) {
                this.default_state = false;
                this.global_options = {};
                func.notify('Настройки', 'Установлены начальные настройки');
                //func.message('Установлены начальные настройки', 'Настройки', 'plugin-bot');
            } else {
                this.global_options = func.evalJSON($.jStorage.get("GlobalOptions"));
            }
        }

    }
    this.ApplyPluginSettings = function () {
        var This = this;
        if (typeof This.plugins['Radio'] != 'undefined') {
            audio = new Audio(This.plugins['Radio'].list[0][0]);
            audio.setAttribute('preload', 'none');
        }

        if (typeof This.plugins['Nastroika'] != 'undefined') {
            if (This.plugins["Nastroika"].options.sw_filter) {
                top.frames["bottom"].window.sw_filter();
            }
            setTimeout(function () {
                $('frameset frameset:eq(0)', top.document).attr('rows', '' + This.plugins["Nastroika"].options.chatsize + '%,*,0');
            }, 300);
        }

        var resize_img = '<div class="frame_size" style="display: inline-flex;">' +
            '<a id="frame_up" href="javascript:void(0);"><img src="http://i.oldbk.com/i/images/buttons/btt3b.png" alt=""></a>&nbsp;' +
            '<a id="frame_down" href="javascript:void(0);"><img src="http://i.oldbk.com/i/images/buttons/btt3.png" alt=""></a>' +
            '</div>';


        $("td[background*=x_bg]:eq(1)", top.frames.chat.window.document.body).html(resize_img);

        $(".frame_size > a", top.frames.chat.window.document).on("click", function () {
            var atr = $(document.getElementsByTagName("frameset")[1]).attr("rows").split(",");

            if (this.id == "frame_up") {
                atr = parseFloat(atr[0]) - 10;
                if (atr < 5) {
                    return;
                }
            }
            else if (this.id == "frame_down") {
                atr = parseFloat(atr[0]) + 10;
                if (atr > 95) {
                    return;
                }
            }

            document.getElementsByTagName("frameset")[1].setAttribute("rows", (atr) + "%, *, 0");
            This.plugins["Nastroika"].options.chatsize = atr;
            This.SaveOptions(This.plugins["Nastroika"].id, This.plugins["Nastroika"].options);
            top.srld();
        });

        this.CheckIH();
        this.Massg();
    }
    this.SetEvents = function (plugin, prefix, rname) {
        var This = plugin;

        //Radio
        $("#" + prefix + " .pl_radiobox", document).each(function () {
            var each = this;
            $(this).change(function () {
                var id = this.name.replace(prefix + "_", "");
                This.options[id] = $(this).val();
                This.master.SaveOptions(This.id, This.options);
            });
        });
        $(".pl_radiobox[value=" + This.options[rname] + "]", document).attr("checked", "checked");
        ////

        //Select
        $("#" + prefix + " .pl_selectbox", document).each(function () {
            var each = this;
            $(this).change(function () {
                var id = this.id.replace(prefix + "_", "");
                This.options[id] = $(this).val();
                This.master.SaveOptions(This.id, This.options);
            });

            var id = this.id.replace(prefix + "_", "");
            $("#" + prefix + "_" + id + " [value='" + This.options[id] + "']").prop('selected', true);
        });
        ////

        //CHECKBOX
        $("#" + prefix + " .pl_checkbox", document).each(function () {
            var each = this;
            $(this).change(function () {
                var id = this.id.replace(prefix + "_", "");
                This.options[id] = $(this).is(":checked");
                This.master.SaveOptions(This.id, This.options);
            });

            var id = this.id.replace(prefix + "_", "");
            $("#" + prefix + "_" + id, document).attr("checked", This.options[id]);

        });
        ////


        //NUMBOX type number
        $("#" + prefix + " .pl_numbox[type=number]", document).each(function () {
            $(this).change(function () {
                var id = this.id.replace(prefix + "_", "");
                This.options[id] = parseInt($(this).val(), 10);
                This.master.SaveOptions(This.id, This.options);
            })
            var id = this.id.replace(prefix + "_", "");
            $("#" + prefix + "_" + id, document).val(This.options[id]);
        });

        ////


        //NUMBOX
        $("#" + prefix + " .pl_numbox", document).each(function () {
            $(this).keydown(function (e) {
                var key = e.charCode || e.keyCode || 0;
                return (key == 8 || key == 46 || (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
            });

            $(this).keyup(function () {
                var id = this.id.replace(prefix + "_", "");
                This.options[id] = parseInt($(this).val(), 10);
                This.master.SaveOptions(This.id, This.options);
            });
            var id = this.id.replace(prefix + "_", "");
            $("#" + prefix + "_" + id, document).val(This.options[id]);
        });
        ////

        //TEXTBOX
        $("#" + prefix + " .pl_textbox", document).each(function () {
            $(this).keyup(function () {
                var id = this.id.replace(prefix + "_", "");
                This.options[id] = $(this).val();
                This.master.SaveOptions(This.id, This.options);
            });
            var id = this.id.replace(prefix + "_", "");
            $("#" + prefix + "_" + id, document).val(This.options[id]);
        });

        //TEXarea
        $("#" + prefix + " .pl_textareabox", document).each(function () {
            $(this).keyup(function () {
                var id = this.id.replace(prefix + "_", "");
                This.options[id] = ($(this).val()).split('|');
                This.master.SaveOptions(This.id, This.options);
            });
            var id = this.id.replace(prefix + "_", "");
            $("#" + prefix + "_" + id, document).val(This.options[id].join('|'));
        });
        ////
    }
    this.CheckError = function () {
        var This = this;
        clearTimeout(this.handleHref);
        this.handleHref = null;
        if ((new Date()).getTime() - this.LastUpdate > 6000) {
            try {
                if (top.frames['main'].location.href === undefined)
                    top.frames['main'].location.href = this.href;
                if (top.frames['main'].window.document.body.innerHTML == '')
                    top.frames['main'].location.href = this.href;
            } catch (e) {
                console.log("автообновление фрейма");
                top.frames['main'].location.href = this.href;
            }
        }
        this.handleHref = setTimeout(function () {
            This.CheckError();
        }, 6000);
    }
    this.SettingPanel = function () {
        var This = this;

        if (typeof($.ui) === 'undefined')
            $('head').append('<script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>');
        //$('head').append('<link rel="stylesheet" href="<%= panelDir %>css/jquery-ui.min.css" type="text/css">');

        var newplr = top.frames.newplr.window.document;
        var element = $("table img[src*=up_center_right]", newplr.body);
        var pos = element.offset().left + element.width();

        var main_table = '' +
            '<div id="main_table">' +
            '   <div id="left_m"></div>' +
            '   <div id="right_m"></div>' +
            '   <div class="clearfix"></div>' +
            '</div>';

        var nav = '' +
            '<nav class="cbp-spmenu cbp-spmenu-vertical cbp-spmenu-left" id="cbp-spmenu-s1"></nav>' +
            '<nav class="cbp-spmenu cbp-spmenu-vertical cbp-spmenu-right" id="cbp-spmenu-s2"></nav>' +
            '<nav class="cbp-spmenu cbp-spmenu-horizontal cbp-spmenu-top" id="cbp-spmenu-s3"></nav>' +
            '<nav class="cbp-spmenu cbp-spmenu-horizontal cbp-spmenu-bottom" id="cbp-spmenu-s4"></nav>';

        var buttons = '' +
            '<div id="settings_button">' +
            '   <div class="pleft"></div>' +
            '   <div class="pbtn1 showTop" id="showTop"></div>' +
            '   <div class="pright"></div>' +
            '</div>' +
            '<div id="menu_buttons_left">' +
            '   <div id="pbtnhaot"><img src="http://i.oldbk.com/i/fighttype3.gif" onclick="top.frames.main.window.location.href = \'http://capitalcity.oldbk.com/zayavka.php?level=haos\'" title="Бои: Хаоты" style="cursor: pointer;width: 16px;height: 16px"></div>' +
            '   <div id="pbtndot" title="Антидот"></div>' +
            '   <div id="pbtnbut" title="Бутерброд"></div>' +
            '   <div id="pbtnmag" title="Зелье Старого Мага"></div>' +
            '</div>' +
            '<div id="menu_buttons_right" style="left:' + pos + 'px;">' +
                //'   <div id="pbtnrun" title="Быстрый переход"></div>' +
            '   <div id="pbtnhanger" title="Комплекты"></div>' +
            '   <div id="pbtnih" title="ИХ"></div>' +
            '   <div id="pbtnfriday" title="Пятницо"></div>' +
                '<img id="delloto" src="http://i.oldbk.com/i/clear.gif" style="padding-left:5px;padding-top:5px;cursor: pointer; width: 16px;height: 16px;">' +//main.php?edit=1&amp;destruct=710955428
            '</div>' +
            '</div>';

        $('#settings').append(buttons).append(nav);

        $("#cbp-spmenu-s" + This.position).html(main_table);

        if (This.position == "2" || This.position == "4") {
            var b2 = document.getElementById('left_m');
            var b1 = document.getElementById('right_m');
            document.getElementById('main_table').insertBefore(b1, b2);
        }


        var menuTop = document.getElementById('cbp-spmenu-s3'),
            menuRight = document.getElementById('cbp-spmenu-s2'),
            menuLeft = document.getElementById('cbp-spmenu-s1'),
            menuBottom = document.getElementById('cbp-spmenu-s4'),
            newPlr = document.getElementsByName('newplr')[0],
            bottom = document.getElementsByName('bottom')[0],
            showTop = $(".showTop"),
            body = document.body;

        var toogled, active_frame;
        switch (this.position) {
            case "1":
                toogled = menuLeft;
                active_frame = false;
                break;

            case "2":
                toogled = menuRight;
                active_frame = false;
                break;

            case "3":
                toogled = menuTop;
                active_frame = newPlr;
                break;

            case "4":
                toogled = menuBottom;
                active_frame = bottom;
                break;
        }

        $(".showTop").on('click', function () {
            classie.toggle(this, 'active');
            classie.toggle(toogled, 'cbp-spmenu-open');
            if (active_frame !== false)
                classie.toggle(active_frame, 'active_frame', function () {
                    This.ResizeFrame();
                });
        });
        $("#pbtnbut").bind('click', function () {
            This.UseButer();
        });
        $("#pbtndot").bind('click', function () {
            This.UseDot();
        });
        $("#pbtnrun").on("click", function () {
            var html = '<h3>' + this.title + '</h3><br><select id="fastgo">\
                    <option value="0">быстрый переход</option>\
                    <optgroup label="Переходы">\
                        <option value="refresh" style="padding-left: 10px;">Обновить фрейм</option>\
                        <option value="Загород" style="padding-left: 10px;">Загород</option>\
                        <option value="Комната Знахаря" style="padding-left: 10px;">Комната Знахаря</option>\
                        <option value="Вход в Лабиринт Хаоса" style="padding-left: 10px;">Вход в Лабиринт Хаоса</option>\
                        <option value="Вход в Руины" style="padding-left: 10px;">Вход в Руины</option>\
                        <option value="Ристалище" style="padding-left: 10px;">Ристалище</option>\
                        <option value="Башня смерти" style="padding-left: 10px;">Башня смерти</option>\
                        <option value="Арена Богов" style="padding-left: 10px;">Арена богов</option>\
                        <option value="Комната Склонности" style="padding-left: 10px;">Комната склонности</option>\
                        <option value="Секретная Комната" style="padding-left: 10px;">Секретная комната</option>\
                        <option value="Торговая улица" style="padding-left: 10px;">Торговая улица</option>\
                    </optgroup>\
                    <optgroup label="Бои">\
                        <option value="/zayavka.php?level=haos" style="padding-left: 10px;">Бои: Хаоты</option>\
                        <option value="/zayavka.php?logs=1" style="padding-left: 10px;">Бои: Завершённые</option>\
                    </optgroup>\
                </select>';
            This.CreatePopUp("fast_run", this, html);

            $("#fastgo").on("change", function () {
                if (this.value != 0 && this.value.substr(0, 1) == '/') {
                    if (this.value.indexOf('zayavka') > -1) {
                        window.open("http://capitalcity.oldbk.com" + this.value, '_newtab');
                    }
                }
                else if (this.value == 'refresh') {
                    top.frames.main.location.href = top.frames.main.location.href;
                }
                else if (this.value.toString().length > 4 && this.value.toString().length < 25) {
                    func.message("Генерация пути...", "Автопереход");
                    This.Route(this.value);
                }
                $(this).val(0);
            });
        });
        $("#pbtnhanger").on("click", function () {
            This.GetSets(this);
        });
        $("#pbtnih").on("click", function () {
            This.CheckIH(true);
        });
        $("#pbtnfriday").on("click", function () {
            This.CheckFriday();
        });
        $("#pbtnmag").on("click", function () {

            This.Parseitm(2, ['Зелье Старого Мага'])
                .then(function (list) {
                    list.counts["Зелье Старого Мага"] > 0 ? This.UseItem(list["Зелье Старого Мага"]) : func.message("Зелье Старого Мага закончилось", "Автоюз");
                })
                .catch(func.errorLog);
        });
        $("table img[src*=up_left_dec]", newplr)./*css({"cursor": "pointer"}).*/on("click", function () {
            if ($("table[width=350]", newplr).css("display") == "none")
                $("table[width=350]", newplr).css("display", "block");
            else
                $("table[width=350]", newplr).css("display", "none");
        });

        $("#delloto").on("click", function () {
            This.Parseitm(2, ['Лотерейный билет'])
                .then(function (list) {
                    q(list);

                    if(list.counts['Лотерейный билет'] > 0) {
                        for (var i in list['Лотерейный билет']){
                            //setTimeout(function () {
                                func.query('/main.php?edit=1&destruct='+list['Лотерейный билет'][i][0]);
                                q('del:'+ list['Лотерейный билет'][i][0]);
                            //}, 1000);
                        }
                    }
                })
        });
    }

    /*+++ Routes*/
    this.WeHere = false;
    this.ROUTES = {//Комната Знахаря
        'Замковая площадь': [
            ['Вход в Лабиринт Хаоса', ['45']],
            ['Вход в Руины', ['1']],
            ['Арена Богов', ['1', '/ruines_start.php?exit=1', '60']],

            ['Загород', ['1', '/ruines_start.php?exit=1', '4', '10']],
            ['Комната Знахаря', ['1', '/ruines_start.php?exit=1', '4', '5']],

            ['Комната Склонности', ['1', '/ruines_start.php?exit=1', '4', '10', 'outcity', '4', '1', 'myroom']],
            ['Секретная Комната', ['1', '/ruines_start.php?exit=1', '4', '10', 'outcity', '4', '1', '/main.php?setch=1&got=1&room17=2103', '/main.php?path=1.100.1.50']],


            ['Торговая улица', ['1', '/ruines_start.php?exit=1', '4', '10', 'outcity', '4', '1', 'myroom', 'plo', '66']],
            ['Фонтан', ['1', '/ruines_start.php?exit=1', '4', '10', 'outcity', '4', '1', 'myroom', 'plo', '66', 'use']],

            ['Башня смерти', ['1', '/ruines_start.php?exit=1', '4', '10', 'outcity', '4', '1', 'myroom', 'plo', '7', '77']],
            ['Ристалище', ['1', '/ruines_start.php?exit=1', '4', '10', 'outcity', '4', '1', 'myroom', 'plo', '7', '77', '/dt_start.php?exit=1', '3200']]
        ],
        'Парковая улица': [
            ['Вход в Лабиринт Хаоса', ['3', '45']],
            ['Вход в Руины', ['3', '1']],
            ['Арена Богов', ['3', '1', '/ruines_start.php?exit=1', '60']],

            ['Загород', ['10']],
            ['Комната Знахаря', ['5']],

            ['Комната Склонности', ['4', '1', 'myroom']],
            ['Секретная Комната', ['4', '1', '/main.php?setch=1&got=1&room17=2103', '/main.php?path=1.100.1.50']],
            ['Торговая улица', ['4', '1', 'myroom', 'plo', '66']],
            ['Фонтан', ['4', '1', 'myroom', 'plo', '66', 'use']],

            ['Башня смерти', ['4', '1', 'myroom', 'plo', '7', '77']],
            ['Ристалище', ['4', '1', 'myroom', 'plo', '7', '77', '/dt_start.php?exit=1', '3200']]
        ],
        'Центральная площадь': [
            ['Вход в Лабиринт Хаоса', ['8', '10', 'outcity', '3', '45']],
            ['Вход в Руины', ['8', '10', 'outcity', '3', '1']],
            ['Арена Богов', ['8', '10', 'outcity', '3', '1', '/ruines_start.php?exit=1', '60']],

            ['Загород', ['8', '10']],
            ['Комната Знахаря', ['8', '5']],

            ['Комната Склонности', ['1', 'myroom']],
            ['Секретная Комната', ['1', '/main.php?setch=1&got=1&room17=2103', '/main.php?path=1.100.1.50']],
            ['Торговая улица', ['66']],
            ['Фонтан', ['66', 'use']],

            ['Башня смерти', ['7', '77']],
            ['Ристалище', ['7', '77', '/dt_start.php?exit=1', '3200']],
            ['Ремонтная мастерская', ['4']]

        ],
        'Торговая улица': [
            ['Вход в Лабиринт Хаоса', ['20', '1', 'myroom', 'plo', '8', '10', 'outcity', '3', '45']],
            ['Вход в Руины', ['20', '1', 'myroom', 'plo', '8', '10', 'outcity', '3', '1']],
            ['Арена Богов', ['20', '1', 'myroom', 'plo', '8', '10', 'outcity', '3', '1', '/ruines_start.php?exit=1', '60']],

            ['Загород', ['20', '1', 'myroom', 'plo', '8', '10']],
            ['Комната Знахаря', ['20', '1', 'myroom', 'plo', '8', '5']],
            ['Фонтан', ['use']],

            ['Комната Склонности', ['20', '1', 'myroom']],
            ['Секретная Комната', ['20', '1', '/main.php?setch=1&got=1&room17=2103', '/main.php?path=1.100.1.50']],

            ['Башня смерти', ['20', '1', 'myroom', 'plo', '7', '77']],
            ['Ристалище', ['20', '1', 'myroom', 'plo', '7', '77', '/dt_start.php?exit=1', '3200']]
        ],
        'Страшилкина улица': [
            ['Вход в Лабиринт Хаоса', ['4', '1', 'myroom', 'plo', '8', '10', 'outcity', '3', '45']],
            ['Вход в Руины', ['4', '1', 'myroom', 'plo', '8', '10', 'outcity', '3', '1']],
            ['Арена Богов', ['4', '1', 'myroom', 'plo', '8', '10', 'outcity', '3', '1', '/ruines_start.php?exit=1', '60']],

            ['Загород', ['4', '1', 'myroom', 'plo', '8', '10']],
            ['Комната Знахаря', ['4', '1', 'myroom', 'plo', '8', '5']],

            ['Комната Склонности', ['4', '1', 'myroom']],
            ['Секретная Комната', ['4', '1', '/main.php?setch=1&got=1&room17=2103', '/main.php?path=1.100.1.50']],
            ['Торговая улица', ['4', '1', 'myroom', 'plo', '66']],
            ['Фонтан', ['4', '1', 'myroom', 'plo', '66', 'use']],

            ['Башня смерти', ['77']],
            ['Ристалище', ['3200']]
        ],
        'Ристалище': [
            ['Вход в Лабиринт Хаоса', ['/restal.php?got=1&level4=1', '77', '/dt_start.php?exit=1', '4', '1', 'myroom', 'plo', '8', '10', 'outcity', '3', '45']],
            ['Вход в Руины', ['/restal.php?got=1&level4=1', '77', '/dt_start.php?exit=1', '4', '1', 'myroom', 'plo', '8', '10', 'outcity', '3', '1']],
            ['Арена Богов', ['/restal.php?got=1&level4=1', '77', '/dt_start.php?exit=1', '4', '1', 'myroom', 'plo', '8', '10', 'outcity', '3', '1', '/ruines_start.php?exit=1', '60']],

            ['Загород', ['/restal.php?got=1&level4=1', '77', '/dt_start.php?exit=1', '4', '1', 'myroom', 'plo', '8', '10']],
            ['Комната Знахаря', ['/restal.php?got=1&level4=1', '77', '/dt_start.php?exit=1', '4', '1', 'myroom', 'plo', '8', '5']],

            ['Комната Склонности', ['/restal.php?got=1&level4=1', '77', '/dt_start.php?exit=1', '4', '1', 'myroom']],
            ['Секретная Комната', ['/restal.php?got=1&level4=1', '77', '/dt_start.php?exit=1', '4', '1', '/main.php?setch=1&got=1&room17=2103', '/main.php?path=1.100.1.50']],
            ['Торговая улица', ['/restal.php?got=1&level4=1', '77', '/dt_start.php?exit=1', '4', '1', 'myroom', 'plo', '66']],
            ['Фонтан', ['/restal.php?got=1&level4=1', '77', '/dt_start.php?exit=1', '4', '1', 'myroom', 'plo', '66', 'use']],

            ['Башня смерти', ['/restal.php?got=1&level4=1', '77']]
        ]

    }
    this.SROUTES = {
        'Вход в Руины': ['Замковая площадь', ['/ruines_start.php?exit=1']],
        'Вход в Лабиринт Хаоса': ['Замковая площадь', ['/city.php?zp=1']],
        'Храмовая лавка': ['Замковая площадь', ['/city.php?zp=1']],
        'Храм Древних': ['Замковая площадь', ['/city.php?zp=1']],

        'Вокзал': ['Парковая улица', ['/city.php?bps=1']],
        'Маленькая скамейка': ['Парковая улица', ['/city.php?bps=1']],
        'Средняя скамейка': ['Парковая улица', ['/city.php?bps=1']],
        'Большая скамейка': ['Парковая улица', ['/city.php?bps=1']],
        'Комната Знахаря': ['Парковая улица', ['/city.php?bps=1']],
        'Загород': ['Парковая улица', ['outcity']],
        'Замки': ['Парковая улица', ['/castles.php?exit=1', 'outcity']],

        'Почта': ['Центральная площадь', ['/city.php?cp=1', 'myroom', 'plo']],
        'Магазин \'Березка\'': ['Центральная площадь', ['/city.php?cp=1', 'myroom', 'plo']],
        'Лотерея Сталкеров': ['Центральная площадь', ['/city.php?cp=1', 'myroom', 'plo']],
        //'Ремонтная мастерская': ['Центральная площадь', ['/city.php?cp=1', 'myroom', 'plo']],
        'Ремонтная мастерская': ['Центральная площадь', ['/city.php?cp=1', 'myroom']],
        'Комиссионный магазин': ['Центральная площадь', ['/city.php?cp=1', 'myroom', 'plo']],
        'Магазин': ['Центральная площадь', ['/city.php?cp=1', 'myroom', 'plo']],

        'Комната для новичков': ['Центральная площадь', ['plo',]],
        'Секретная Комната': ['Центральная площадь', ['plo']],
        'Зал Воинов': ['Центральная площадь', ['plo']],
        'Торговый Зал': ['Центральная площадь', ['plo']],
        'Рыцарский зал': ['Центральная площадь', ['plo']],
        'Башня рыцарей-магов': ['Центральная площадь', ['plo']],
        'Колдовской мир': ['Центральная площадь', ['plo']],
        'Этажи духов': ['Центральная площадь', ['plo']],
        'Астральные этажи': ['Центральная площадь', ['plo']],
        'Огненный мир': ['Центральная площадь', ['plo']],
        'Зал Паладинов': ['Центральная площадь', ['plo']],
        'Совет Белого Братства': ['Центральная площадь', ['plo']],
        'Зал Тьмы': ['Центральная площадь', ['plo']],
        'Царство Тьмы': ['Центральная площадь', ['plo']],
        'Зал Стихий': ['Центральная площадь', ['plo']],
        'Будуар': ['Центральная площадь', ['plo']],
        'Зал Света': ['Центральная площадь', ['plo']],
        'Царство Света': ['Центральная площадь', ['plo']],
        'Царство Стихий': ['Центральная площадь', ['plo']],
        'Зал клановых войн': ['Центральная площадь', ['plo']],

        'Арендная лавка': ['Торговая улица', ['/rentalshop.php?exit=1']],
        'Аукцион': ['Торговая улица', ['/auction.php?exit=1']],
        'Прокатная лавка': ['Торговая улица', ['/prokat.php?exit=1']],
        'Ломбард': ['Торговая улица', ['/pawnbroker.php?exit=1']],
        'Арендная лавка': ['Торговая улица', ['rentalshop.php?exit=1']],

        'Регистратура кланов': ['Страшилкина улица', ['/city.php?strah=1']],
        'Банк': ['Страшилкина улица', ['/city.php?strah=1']],
        'Цветочный магазин': ['Страшилкина улица', ['/city.php?strah=1']],
        'Башня смерти': ['Страшилкина улица', ['/dt_start.php?exit=1']],

        'Вход в Одиночные сражения': ['Ристалище', ['/restal270.php?got=1&level=200']],
        'Замок Лорда Разрушителя': ['Ристалище', ['/lord2.php?exit=1']],
        'Вход в Групповые сражения': ['Ристалище', ['/restal240.php?exit=Вернуться']],
        'Вход в Сражение отрядов': ['Ристалище', ['/restal210.php?exit=Вернуться']],

        'Арена Богов': ['Замковая площадь', ['/bplace.php?bpl=1', '/bplace.php?got=1&level333=1']]
    }
    this.CheckRoom = function (calback) {
        var This = this;
        var FrameOnline = top.frames["online"].window;
        refrBtn = $('input[type=button]', FrameOnline.document.body)[0];
        top.document.getElementsByTagName('frame')[6].onload = function () {
            top.document.getElementsByTagName('frame')[6].onload = false;
            var myroom = parent.frames[3].document.body.innerHTML.split('\n').join('');
            myroom = myroom.match(/<b>([^0-9]+)\s.*?\([0-9]+\).*?<\/b>/i);
            if (myroom && myroom[1]) {
                calback(myroom[1]);
            } else {
                console.error('check room failed!!!!');
                This.CheckRoom(calback);
            }
        }
        refrBtn.click();
    }
    this.GoTo = function (locations, num, wait, callback) {
        var This = this;
        var Time = 1000;
        num = num > 0 ? num : 0;
        var next = locations[num];
        var ts = num > 0 && (next == '/dt_start.php?exit=1' || next == '/ruines_start.php?exit=1' || next == '/main.php?goto=plo' || next == '/outcity.php?qaction=2') ? 5000 : 1000;
        console.debug('goto ' + num + '(' + ts + ') > ' + next + ' // T[' + Time + ']');
        if (!next) {
            top.frames['main'].location.href = "main.php?top=" + Math.random();
            func.message("Пришли!", "Автопереход");
            if (callback) callback(true);
        } else {
            if (ts > 0) func.message("Ждём перехода в безопасной локе (" + (ts / 1000) + " сек.)...", "Автопереход");
            setTimeout(function () {
                $.get(next, function (data) {
                    if (data.indexOf('Не так быстро!') > -1) {
                        if (!wait) func.message("Ждём перехода (4)...", "Автопереход");
                        setTimeout(function () {
                            This.GoTo(locations, num, true, callback);
                        }, 1000);
                    } else if (data.indexOf('Вы не можете передвигаться еще') > -1) {
                        func.message("Вы попали в ловушку!!!", "Автопереход");
                        top.frames['main'].location.href = "main.php?top=" + Math.random();
                    } else if (data.indexOf('Подали заявку на бой и убегаете') > -1) {
                        func.message("Вы в заявке...", "Автопереход");
                        top.frames['main'].location.href = "main.php?top=" + Math.random();
                    } else if (data.indexOf('Вы выпили воду') > -1) {
                        func.message("Вы выпили воду из Фонтана... сегодня вам повезло.", "Автопереход");
                        //This.set('base.fontan.used', false);
                        This.GoTo(locations, num + 1, false, callback);
                    } else if (data.indexOf('Вы уже пили из фонтана') > -1) {
                        func.message("Вы уже использовали все юзы фонтана.", "Ошибка");
                        var day = new Date(),
                            time_zone = (day.getTimezoneOffset() / 60) + 3;
                        time_zone *= 3600000;
                        day.setTime(day.getTime() + time_zone);
                        var d = day.getDate(),
                            h = day.getHours(),
                            i = day.getMinutes(),
                            s = day.getSeconds();
                        console.debug(day + ' // ' + h + ':' + i + ':' + s);
                        //This.set('base.fontan.used', d);
                        This.GoTo(locations, num + 1, false, callback);
                    } else {
                        setTimeout(function () {
                            This.GoTo(locations, num + 1, false, callback);
                        }, Time);

                    }
                });
            }, ts);
        }
    }
    this.Route = function (End, callback) {
        var This = this;
        console.debug('Route to ' + End);
        var FrameOnline = top.frames["online"].window;
        refrBtn = $('input[type=button]', FrameOnline.document.body)[0];

        var align = This.user.align;
        var rooms = ['room4', 'room55', 'room36', 'room17', '', '', 'room54'];
        var room = rooms[align] ? rooms[align] : rooms[0];
        var MyRoom = '/main.php?setch=1&got=1&' + room + '=1';
        //'Страшилкина улица', 'Центральная площадь', 'Парковая улица', 'Замковая площадь', 'Комната Склонности'
        //'/outcity.php?quest','/outcity.php?qaction=2'
        top.document.getElementsByTagName('frame')[6].onload = function () {
            top.document.getElementsByTagName('frame')[6].onload = false;
            var myroom = parent.frames[3].document.body.innerHTML.split('\n').join('');
            myroom = myroom.match(/<b>([^0-9]+)\s.*?\([0-9]+\).*?<\/b>/i);
            var Start = myroom[1];
            if (Start == End) {
                if (!This.WeHere) func.message('Вы уже тут!', 'Ошибка');
                This.WeHere = true;
                if (callback) callback(true);
                return;
            }
            var Route = [],
                Mess = [];
            if (This.SROUTES[Start]) {
                Route = This.SROUTES[Start][1];
                Mess.push(Start);
                Start = This.SROUTES[Start][0];
                Mess.push(Start);
            }
            if (Start == End) {
                This.GoTo(Route, 0, false, callback);
                return;
            }
            if (This.ROUTES[Start]) {
                for (var r in This.ROUTES[Start]) {
                    var Road = This.ROUTES[Start][r];
                    var EndName = Road[0];
                    var Way = Road[1];
                    if (EndName == End) {
                        Mess.push(End);
                        Route = Route.concat(Way);
                        break;
                    }
                }
            }
            if (Route.length > 0) {
                var Road = [];
                for (var r in Route) {
                    if (!isNaN(parseInt(Route[r]))) {
                        Road.push("/city.php?got=1&level" + Route[r] + "=1");
                    } else if (Route[r] == 'outcity') {
                        Road.push("/outcity.php?quest=1");
                        Road.push("/outcity.php?qaction=2");
                    } else if (Route[r] == 'myroom') {
                        Road.push(MyRoom);
                    } else if (Route[r] == 'use') {
                        //solo(67) solo(2)  Вы выпили воду
                        Road.push("/city.php?got=1&level67=1");
                        Road.push("/fontan.php?get_gift=2");
                        Road.push("/city.php?ok");
                    } else if (Route[r] == 'plo') {
                        Road.push("/main.php?goto=plo");
                    } else {
                        Road.push(Route[r]);
                    }
                }
                func.message("Проложен путь: " + Mess.join(' => ') + ', шагов: ' + Road.length + '. Двинули...', "Автопереход");
                This.GoTo(Road, 0, false, callback);

            } else {
                func.message('Не удалось создать путь! :(', 'Ошибка');
                console.error('bad route to ' + End);
                if (callback) callback(false);
            }
        }
        refrBtn.click();
    }

    /*+++ Check Friday */
    this.CheckFriday = function () {

        if ((new Date()).getDay() == 5) {
            func.query('inf.php?login=%D0%9F%D1%8F%D1%82%D0%BD%D0%B8%D1%86%D0%BE&short=1&rand=' + Math.random())
                .then(function (html) {
                    var online = func.search("online\\=(\\d+)", html);
                    if (+online == 1) {
                        var loc = func.search("loc\\=(.*?)\\s*hp", html);
                        func.notify("Пятницо", "Онлайн: " + loc, '<%= panelDir %>img/friday.png');
                    } else {
                        func.notify("Пятницо", "Оффлайн", '<%= panelDir %>img/friday.png');
                    }
                });
        } else {
            func.notify("Сегодня не пятница", "", '<%= panelDir %>img/friday.png');
        }
    }

    /*+++ IH*/
    this.CheckIH = function (man) {
        var timeout = 60000,
            This = this,
            h, a = null,
            d, j,
            char_lvl = (+This.user.level == 13) ? 12 : This.user.level;


        d = function (k) {
            if (This.plugins['Nastroika'].options.is_haos) {
                clearInterval(a);
                a = setInterval(h, k);
            } else {
                clearInterval(a);
                return;
            }
        };

        j = function (text, status, bot) {
            if (status == 'Оффлайн') {
                func.message(text, status, bot);
            } else {
                func.notify(bot + ': ' + status, text, '<%= panelDir %>img/ih.png');
            }
        };

        h = function () {
            if (!This.plugins['Nastroika'].options.is_haos && !man) {
                clearInterval(a);
                return;
            }

            func.query(top.panelDir + 'php/events.php?event=ih')
                .then(function (xml) {
                    xml = func.evalJSON(xml);
                    if ($.isEmptyObject(xml)) {
                        setTimeout(function () {
                            d(timeout);
                        }, 1000);
                        return;
                    }

                    if (!man) {
                        if (char_lvl != xml["level"]) {
                            d(10 * timeout);
                            return;
                        }
                    }


                    if (xml["room"] != "") {
                        j(xml["room"], xml["status"], xml["name"]);
                        if (!man) d(10 * timeout);
                    }
                    else {
                        if (xml["time"] > 0 && xml["time"] < 59) {
                            j(xml["status"], "Оффлайн", xml["name"]);
                        }
                        if (!man) {
                            var k = 70;
                            if (xml["time"] < 5) {
                                k = 1;
                            } else {
                                if (xml["time"] < 20) {
                                    k = 5;
                                } else {
                                    if (xml["time"] < 71) {
                                        k = 10;
                                    }
                                }
                            }
                            d(k * timeout);
                        }
                    }
                });

        };
        if (man) {
            h();
        }
        else {
            if (This.plugins['Nastroika'].options.is_haos) {
                a = setInterval(h, timeout);
            }
        }

    }

    /*+++ Need repair*/
    this.NeedRepair = function () {
        var This = this;
        if (This.plugins['Labirint'].started) {
            return;
        }

        func.query('/main.php?edit=1')
            .then(function (html) {
                var data = func.search("<td[^>]+top[^>]?>(.+?)><table[^>]+runes_slots[^>]+", html);
                var slots = func.searchAll("(?:b|-<br)>(.+?)(?:<\\/b><br>|<br>)Прочность (\\d+)\\/(\\d+)", data);
                var need_rem = [];
                for (var i in slots) {
                    if (slots[i][2] != 3 && (slots[i][2] - slots[i][1] <= 3 )) {
                        need_rem.push(slots[i][0] + ' <font color="red">' + slots[i][1] + '</font>/<font color="green">' + slots[i][2] + '</font>');
                    }
                }
                if (need_rem.length > 0) {
                    func.message(need_rem.join(', '), 'Нуждается в ремонте');
                    if (This.plugins["autoproposal"] && This.plugins["autoproposal"].started) {
                        This.plugins["autoproposal"].End();
                        func.message("Автозаявка остановлена, нужно отремонтировать шмот!", 'Автозаявка');
                    }
                }
            });
    }

    /*+++ Clan war*/
    this.warEnemies = '';

    /*+++ Msg Clan war*/
    this.Massg = function () {

        var This = this;
        var chat = top.frames["chat"].window;

        if (this.user.clan != '') {
            func.query("klan.php?razdel=wars")
                .then(function (data) {
                    var regexMyclan = new RegExp(This.user.clan, 'i');

                    var regex = /начнется/i;
                    var TempBool01 = regex.test(data);
                    if (TempBool01) {
                        var textBefore = data.split('начнется')[0];
                        var textAfter = textBefore.substring(textBefore.lastIndexOf('война'));
                        var teams = textAfter.split('против');
                        var check_teams = regexMyclan.test(teams[0]);

                        var enemy = teams[(check_teams ? 1 :0)].match(/title\=(.+?)\ssrc/g);

                        var arr = [];
                        $(enemy).each(function (index, value) {
                            var Temp = value.match(/title\=(.+?)\ssrc/);
                            arr.push(value.match(Temp[1]));
                        });

                        //This.warEnemies = arr;
                        func.notify('Война', This.user.name + ' будьте готовы, ожидается клановая война против ' + arr.join(", "));
                    } else {
                        regex = /towerlog.php\?war\=(\d+)/i;
                        var res = regex.test(data);
                        if (res) {
                            var id_war = data.match(regex);
                            var textBefore = data.split('Клановое Нападение')[0];
                            var textAfter = textBefore.substring(textBefore.lastIndexOf('война'));
                            var teams = textAfter.split('против');
                            var check_teams = regexMyclan.test(teams[0]);

                            var enemy = teams[(check_teams ? 1 :0)].match(/title\=(.+?)\ssrc/g);

                            var arr = [];
                            $(enemy).each(function (index, value) {
                                var Temp = value.match(/title\=(.+?)\ssrc/);
                                arr.push(value.match(Temp[1]));
                            });

                            //This.warEnemies = arr;
                            func.notify('Война', This.user.name + ' будьте осторожны, в данный момент идет клановая война против ' + arr.join(", "));
                        }
                    }
                })
                .catch(func.errorLog);
        }

    }

    /*+++ Parse inventory*/
    this.RestoreInv = function (razdel) {
        var r = {'0': 1, '1': 1, '2': 1, '3': 1};
        func.query('/main.php?edit=1&razdel=' + razdel, 'ssave=1&rzd0=' + r[0] + '&rzd1=' + r[1] + '&rzd2=' + r[2] + '&rzd3=' + r[3])
            .catch(func.errorLog);
    }
    this.Parseitm = function (r, items, ignore) {
        var This = this;

        return new Promise(function (resolve, reject) {
            func.query('/main.php?edit=1&razdel=' + r + '&all=1&sub=0', 'ssave=1&rzd0=0&rzd1=0&rzd2=0&rzd3=0')
                .then(function (html) {
                    var List = {'counts': {}, 'inserts': [], 'loaded': false};
                    This.RestoreInv(r);

                    if (html && html.indexOf('(Вес:') > -1) {
                        List['loaded'] = true;

                        var data = func.search('<table[^>]+>\\s*\\[\\s*<a[^>]+>\\s*страницы\\s*<\\/a>\\s*\\](.+?)<\\/table>\\s*<\\/td>\\s*<\\/form>', html);
                        var Items = func.searchAll("<tr[^>]+>\\s*<td[^>]+>.+?(?:destruct)=([0-9]+).+?(?:<\\/td>)?\\s*<td[^>]+>\\s*<a[^>]+>([^<]+)<\\/a>.+?<b>Цена: ([0-9\\.]+) (екр|кр).*?<\\/b>\\s*.+?<BR>\\s*Долговечность: ([0-9]+)\\/([0-9]+)\\s*<br>(.+?)<\\/td>\\s*<\\/tr>", data);
                        //[id, name, price, ptype, min, max, chance, html[d.m.y]], count?!
                        for (var i in Items) {
                            if (typeof(Items[i]) != 'object' || !Items[i][1] || (!ignore && !func.in_array(Items[i][1], items))) continue;

                            var item = Items[i];
                            var dmy = 99999999,
                                id = item[0],
                                price = (+item[2] * (item[3] == 'кр' ? 1 : 1.5)),
                                min = +item[4],
                                max = +item[5],
                                elapsed = max - min,
                                name = item[1];

                            if (func.in_array(name, [
                                        'Бутерброд -Завтрак рыцаря-',
                                        'Сытный завтрак',
                                        'Гренка',
                                        'Легкий завтрак',
                                        'Коробка конфет «Ассорти»',
                                        'Конфетка',
                                        'Праздничный Торт',
                                        'Новогоднее печенье'
                                    ]
                                )) {
                                name = 'Бутерброд';
                            }

                            var other = item[6];
                            var edate = func.search("Срок годности: (?:[0-9]+) дн\\.\\s*.*?\\s*\\(до ([0-9]+)\\.([0-9]+)\\.([0-9]+)", other);
                            if (edate && edate.length > 0) {
                                dmy = edate[2] + '' + (edate[1] > 9 ? edate[1] : '0' + edate[1]) + '' + (edate[0] > 9 ? edate[0] : '0' + edate[0]);
                            }
                            if (price == 15 && max == 1) {
                                dmy = 1;
                            }
                            //!!!
                            var InsItem = [id, price, min, max, elapsed, dmy, name];
                            if (!List[name]) {
                                List[name] = [InsItem];
                                List['counts'][name] = elapsed;
                            } else {
                                List[name].push(InsItem);
                                List['counts'][name] += elapsed;
                            }

                            if (other && other.indexOf('Встроено заклятие') > -1) {
                                var inserts = func.search("<img[^>]+title=\"?'?([^\"']+)[^>]+>\\s*([0-9]+)\\/([0-9]+)", other);
                                if (inserts && inserts.length > 0) {
                                    var uses = inserts[1];
                                    name = inserts[0];
                                    List['inserts'].push([id, name, uses]);
                                }
                            }

                        }
                        if (resolve) resolve(List);
                        List = null;
                    } else {
                        reject(new Error("Нет доступа к инвентарю"));
                        List = null;
                    }
                })
                .catch(func.errorLog);
        });
    }

    /*+++ Use Item*/
    this.InUse = false;
    this.UseItem = function (list, data) {
        var This = this;
        if (this.InUse) {
            console.debug('Уже используется...');
            func.message('Уже используется...', 'Пожирание ' + list['type']);
            return false;
        }

        this.InUse = true;
        var useit = 0, baduse = 0, price = 0, badprice = 0, count = 0, badcount = 0, mintime = 0, name;

        for (var i in  list) {
            var item = list[i];
            if (/*item[1] == 15 &&*/ item[3] == 1) {
                useit = item[0], price = item[1], count = item[4], name = item[6];
                break;
            }
        }

        //ищем по сроку годности
        if (useit < 1) {
            for (var i in list) {
                var item = list[i];
                if ((item[1] <= 2 && +item[5] < mintime) || mintime < 1) {
                    mintime = +item[5];
                    useit = item[0], price = item[1], count = item[4], name = item[6];
                }
            }
        }

        //остальное
        if (useit < 1) {
            for (var i in list) {
                var item = list[i];

                //сост неполное, цена <= 2кр
                if (item[1] <= 2 && item[2] > 0 && item[2] < 10) {
                    useit = item[0], price = item[1], count = item[4], name = item[6];
                }
                //сост новое, цена <= 2кр
                if (!useit && item[1] <= 2 && (item[2] == 0)) {
                    useit = item[0], price = item[1], count = item[4], name = item[6];
                }
                //сост > 1 и цена выше 2кр. юз в крайнем случае
                if (!baduse && item[1] > 2) {
                    baduse = item[0], badprice = item[1], badcount = item[4], badname = item[6];
                }
            }
        }

        if (useit || baduse) {
            useit = useit ? useit : baduse;
            price = price ? price : badprice;
            count = count ? count : badcount;
            name = name ? name : badname;
            console.debug('Юзаем ' + useit + '[' + count + '](' + price + ' кр)');
            this.InUse = false;

            data = data ? data : false;
            func.query('main.php?edit=1&use=' + useit, data)
                .then(function (html) {
                    if (!data)
                        func.message('Использован "' + name + '" id:' + useit + '[' + count + '](' + price + ' кр)', 'Автоюз');
                    if (This.plugins['Labirint'].started)
                        top.frames["main"].location.href = top.frames["main"].location.href.substring(0, top.frames["main"].location.href.indexOf(".php") + 4);
                })
                .catch(function () {
                    This.InUse = false;
                    func.message('Ошибка ajax! Повторите.', 'Автоюз');
                });
            return true;
        } else {
            this.InUse = false;
            return false;
        }
    }

    this.UseButer = function () {
        var This = this;
        This.Parseitm(2, [
                'Бутерброд -Завтрак рыцаря-',
                'Сытный завтрак',
                'Гренка',
                'Легкий завтрак',
                'Коробка конфет «Ассорти»',
                'Конфетка',
                'Праздничный Торт',
                'Новогоднее печенье'
            ])
            .then(function (list) {
                if (list.counts["Бутерброд"] > 0)
                    This.UseItem(list["Бутерброд"]);
                else
                    func.message("Бутеры закончились", "Автоюз");
            })
            .catch(function (mess) {
                func.message(mess.message, "Автоюз");
            });
    }
    this.UseDot = function () {
        var This = this;
        This.Parseitm(2, ['Антидот'])
            .then(function (list) {
                if (list.counts["Антидот"] > 0)
                    This.UseItem(list["Антидот"]);
                else
                    func.message("Антидоты закончились", "Автоюз");
            })
            .catch(function (mess) {
                func.message(mess.message, "Автоюз");
            });
    }

    /*+++ Dress Item*/
    this.DressItem = function (list) {
        var This = this;
        if (this.InUse) return;
        this.InUse = true;

        var item = list[0],
            id = item[0],
            name = item[6];

        if (id) {
            This.InUse = false;
            func.query('main.php?edit=1&dress=' + id)
                .then(function (data) {
                    top.frames["main"].location.href = top.frames["main"].location.href.substring(0, top.frames["main"].location.href.indexOf(".php") + 4);
                    func.message('Вы одели ' + name, 'Автоарт');
                })
                .catch(function () {
                    This.InUse = false;
                    func.message('Ошибка ajax!', 'Автоарт');
                });
            return true;
        }
        else {
            This.InUse = false;
            return false;
        }
    }

    /*+++ Dress Sets*/
    this.GetSets = function (elm) {
        var This = this;

        func.query("main.php?edit=1")
            .then(function (data) {
                var compelcts = func.searchAll("&complect=([0-9]+).+?>([^<]+)<\\/a>", data);
                var str = "<ul style='list-style-type: none;'>";

                for (var i in compelcts) {
                    str += "<li><a href='#' onclick='top.window.PM.DressSet(" + compelcts[i][0] + ", \"" + compelcts[i][1] + "\");return false;'>" + compelcts[i][1] + "</a> &nbsp;&nbsp;ID:" + compelcts[i][0] + "</li>";
                }
                str += "<li><a href='#' onclick='top.window.PM.DressSet(0);return false;'>Снять все</a></li>";
                str += "</ul>";
                return str;
            })
            .then(function (str) {
                This.CreatePopUp("sets", elm, "<h3>" + elm.title + "</h3><br>" + str);
            })
            .catch(func.errorLog);
    }
    this.DressSet = function (id, name) {
        var This = this;
        var complect_url = "main.php?edit=1&complect=" + id + "&" + Math.random();
        if (!name) complect_url = "main.php?edit=1&undress=all&" + Math.random();
        func.query(complect_url)
            .then(function () {
                if (!name)
                    func.message("Вы сняли комплект");
                else
                    func.message("Вы одели комплект " + name + "[id:" + id + "]");
            })
            .catch(func.errorLog);
    }

    /*+++ Frame creator*/
    this.FrameOpened = false;
    this.contentId = '';
    this.CreateFrame = function (pid, html, size, refresh) {
        if (!size) size = 400;
        var This = this;
        var win = top.frames["plfr"].window;

        if (this.contentId != '' && this.contentId != pid) {
            this.FrameOpened = false;
            $('#frame_' + this.contentId, win.document).css('z-index', '-1');
            $('#frame_' + this.contentId, win.document).html('');
        }

        this.contentId = pid;

        if (!refresh) {
            if (this.FrameOpened) {
                this.FrameOpened = false;
                this.contentId = '';
                $("#close", win.document).click();
                return;
            }
        }


        var frame_div = $("#frame_" + this.contentId, win.document);
        if (frame_div.length == 0) {
            var frame_div = win.document.createElement("div");
            frame_div.id = "frame_" + this.contentId;
            win.document.body.appendChild(frame_div);
        } else frame_div = frame_div[0];
        $(frame_div).css('z-index', '1');
        $(frame_div).html(html);


        var div_close = $("#close", win.document);
        if (div_close.length == 0) {
            var div_close = win.document.createElement("div");
            div_close.id = "close";
            frame_div.appendChild(div_close);
        }
        else div_close = div_close[0];

        $(div_close).bind("click", function () {
            This.CloseFrame();
        });

        top.document.getElementById('plfs').cols = '*,' + size;
        this.FrameOpened = true;
    }
    this.CloseFrame = function (id) {
        /*$("#frame_"+id).remove();
         this.contentId = '';
         this.FrameOpened = false;*/

        var win = top.frames['plfr'];
        //$('#frame_' + this.contentId, win.document).html('');
        $('#frame_' + this.contentId, win.document).remove();
        $('#frame_' + this.contentId, win.document).css('z-index', '-1');
        this.contentId = '';
        this.FrameOpened = false;
        top.document.getElementById('plfs').cols = '*,0';
    }

    /*Side bar creator*/
    this.SidebarOpened = false;
    this.scontentId = '';
    this.CreateSideBar = function (pid, html, side) {
        var This = this;
        side = side || 2;
        var cbp_menu = document.getElementById('cbp-spmenu-s' + side);

        if (classie.has(cbp_menu, 'cbp-spmenu-open')) {
            this.CloseSideBar(true, side, pid);
            return;
        }

        classie.add(document.getElementById('cbp-spmenu-s' + side), 'cbp-spmenu-open');

        var nav_id = "nav_" + pid;
        var nav_div = document.getElementById(nav_id);
        if (!nav_div || nav_div == null) {

            var float = (side == 2) ? "left" : "right";
            var content = '' +
                '<div id="' + nav_id + '">' +
                    //'   <div class="nav_buttons">' +
                    //'       <div class="cbp-spmenu-close" style="float:' + float + ';" onclick="top.window.PM.CloseSideBar(true, \'' + side + '\', \'' + pid + '\')"></div>' +
                    //'       <div class="cbp-spmenu-minimize" style="float:' + float + ';" onclick="top.window.PM.CloseSideBar(false, \'' + side + '\', \'' + pid + '\')"></div>' +
                    //'   </div>' +
                '   <div class="nav_buttons">' +
                '       <div class="popup-close flip" onclick="top.window.PM.CloseSideBar(true, \'' + side + '\', \'' + pid + '\')"></div>' +
                '   </div>' +
                '   <div class="clearfix"></div>' +
                '   <div class="nav_contents">' + html + '</div>' +
                '</div>';

            $(cbp_menu).append(content);
        }
        $('#cbp-spmenu-s' + side).draggable({
            axis: "y",
            handle: ".nav_buttons"
        });
    }
    this.CloseSideBar = function (remove, side, id) {
        if (remove) {
            classie.remove(document.getElementById('cbp-spmenu-s' + side), 'cbp-spmenu-open');
            $("#nav_" + id).remove();
        }
        else {
            if ($('#cbp-spmenu-s' + side + ' #nav_' + id + ' .nav_contents').is(':hidden'))
                $('#cbp-spmenu-s' + side + ' #nav_' + id + ' .nav_contents').show();
            else
                $('#cbp-spmenu-s' + side + ' #nav_' + id + ' .nav_contents').hide();
        }
    }

    /*PopUp creator/closer*/
    this.PopUpOpened = false;
    this.CreatePopUp = function (id, clicked, html, pos) {


        var popup_id = "popup_" + id;
        var popup_div = document.getElementById(popup_id);

        if (popup_div == null) {
            var settDiv = document.getElementById("settings");
            var o, th, lh;

            if (clicked == null) {
                if (pos) {
                    o = {"top": pos[0], "left": pos[1], "right": "0", "bottom": "0"};
                } else {
                    o = {"left": "0", "right": "0", "top": "150", "bottom": "0"};
                }

                th = o.top + 'px';
                lh = o.left + 'px';

            } else {
                o = $(clicked).offset();
                th = (o.top + $(clicked).outerHeight() + 5) + 'px';
                lh = (o.left) + 'px';
            }

            var content = '' +
                '<div class="pp_wrap">' +
                '   <div class="pp_buttons"  >' +
                '       <div class="popup-close" onclick="top.window.PM.ClosePopUp(\'' + id + '\')"></div>' +
                '   </div>' +
                '   <div class="clearfix"></div>' +
                '   <div class="pp_contents">' + html + '</div>' +
                '</div>';

            popup_div = document.createElement("div");
            popup_div.id = popup_id;
            popup_div.className = 'popup_div';
            popup_div.style.top = th;
            popup_div.style.left = lh;
            popup_div.innerHTML = content;
            settDiv.appendChild(popup_div);

            $('#' + popup_id)
                .draggable({
                    handle: ".pp_buttons",
                    scroll: false
                })
                .resizable().css("position", "absolute");

        }
    }
    this.ClosePopUp = function (id) {
        $("#popup_" + id).remove();
    }
}


