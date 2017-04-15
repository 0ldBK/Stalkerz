function ChatBotPl() {
    this.help = "#";
    this.name = "Чат-Бот";
    this.id = "ChatBot";
    this.master = null;
    this.menuitem = null;
    this.state = 0;
    this.nick = '';
    this.msg = '';
    this.enabled = false;
    this.options = {};
    this.contentHTML =
        '<div id="chat-bot" class="pl_wrap">\
            <div class="pl_section">\
                <form action=""  target="_self" method="POST">\
                    <input type="hidden" name="do" value="msg"/>\
                        <textarea id="msg" style="position:relative;top:5px;width:550px;height:21px;resize:horizontal;padding-top:2px;" onkeypress="if(event.keyCode==10||(event.keyCode==13))post_bot.click();"></textarea>\
                   <input type="button" id="post_bot" value="Send" />\
                </form>\
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
            var menu_item = $('<input type="button" value="Чат-Бот"/>');
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

            $("#post_bot").bind("click", function () {
                if (This.state == 0) {
                    var error = false;

                    if (This.enabled == false) {
                        alert("Плагин выключен. Перейдите в пункт верхнего меню *Настройки* и включите его");
                        error = true;
                        return true;
                    }

                    if ($('#msg').val() == '') {
                        alert('Введите сообщение');
                        error = true;
                    }

                    if (error == false) {
                        $('#msg').attr('readonly', 'readonly');
                        This.state = 1;
                        This.msg = $('#msg').val();
                        This.nick = This.master.user.name;

                        func.query(top.panelDir + "php/chatbot_lite.php", "clan="+This.master.user.clan+"&nick=" + func.strEncode(This.nick) + "&msg=" + func.strEncode(This.msg))
                            .then(function () {
                                This.state = 0;
                                $('#msg').attr('readonly', false);
                                $("#msg").val("");
                            })
                            .catch(func.errorLog);
                    }
                }
                else {
                    this.state = 0;
                    $('#msg').attr('readonly', false);
                }
            });

            this.created = true;
        }
        else {
            $("#chat-bot").toggle();

        }
        this.master.ResizeFrame();
    }
    this.Dispose = function () {
        this.created = false;
        this.MenuItem().css("background-color", "");
    }
}