function ResetHpPl() {
    this.help = "";
    this.name = "Сброс ХП";
    this.id = "ResetHP";
    this.master = null;
    this.menuitem = null;
    this.created = false;
    this.mid = null;
    this.cid = null;
    this.enabled = false;
    this.started = false;
    this.show = 0;
    this.sh = false;
    this.options = {
        interval: 5,
        set_id: 0,
        set_name: "",
        timer: null
    };
    this.contentHTML =
        '<div id="reset_hp" class="pl_wrap">\
             <div class="pl_section">\
                <div class="pl_section_title">Автосброс хп</div>\
                <input id="button_reset_hp" type="button" value="Старт"/><br>\
                <input class="reset_hp_textbox" id="interval_reset_hp" type="text" style="width:20px" />Интервал (сек.)<br>\
                <input id="reset_hp_showsets" type="button" title="Комплекты" value="Выбрать"  /><br>\
                <span id="sets_text"></span>\
                <span style="margin-left:14px;" id="reset_hp_time"></span>\
             </div>\
        </div>';
    this.SetName = function (name, id) {
        if (id == 0) {
            $('#sets_text').html('  <b>Комплект не выбран!</b>');
        }
        else if (id == null) {
            $('#sets_text').html('  <b>Комплект не существует</b>');
        }
        else {
            $('#sets_text').html('  Комплект:  <b>' + name + '</b>');
        }
    }
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
                        interval: 5,
                        set_id: 0,
                        set_name: "",
                        timer: null
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
            var menu_item = $('<input type="button"  value="Сброс хп"/>');
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
    this.DressIdSet = function (setsid, callback) {
        var url = "main.php?edit=1&complect=" + setsid;
        if (setsid == 0) {
            url = "main.php?edit=1&undress=all";
        }
        $.get(url);
        if (callback) {
            callback();
        }
    }
    this.GetSets = function (elm) {
        var This = this;

        func.query("main.php?edit=1")
            .then(function (data) {
                var compelcts = func.searchAll("&complect=([0-9]+).+?Надеть.+?([^<\"]+)", data);
                var str = "<ul style='list-style-type: none;'>";

                for (var i in compelcts) {
                    str += "<li><a href='#' onclick='top.window.PM.ClosePopUp(\"auto_sets\");top.window.PM.plugins[\"ResetHP\"].SelectSet(" + compelcts[i][0] + ", \"" + compelcts[i][1] + "\");return false;'>" + compelcts[i][1] + "</a> &nbsp;&nbsp;ID:" + compelcts[i][0] + "</li>";
                }
                str += "</ul>";
                return str;
            })
            .then(function (str) {
                This.master.CreatePopUp("auto_sets", elm, "<h3>" + elm.title + "</h3><br>" + str);
            })
            .catch(func.errorLog);

    }
    this.SelectSet = function (id, name) {
        var This = this;
        This.show = 0;
        $("#reset_hp_showsets").val("Выбрать");
        This.options.set_id = id;
        This.options.set_name = name;
        This.SetName(This.options.set_name, This.options.set_id);
        This.master.SaveOptions(This.id, This.options);
    }
    this.Stop = function () {
        var This = this;
        This.DressIdSet(This.options.set_id);
        clearTimeout(This.options.timer);
        This.started = false;
        $('#button_reset_hp').val('Старт');
        $('#interval_reset_hp').attr('disabled', false);
        $('#reset_hp_showsets').attr('disabled', false);
    }
    this.ToggleContent = function () {
        var This = this;

        if (!this.created) {
            $(this.cid).html(this.contentHTML);

            if (This.started) {
                This.SetName(This.options.set_name, This.options.set_id);
                $('#interval_reset_hp').attr('disabled', true);
                $('#reset_hp_showsets').attr('disabled', true);
                $('#button_reset_hp').val('Стоп');
            }

            $("#button_reset_hp").bind("click", function () {
                if (!This.started) {
                    var error = false;
                    if (This.options.set_id == 0) {
                        alert('Выберете комплект!');
                        error = true;
                    }

                    if (isNaN(This.options.interval) || This.options.interval == 0 || This.options.interval == "") {
                        alert('Установите интервал');
                        error = true;
                    }
                    else if (This.options.interval <= 2) {
                        alert("Выберете интервал больше");
                        error = true;
                    }


                    if (error == false) {
                        $('#interval_reset_hp').attr('disabled', true);
                        $('#reset_hp_showsets').attr('disabled', true);
                        $('#button_reset_hp').val('Стоп');
                        This.started = true;
                        This.Begin();
                    }
                } else {
                    This.Stop();
                }
                This.master.SaveOptions(This.id, This.options);
            });

            $("#reset_hp .reset_hp_textbox").keyup(function () {
                if (this.id == 'use_reset_hp') {
                    This.options.set_id = parseInt($(this).val(), 10);
                } else if (this.id == 'interval_reset_hp') {
                    This.options.interval = parseInt($(this).val(), 10);
                }
                This.master.SaveOptions(This.id, This.options);
            });

            $("#reset_hp_showsets").bind("click", function () {
                This.GetSets(this);
            });

            this.created = true;


            $("#interval_reset_hp").val(this.options.interval);
            This.SetName(This.options.set_name, This.options.set_id);

        } else {
            $("#reset_hp").toggle();
        }
        this.master.ResizeFrame();

    }
    this.Begin = function () {
        var This = this;
        if (This.options.set_id != 0) {
            This.options.timer = setTimeout(function () {
                This.Begin()
            }, This.options.interval * 1000);


            This.DressIdSet(0);
            setTimeout(function () {
                This.DressIdSet(This.options.set_id);
            }, 500);
        }
    }
    this.Dispose = function () {
        this.created = false;
    }
}