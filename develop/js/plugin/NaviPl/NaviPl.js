function NaviPl() {
    this.help = "#";
    this.name = "Навигация";
    this.id = "Navi";
    this.master = null;
    this.menuitem = null;
    this.state = 0;
    this.enabled = false;
    this.options = {};
    this.contentHTML =
        '<div id="navi" class="pl_wrap">\
             <div class="pl_section">\
                <div style="display: table-caption">\
                    <input id="zayavka" type="button" value="Завершенки"  />\
                    <input id="give" type="button" value="Карта Миров"  />\
                    <input id="klan_arsenal" type="button" value="Арсенал"  />\
                    <input id="mybox" type="button" value="Сундук"  />\
                    <input id="invent" type="button" value="Инвентарь" />\
                    <input id="effect" type="button" value="Состояние" />\
                    <input id="secretroom" type="button" value="Секретка"  />\
                </div>\
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
                    This.options = {};
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
            var menu_item = $('<input type="button" value="Navi"/>');
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
    this.ToggleContent = function () {
        var This = this;

        if (!this.created) {
            $(this.cid).html(this.contentHTML);

            $("#zayavka").bind("click", function () {
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1;

                var yyyy = today.getFullYear();
                var yy = yyyy.toString().substring(2);
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                var today = dd + '.' + mm + '.' + yy;
                top.frames["main"].location.href = "zayavka.php?logs=" + today + "&" + Math.random;
            })

            $("#secretroom").bind("click", function () {
                func.query("main.php?path=1.100.1.50");
                //top.frames["main"].location.href = "main.php?path=1.100.1.50";
            });
            $("#give").bind("click", function () {
                top.frames["main"].location.href = "main.php?setch=" + Math.random();
            });

            $("#klan_arsenal").bind("click", function () {
                top.frames["main"].location.href = "klan_arsenal.php";
            });
            $("#invent").bind("click", function () {
                top.frames["main"].location.href = "main.php?edit=1&razdel=0";
            });
            $("#mybox").bind("click", function () {
                top.frames["main"].location.href = "klan_arsenal.php?mybox=1";
            });
            $("#effect").bind("click", function () {
                top.frames["main"].location.href = "main.php?edit=1&effects=1";
            });

            this.created = true;
        } else {
            $("#navi").toggle();
        }
        this.master.ResizeFrame();
    }
    this.Dispose = function () {
        this.created = false;
    }
}