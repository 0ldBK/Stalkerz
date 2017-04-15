function RunAwayPl() {
    this.help = "";
    this.name = "Автобег";
    this.id = "RunAway";
    this.master = null;
    this.menuitem = null;
    this.state = 0;
    this.enabled = false;
    this.options = {interval: 5, count: 0, text: ""};
    this.interval = 0;
    this.text = '';
    this.city = '';
    this.count = 0;
    this.countdata = 0;
    this.timer = null;
    this.contentHTML =
        '<div id="run" class="pl_wrap">\
            <div class="pl_section">\
                <div class="pl_section_title">Настройки автобега</div>\
                    <table  cellpadding="0">\
                        <tr valign="top">\
                             <td>\
                                 <input name="room_list" class="pl_checkbox" type="checkbox" value="room1" checked>Комната для новичков<br />\
                                 <input name="room_list" class="pl_checkbox" type="checkbox" value="room2" checked>Комната для новичков 2<br />\
                                 <input name="room_list" class="pl_checkbox" type="checkbox" value="room3" checked>Комната для новичков 3<br />\
                                 <input name="room_list" class="pl_checkbox" type="checkbox" value="room4" checked>Комната для новичков 4<br />\
                                 <input name="room_list" class="pl_checkbox" type="checkbox" value="room5" checked>Зал Воинов<br />\
                                 Интервал (сек.):&nbsp;<input class="pl_numbox" id="run_interval" type="text" value="60" style="width:20px" />\
                             </td>\
                             <td>\
                                 <input name="room_list" class="pl_checkbox" type="checkbox" value="room6" checked>Зал Воинов 2<br />\
                                 <input name="room_list" class="pl_checkbox" type="checkbox" value="room7" checked>Зал Воинов 3<br />\
                                 <input name="room_list" class="pl_checkbox" type="checkbox" value="room8" checked>Торговый Зал<br />\
                                 <input name="room_list" class="pl_checkbox" type="checkbox" value="room9" checked>Рыцарский зал<br />\
                                 <input name="room_list" class="pl_checkbox" type="checkbox" value="room10" checked>Башня рыцарей-магов<br />\
                                 <input id="run_start"  type="button" value="Старт"  />\
                             </td>\
                        </tr>\
                    </table>\
            </div>\
         </div>';
    this.Start = function (win) {
        if (win.document.URL.indexOf("fbattle.php") != -1) {
            this.Stop();
        }
        if (this.enabled == false) {
            this.Dispose();
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
                    This.options = {interval: 5, count: 0, text: ""};
                }
            }
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
        }
        else
            return this.menuitem;
    }
    this.Enable = function () {
        this.enabled = true;
        var mi = this.MenuItem();
        if (mi != null) {
            // mi.removeClass("input_pl_off");
            mi.css('display', 'inherit');
        }
    }
    this.Disable = function () {
        this.state = 0;
        this.enabled = false;
        var mi = this.MenuItem();
        if (mi != null) {
            // mi.addClass("input_pl_off");
            mi.css('display', 'none');
        }
    }
    this.ToggleContent = function () {
        var This = this;
        if (!this.created) {
            $(this.cid).html(this.contentHTML);

            //После переключения к другому плагину обновляем состояние текста
            if (This.state == 1) {
                $('#run_start').val('Стоп');

            }
            $("#run_start").bind("click", function () {
                if (This.state == 0) {
                    var error = false;
                    if (This.enabled == false) {
                        alert("Плагин выключен. Перейдите в пункт верхнего меню *Настройки* и включите его");
                        error = true;
                    }
                    else if (isNaN(This.options.interval)) {
                        error = true;
                        alert('Интервал не должен быть пустым');
                    }

                    // var val1 = parseInt($('#run_interval').val());
                    // if (!isNaN(val1)) {
                    // This.options.interval = val1;
                    // } else {
                    // alert('Интервал не должен быть пустым');
                    // error = true;
                    // }


                    if (error == false) {
                        $('#run_interval').attr('readonly', 'readonly');
                        $('#run_start').val('Стоп');
                        This.state = 1;
                        var c = /capitalcity/g;
                        if (top.frames["main"].location.href.match(c))
                            This.city = 'capitalcity';
                        else
                            This.city = 'avaloncity';
                        This.countdata = 0;
                        This.Begin();

                    }
                } else {
                    This.Stop();
                }
            });
            $("#run .pl_numbox").keydown(function (e) {
                var key = e.charCode || e.keyCode || 0;
                return (key == 8 || key == 46 || (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
            });
            $("#run .pl_numbox").keyup(function () {
                if (this.id == 'run_interval') {
                    This.options.interval = parseInt($(this).val(), 10);
                }
                This.master.SaveOptions(This.id, This.options);
            });

            $('#run_interval').val(this.options.interval);
            this.created = true;
        }
        else {
            $("#run").toggle();
        }
        this.master.ResizeFrame();
    }
    this.Dispose = function () {
        this.created = false;
        this.MenuItem().css("background-color", "");
    }
    this.Stop = function () {
        var This = this;
        This.countdata = 0;
        This.state = 0;
        $('#run_start').val('Старт');
        $('#run_interval').attr('readonly', false);

    }
    this.RunForestRun = function (room) {
        var run_url = "main.php?setch=1&got=1&" + room + "=1";

        if (room == 0) run_url = "main.php";
        func.query(run_url)
            .catch(func.errorLog);
    }
    this.Begin = function () {
        var This = this;

        function count_rooms() {
            var count = 0;
            for (var i = 0; i < document.getElementsByName("room_list").length; i++) {
                if (document.getElementsByName("room_list")[i].checked == true) {
                    count++;
                }

            }
            return (count);
        }

        function next_rooms() {
            var next = -1;
            while (next == -1) {
                next = Math.floor(Math.random() * document.getElementsByName("room_list").length);
                if (document.getElementsByName("room_list")[next].checked != true)
                    next = -1;
            }
            return next;
        }

        function change_room(room_name) {
            This.RunForestRun(room_name);
        }

        var room_count = count_rooms();
        if (room_count < 2) {
            alert("Выберите минимум две комнаты");
        }
        else {
            if (This.state != 0) {
                start_run()
            }
        }

        function start_run() {
            if (This.state != 0) {
                var next = next_rooms();
                change_room(document.getElementsByName("room_list")[next].value);
                setTimeout(start_run, This.options.interval * 1000);
            }

        }
    }
}