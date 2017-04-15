function TrapPl() {
    this.help = "";
    this.name = "Ловушки";
    this.id = "Trap";
    this.master = null;
    this.menuitem = null;
    this.state = 0;
    this.started = false;
    this.enabled = false;
    this.options = {
        lastMsgID: 0
    };
    this.timeOfLastLova = "";
    this.indexOfLastLova = 0;
    this.txtOfLastLova = "";
    this.contentHTML =
        '<div id="lova" class="pl_wrap">\
            <div class="pl_section">\
                <div class="pl_section_title">Запуск</div>\
                <input id="lova_start" type="button" value="Старт" />\
            </div>\
            <div id="lova_res"></div>\
         </div>';
    this.Start = function (win) {
        if (this.started) {
            // console.log("azaza");
            // This.Begin();
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
                    This.options = {lastMsgID: 0};
                }
            }
        }
    }
    this.MenuItem = function () {
        if (this.master != null && this.menuitem == null) {
            var This = this;
            This.mid = this.master.menu_id;
            This.cid = this.master.content_id;
            var menu_item = $('<input type="button" value="Ловушки"/>');
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
        // clearTimeout(this.timer);
        this.started = false;
        $('#lova_start').val('Старт');
        this.enabled = false;
        var mi = this.MenuItem();
        if (mi != null) {
            mi.css('display', 'none');
        }
    }
    this.ToggleContent = function () {
        var This = this;
        if (!this.created) {
            $(this.cid).html(this.contentHTML);
            if (this.started) {
                $('#lova_start').val('Стоп');
            }

            $("#lova_start").bind("click", function () {
                if (!This.started) {
                    var error = false;
                    if (This.enabled == false) {
                        alert("Плагин выключен. Перейдите в пункт верхнего меню *Настройки* и включите его");
                        error = true;
                    }
                    if (error == false) {
                        This.started = true;
                        This.Begin();
                    }
                    else {
                        This.started = false;
                        This.Stop();
                    }
                }
                else {
                    This.started = false;
                    This.Stop();
                }
                This.master.SaveOptions(This.id, This.options);
            });


            this.created = true;
        }
        else {
            $("#lova").toggle();
        }
        this.master.ResizeFrame();
    }
    this.Dispose = function () {
        this.created = false;
        this.MenuItem().css("background-color", "");
    }
    this.Stop = function () {
        this.started = false;
        $('#lova_start').val('Старт');

    }
    this.Begin = function () {
        //01:28 [30.01.2015 01:28] Внимание! Тринити попала в вашу ловушку в локации Центральная площадь. Парализован на 2 минуты...
        if (this.started) {
            $('#lova_start').val('Стоп');
            var This = this,
                debugMod = false,
                txtOfMsg = "",
                chat = $(top.frames['chat'].window.document.body).html(),
                strTarget = "Внимание!",
                strTargetmsg = ["овушк", "минуты"],
                fontColor = (debugMod) ? "Black" : "red",
                MsgID = $(".stext:contains(" + strTargetmsg[0] + ") font[color='" + fontColor + "']:contains('" + strTarget + "')," +
                    ".stext:contains(" + strTargetmsg[1] + ") font[color='" + fontColor + "']:contains('" + strTarget + "')", chat)
                    .last()
                    .parent()
                    .attr("id");

            if (MsgID !== undefined) {
                if (MsgID != This.options.lastMsgID) {
                    This.options.lastMsgID = MsgID;

                    MsgID = MsgID.replace(/\+/g, '\\+').replace(/\:/g, '\\:');
                    txtOfMsg = $("#" + MsgID + "", $(chat)).text();

                    var regex = /private/i;
                    var Temp01 = regex.test(txtOfMsg);
                    if (!Temp01) {
                        txtOfMsg = txtOfMsg.substring(txtOfMsg.indexOf("Внимание") + 10);
                        This.SendTrap(txtOfMsg);
                    }
                }
            }
            setTimeout(function () {
                This.Begin();
            }, 1000 * 15);
        }
    }
    this.SendTrap = function (text) {
        if (this.started) {
            var formData = new FormData();
            formData.append("nick", func.strEncode("Trap-bot"));
            formData.append("msg", func.strEncode(text));

            var request = func.XHR();
            if (request) {
                request.open("POST", top.panelDir + "php/chatbot_lite.php", true);
                request.send(formData);
            }
        }
    }
}