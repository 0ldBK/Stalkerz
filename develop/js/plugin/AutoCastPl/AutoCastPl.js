function AutoCastPl () {
    this.help = "#";
    this.name = "Автокаст";
    this.id = "Autocast";
    this.master = null;
    this.menuitem = null;
    this.created = false;
    this.enabled = false;
    this.Elements = {
        water: "Укус Гидры",
        air: "Вой Грифона",
        ground: "Обман Химеры",
        fire: "Гнев Ареса"
    };
    this.options = {
        element: '',
        num: 'I',
        victim: ''
    };
    this.started = false;
    this.contentHTML =
        '<div id="' + this.id + '" class="pl_wrap">\
            <div class="pl_section">\
                <div class="pl_section_title">Настройки</div>\
                    Тип каста:\
                    <select id="Autocast_element" class="pl_selectbox">\
                    <option value="">стихия/свиток</option>\
                    <option value="water">Вода/Укус Гидры</option>\
                    <option value="air">Воздух/Вой Грифона</option>\
                    <option value="ground">Земля/Обман Химеры</option>\
                    <option value="fire">Огонь/Гнев Ареса</option>\
                    </select> &nbsp;\
                    <select id="Autocast_num" class="pl_selectbox">\
                    <option value="I">I</option>\
                    <option value="II">II</option>\
                    <option value="III">III</option>\
                    </select>\
                    Логин жертвы: <input id="Autocast_victim" class="pl_textbox" type="text"/>&nbsp;\
                    <input id="button_Autocast_start" type="button" value="Кастануть"/>\
            </div>\
            <div>\
                <div class="pl_section" id="cast_info"></div>\
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
                        element: '',
                        num: 'I',
                        victim: ''
                    };
                }
            }
        }
    }
    this.Enable = function () {
        this.enabled = true;
        var mi = this.MenuItem();
        if (mi != null) {
            mi.css('display', 'inline');
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

            this.master.SetEvents(this, this.id);

            $("#button_Autocast_start").on("click", function () {
                if (This.options.element != '' & This.options.victim != '') {
                    var elm = This.Elements[This.options.element] + ' ' + This.options.num;

                    This.master.Parseitm(1, [elm])
                        .then(function (list) {
                            if (list.counts[elm] > 0) {
                                This.master.UseItem(list[elm], "sd4=6&target=" + This.options.victim);
                                $("#cast_info").html("<font size='3' color=#003388><font size='3' color=red>Возможно кастанули " + elm + " на " + This.options.victim + "</font>");

                            }
                            else {
                                $("#cast_info").html("<font size='3' color=#003388><font size='3' color=red>" + elm + " закончился</font>");
                            }
                        })
                        .catch(function (mess) {
                            func.message(mess.message, "Автоюз");
                        });

                }
                else {
                    alert("Что-то не ввели =) ");
                }
            });

            this.created = true;
        }
        else {
            $("#" + this.id).toggle();
        }
        this.master.ResizeFrame();
    }
    this.Dispose = function () {
        this.created = false;
    }
}