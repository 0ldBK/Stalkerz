function NastroikaPl() {
    this.name = "Настройка";
    this.id = "Nastroika";
    this.mid = null;
    this.cid = null;
    this.master = null;
    this.created = false;
    this.enabled = true;
    this.menuitem = null;
    this.options = {
        sw_filter: false,
        chat_off: false,
        sound: false,
        is_haos: false,
        is_friday: false,
        chatsize: 60,
        position: 1,
        notification: true
    };
    this.contentHTML =
        '<div id="setting" class="pl_wrap">\
            <div class="pl_section">\
                <div class="pl_section_title">Плагины</div>\
                    <table border="0" id="nastroika" style="padding:2px;">\
                        <tr>\
                        </tr>\
                    </table>\
            </div>\
            <div class="pl_section">\
                <div class="pl_section_title">Доп.настройки</div>\
                    <table border="0"  style="padding:2px;">\
                        <tr>\
                             <td>\
                                Сброс настроек:<input id="restore" type="button" value="Сброс"/> <div style="display:inline;" id="res_id"></div>\
                                 <!--<input id="restore_full" type="checkbox"/>(полный сброс)-->\
                             </td>\
                         </tr>\
                         <tr>\
                             <td>\
                                Ключ сессии:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id="session_id" type="button" value="Получить"/>\
                             </td>\
                        </tr>\
                        <tr>\
                            <td>\
                                <input id="sw_filter" type="checkbox"/>&nbsp;Фильтр сообщений <br>\
                                <input id="sound" type="checkbox"/>&nbsp;Звуковые оповещания <br>\
                                <input id="chat_off" type="checkbox"/>&nbsp;Вход в игру с выкл. чатом <br>\
                                <input id="is_haos" type="checkbox"/>&nbsp;Исчадие Хаоса<br>\
                                <!--<input id="is_friday" type="checkbox"/>&nbsp;Пятницо<br>-->\
                                <!--<input id="notification" type="checkbox"/>&nbsp;Оповещания привата (off)<br>-->\
                                Расположение меню:\
                                <select name="position" id="position">\
                                <option value="3">сверху</option>\
                                <!--<option value="4">снизу</option>-->\
                                <option value="1">слева</option>\
                                <!--<option value="2">справа</option>-->\
                                </select>\
                             </td>\
                        </tr>\
                        <tr>\
                            <td colspan="3">\
                                <input id="chatsize" type="range" name="chatsize" value="60" step="0.5" max="95" min="10" style="margin-left:25px;width:100%;height: 19px;">\
                            </td>\
                        </tr>\
                    </table>\
             </div>\
         </div>';
    this.Start = function (win) {

    };
    this.ApplyOptions = function () {
        var This = this;
        if (this.master != null) {

            if (this.master.global_options[this.id]) {
                if (this.master.global_options[this.id].enabled)
                    This.Enable();
                else
                    This.Disable();

                if (!$.isEmptyObject(this.master.global_options[this.id].value))
                    This.options = $.extend(This.options, this.master.global_options[this.id].value);
                else
                    This.options = {
                        sw_filter: false,
                        chat_off: false,
                        sound: false,
                        is_haos: false,
                        is_friday: false,
                        chatsize: 60,
                        position: 1,
                        notification: true
                    };
            }
        }
    };
    this.Enable = function () {

    };
    this.Disable = function () {

    };
    this.MenuItem = function (redraw) {
        if (this.master != null && (this.menuitem == null || redraw)) {
            var This = this;
            This.mid = this.master.menu_id;
            This.cid = this.master.content_id;
            var menu_item = $('<input type="button" value="Настройки"/>');
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
    };
    this.ToggleContent = function () {
        var This = this;
        if (!this.created) {
            $(this.cid, document).html(this.contentHTML);

            var i = 0;
            var td = $("<td valign='top' style='text-align:left'></td>");
            $("#nastroika tr", document).append(td);

            var plugin_keys = Object.keys(this.master.plugins);
            var cols = (This.master.position == "3") ? 5 : 10;
            for (var pl = 0, len = plugin_keys.length; pl < len; pl++) {
                var plugin = plugin_keys[pl];
                if (plugin == 'Pal')
                    continue;
                if (plugin == This.id)
                    continue;
                if (i == cols) {
                    i = 0;
                    td = $("<td valign='top' style='text-align:left'></td>");
                    $("#nastroika tr").append(td);
                }
                var type = 'checkbox';
                var check_input = $("<input name='" + plugin + "' class='pl_input_set' id='" + plugin + "' type='" + type + "'/>");
                if (This.master.plugins[plugin].enabled) {
                    check_input.attr("checked", "checked");
                }
                td.append(check_input).append(This.master.plugins[plugin].name + " ").append("<br/>");
                i++;
            }


            $('#nastroika input.pl_input_set').change(function () {
                var checked_plugin = This.master.plugins[this.id];

                if (checked_plugin.enabled)
                    checked_plugin.Disable();
                else
                    checked_plugin.Enable();

                if (checked_plugin.id == "AutoFight" && checked_plugin.enabled) {
                    checked_plugin.master.plugins["Restal"].Disable();
                    checked_plugin.master.plugins["AutoUdar"].Disable();
                    $("#Restal").attr("checked", false);
                    $("#AutoUdar").attr("checked", false);
                }
                else if (checked_plugin.id == "Restal" && checked_plugin.enabled) {
                    checked_plugin.master.plugins["AutoFight"].Disable();
                    checked_plugin.master.plugins["AutoUdar"].Disable();
                    $("#AutoFight").attr("checked", false);
                    $("#AutoUdar").attr("checked", false);
                }
                else if (checked_plugin.id == "AutoUdar" && checked_plugin.enabled) {
                    checked_plugin.master.plugins["Restal"].Disable();
                    checked_plugin.master.plugins["AutoFight"].Disable();
                    $("#AutoFight").attr("checked", false);
                    $("#Restal").attr("checked", false);
                }
                $(this).attr("checked", checked_plugin.enabled);
                This.master.SaveOptions();
            });


            $("#restore").bind("click", function () {
                if (confirm('Сбросить настройки? \n' +
                        '\n(После сброса обновите страницу (F5))')) {
                    if (confirm('"ОК" - полный сброс(настройки+карта лабы)\n\n "Отмена" - частичный(только настройки плагина)')) {
                        $.jStorage.flush();
                    }
                    else {
                        $.jStorage.deleteKey('MenuPosition');
                        $.jStorage.deleteKey('GlobalOptions');
                    }
                    func.notify('Сброс настроек', 'Настройки сброшены, обновите страницу');
                    //func.message('Настройки сброшены, обновите страницу', 'Сброс настроек', 'plugin-bot');
                }
            });

            $("#session_id").bind("click", function () {
                var PHPSESSID = func.cookie("PHPSESSID");
                func.notify('Сессия игры', PHPSESSID);
                func.message(PHPSESSID, 'Сессия игры', 'plugin-bot');
            });

            $("#sw_filter").change(function () {
                This.options.sw_filter = $(this).is(":checked");
                This.master.SaveOptions(This.id, This.options);
            });

            $("#chat_off").change(function () {
                This.options.chat_off = $(this).is(":checked");
                This.master.SaveOptions(This.id, This.options);
            });

            $("#sound").change(function () {
                This.options.sound = $(this).is(":checked");
                This.master.SaveOptions(This.id, This.options);
            });

            $("#position").change(function () {
                var expire = 1000 * 60 * 60 * 24 * 30;
                $.jStorage.set('MenuPosition', this.value, {TTL: expire});
                This.master.position = this.value;
                window.location = "battle.php";
                //func.message("Обновите страницу для применения новых настроек.", "Настройки сохранены", "plugin-bot");
            });
            $("#position option[value='" + This.master.position + "']").prop('selected', true);

            $("#is_haos").change(function () {
                This.options.is_haos = $(this).is(":checked");
                This.master.SaveOptions(This.id, This.options);
                if (This.options.is_haos)
                    This.master.CheckIH();
            });

            /*$("#is_friday").change(function () {
                This.options.is_friday = $(this).is(":checked");
                This.master.SaveOptions(This.id, This.options);
                if (This.options.is_friday)
                    This.master.CheckFriday();
            });*/



            $("#notification").change(function () {
                This.options.notification = $(this).is(":checked");
                This.master.SaveOptions(This.id, This.options);
            });

            if (this.options.sw_filter)
                $('#sw_filter').attr("checked", "checked");
            if (this.options.chat_off)
                $('#chat_off').attr("checked", "checked");
            if (this.options.sound)
                $('#sound').attr("checked", "checked");
            if (this.options.is_haos)
                $('#is_haos').attr("checked", "checked");
            //if (this.options.is_friday)
            //    $('#is_friday').attr("checked", "checked");
            if (this.options.notification){
                $('#notification').attr("checked", "checked");
            }


            $("#chatsize").change(function () {
                document.getElementsByTagName("frameset")[1].setAttribute("rows", this.value + "%, *, 0");
                top.srld();

                This.options.chatsize = this.value;
                This.master.SaveOptions(This.id, This.options);
            });
            $("#chatsize").val(this.options.chatsize);


            this.created = true;
        }
        else {
            $("#setting", document).toggle();
        }
        this.master.ResizeFrame();
    };
    this.Dispose = function () {
        this.created = false;
    }
}