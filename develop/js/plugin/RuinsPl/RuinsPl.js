function RuinsPl() {
    this.name = "Руины";
    this.id = "Ruins";
    this.master = null;
    this.menuitem = null;
    this.created = false;
    this.enabled = false;
    this.options = {map: 0, loc: 0, profile: '', autowin: false};
    this.RuinsFrame = 0;
    this.Location = '';
    this.Team = '';
    this.SayProfile = false;
    this.contentHTML =
        '<div id="ruins_options" class="pl_wrap"> \
            <div class="pl_section"> \
                <div class="pl_section_title">Руины</div> \
                    <table cellpadding="0"> \
                        <tr valign="top"> \
                            <td style="width:5px"></td> \
                            <td> \
                                <input id="ruins_map" type="button" value="Карта" /> \
                                <input id="ruins_reset" type="button" value="Сброс" /> \
                            </td> \
                            <td style="width:5px"></td> \
                            <td> \
                                Профиль: \
                                <input class="pl_textbox" id="ruins_profile" type="text" value="" size="10" /> \
                                <input id="ruins_autowin" class="pl_checkbox" type="checkbox" /> автопобеда по таймауту \
                            </td> \
                        </tr> \
                    </table> \
            </div> \
        </div>';
    this.Start = function (win) {
        var This = this;
        if (win.document.URL.indexOf("fbattle.php") != -1 && this.options.autowin) {
            $("#refreshb", win.document.body).click();
        }
        if (win.document.URL.indexOf("/ruines.php") != -1) {
            win.document.getElementById('ione').style.display = "none";
        }
        if ((win.document.URL.indexOf("/ruines.php") != -1 || (win.document.URL.indexOf("/fbattle.php") != -1 && this.options.map > 0)) && !this.RuinsFrame) {
            if (win.document.URL.indexOf("/ruines.php") != -1) {
                var regex = /(\d{6,10})" target="_blank">Лог турнира/;
                var res = win.document.body.innerHTML.match(regex);
                if (res && res.length > 1) {
                    this.options.map = res[1];
                    this.options.loc = 0;
                }
                this.master.SaveOptions(this.id, this.options);
            }
            this.RuinsFrame = 1;
            this.SayProfile = true;
            top.document.getElementById("plfs").cols = '*,400';
        }
        else if (win.document.URL.indexOf("/ruines_start.php") != -1 && this.RuinsFrame) {
            this.RuinsFrame = 0;
            top.document.getElementById("plfs").cols = '*,0';
            top.frames["plfr"].window.document.head.innerHTML = "";
            top.frames["plfr"].window.document.body.innerHTML = "";
        }
        if (win.document.URL.indexOf("/ch.php?online=") != -1 && this.RuinsFrame > 0) {
            var html_doc = win.document.getElementsByTagName("head");
            if (html_doc.length > 0)
                html_doc = html_doc[0];
            else
                html_doc = win.document.body;
            var js_plugin = win.document.createElement("script");
            js_plugin.setAttribute("type", "text/javascript");
            js_plugin.setAttribute("src", top.panelDir + "js/plugin/RuinsPl/RuinsChat.js?" + Math.random());
            js_plugin.setAttribute("charset", "utf-8");
            html_doc.appendChild(js_plugin);
            js_plugin = null;
        }
        if (win.document.URL.indexOf("/ruines_start.php") != -1 && this.options.map > 0) {
            this.options.map = 0;
            this.master.SaveOptions(this.id, this.options);
        }
        if (this.options.map > 0 && this.RuinsFrame) {
            var html_doc = win.document.getElementsByTagName("head");
            if (html_doc.length > 0)
                html_doc = html_doc[0];
            else
                html_doc = win.document.body;

            var js_plugin = win.document.createElement("script");
            js_plugin.setAttribute("type", "text/javascript");
            js_plugin.setAttribute("src", top.panelDir + "js/plugin/RuinsPl/Ruins.js?" + Math.random());
            js_plugin.setAttribute("charset", "utf-8");
            html_doc.appendChild(js_plugin);
            js_plugin = null;
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
                        map: 0,
                        loc: 0,
                        profile: '',
                        autotime: false
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
    this.MenuItem = function (redraw) {
        if (this.master != null && (this.menuitem == null || redraw)) {
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
        }
        return this.menuitem;
    }
    this.ToggleContent = function () {
        var This = this;
        if (!this.created) {
            $(this.cid, document).html(this.contentHTML);
            $("#ruins_reset", document).bind("click", function () {
                This.RuinsFrame = 0;
                top.document.getElementById("plfs").cols = '*,0';
                top.frames["plfr"].window.document.head.innerHTML = "";
                top.frames["plfr"].window.document.body.innerHTML = "";
                top.frames["main"].window.document.location.reload();
            });
            $("#ruins_autowin", document).change(function () {
                This.options.autowin = $(this).is(":checked");
                This.master.SaveOptions(This.id, This.options);
            });
            $("#ruins_profile", document).keyup(function () {
                if (this.id == 'ruins_profile') {
                    This.options.profile = $(this).val();
                }
                This.master.SaveOptions(This.id, This.options);
            });
            this.created = true;
            if (this.options.autowin) $("#ruins_autowin", document).attr("checked", "checked");
            $("#ruins_profile", document).val(this.options.profile);
        } else {
            $("#ruins_options", document).toggle();
        }
        this.master.ResizeFrame();
    }
    this.Dispose = function () {
        this.created = false;
        this.MenuItem().css("background-color", "");
    }
}