function AutoWarPl() {
    this.help = "";
    this.name = "Автовойна";
    this.id = "autowar";
    this.master = null;
    this.menuitem = null;
    this.created = false;
    this.mid = null;
    this.cid = null;
    this.enabled = false;
    this.state = 0;
    this.started = false;
    this.handleTimeout = null;
    this.options = {
        duel: false,
        alliance: false
    };
    this.contentHTML =
        '<div id="' + this.id + '" class="pl_wrap">\
        <div class="pl_section">\
            <div class="pl_section_title">Настройки</div>\
                <div id="infowar" style="height: 16px;"></div>\
                Тип войны:\
                <input id="autowar_duel" class="pl_checkbox" type="checkbox"/>Дуэльная&nbsp;\
                <input id="autowar_alliance" class="pl_checkbox" type="checkbox"/>Альянсовая <br>\
                Объявить клану:<div id="clanlist" style="display: inline"></div>&nbsp;\
                &nbsp;&nbsp;<input id="button_war_start" type="button" value="Старт"/>\
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
                        duel: false,
                        alliance: false
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
            });
            this.menuitem = $(menu_item);
            return this.menuitem;
        } else
            return this.menuitem;
    }
    this.ScanClans = function () {
        var This = this;
        $.ajax({
            type: 'GET',
            url: 'klan.php?razdel=wars#',
            success: function (data) {
                var dat = $(data).find('select[name=mkwarto]').html();
                var sel = $("#clanlist");
                if (dat) {
                    $(sel).html('<select name="clanswar" id="clanswar" size="1">' + dat + '</select>');
                } else {
                    $(sel).html('<select name="clanswar" id="clanswar" size="1"><option value="0">война объявлена</option></select>');
                }
            }
        });
    }
    this.Stop = function () {
        clearTimeout(this.handleTimeout);
        this.started = 0;
        $('#button_war_start').val('Старт');
        $('#a_w_use_duel').attr('disabled', false);
        $('#a_w_use_alliance').attr('disabled', false);
        $('#clanswar').attr('disabled', false);
        $("#infowar").html("");

    }
    this.Begin = function (val) {
        var This = this;
        var infowar = $("#infowar");
        var valuee = $("#clanswar").val();
        var type = 0;

        $("#autowar .pl_checkbox").each(function () {
            if (this.id == "autowar_duel" && $(this).is(":checked")) {
                type = 1;
            }
            else if (this.id == "autowar_alliance" && $(this).is(":checked")) {
                type = 2;
            }
        });

        if (This.started) {
            $.ajax({
                type: 'POST',
                url: 'klan.php?razdel=wars#',
                data: {
                    'mkwarto': valuee,
                    'wt': type,
                    'addwar': '1'
                },
                success: function (data) {
                    var dat = $(data).find('font[color=red]:last').text();
                    $(infowar).html("<font color=red>" + dat + "</font>");
                }
            });
            $(infowar).html("");
            This.handleTimeout = setTimeout(function () {
                This.Begin()
            }, 500);
        }
    }
    this.ToggleContent = function () {
        var This = this;
        //this.ScanClans();

        if (!this.created) {
            this.ScanClans();
            $(this.cid).html(this.contentHTML);

            this.master.SetEvents(this, "autowar");

            if (This.started == 1) {
                $('#a_w_use_duel').attr('disabled', true);
                $('#a_w_use_alliance').attr('disabled', true);
                $('#clanswar').attr('disabled', true);
                $('#button_war_start').val('Стоп');
            }

            $("#button_war_start").on("click", function (i) {
                if (!This.started) {
                    var error = false;

                    if (!This.enabled) {
                        alert("Плагин выключен. Перейдите в пункт верхнего меню *Настройки* и включите его");
                        error = true;
                    }
                    else if (!This.options.alliance && !This.options.duel) {
                        alert("Выберите тип войны");
                        error = true;
                    }
                    else if ($('#clanswar').val() == 0) {
                        alert("Война уже убъявлена");
                        error = true;
                    }
                    else if ($('#clanswar').val() == '') {
                        alert("Выберите клан");
                        error = true;
                    }


                    if (error == false) {
                        $('#a_w_use_duel').attr('disabled', true);
                        $('#a_w_use_alliance').attr('disabled', true);
                        $('#clanswar').attr('disabled', true);
                        $('#button_war_start').val('Стоп');
                        This.started = true;
                        This.Begin();
                    }
                } else {
                    This.Stop();
                }
            });

            this.created = true;

        } else {
            $("#" + this.id).toggle();
        }
        this.master.ResizeFrame();
    }
    this.Dispose = function () {
        this.created = false;
    }
}