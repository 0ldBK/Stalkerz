function FludPL() {
    this.help = "#";
    this.name = "Флудер";
    this.id = "flud";
    this.master = null;
    this.menuitem = null;
    this.created = false;
    this.mid = null;
    this.cid = null;
    this.enabled = false;
    this.started = false;
    this.sent = 0;
    this.handleTimeout = null;
    this.hso = false;
    this.flud_tl = 0;
    this.options = {
        interval: 5,
        limit: 0,
        chtype: 8,
        message: [],
        history: null
    };
    this.contentHTML =
        '<div id="' + this.id + '" class="pl_wrap">\
        <div class="pl_section">\
            <div class="pl_section_title">Автофлудер</div>\
                <table cellpadding="0" cellspacing="0" style="padding:0; margin:5px;">\
                    <tr>\
                        <td valign="top">\
                             <textarea id="flud_message" style="width: 100%;height:54px;" class="pl_textareabox"></textarea><br/>\
                             Кол-во повторений <input class="pl_numbox" type="text" id="flud_limit" value="0"> *0 - без ограничений\
                             &nbsp;&nbsp;&nbsp;&nbsp;\
                             С интервалом\
                             <select id="flud_interval" class="pl_selectbox">\
                                 <option value="3">3</option>\
                                 <option value="5">5</option>\
                                 <option value="10">10</option>\
                                 <option value="30">30</option>\
                             </select>мин.\
                             Чат\
                             <select id="flud_chtype" class="pl_selectbox">\
                                 <option value="1">общий</option>\
                                 <option value="8">торговый</option>\
                             </select>\
                             <input  type="button" value="История" id="flud_history">\
                             <input type="button" value="Старт" id="flud_start">\
                        </td>\
                        <td id="flud_history_h" valign="top">\
                        </td>\
                    </tr>\
                </table>\
                <div id="flud_sent"></div>\
                <div id="flud_timeLeft"></div>\
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
                        interval: 5,
                        limit: 0,
                        chtype: 8,
                        message: [],
                        history: null
                    };
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
    this.ToggleContent = function () {
        var This = this;
        if (!this.created) {
            $(this.cid).html(this.contentHTML);

            this.master.SetEvents(this, "flud");

            if (this.started) {
                $('#flud #flud_start').val('Стоп');
                $('#flud textarea, #flud_limit, #flud_interval, #flud_chtype').attr('disabled', true);
                $('#flud #flud_sent').text('Отправлено: ' + this.sent);
            }

            $("#flud_start").bind("click", function () {
                if (This.started) {
                    This.Stop();
                } else {
                    This.Begin();
                }
            });

            $("#flud_history").bind("click", function () {
                This.History();
            });


            /*$("#flud select, input, textarea").change(function () {
             if(this.id == 'f_interval'){
             This.options.interval = parseInt($(this).val(), 10);
             }
             else if(this.id == 'f_chtype'){
             This.options.chtype = parseInt($(this).val(), 10);
             }
             else if(this.id == 'f_limit'){
             This.options.limit = parseInt($(this).val(), 10);
             }
             else if(this.id == 'f_message'){
             This.options.message = $(this).val();
             }
             This.master.SaveOptions();
             });


             $("#f_interval [value='" + this.options.interval + "']").prop('selected', true);
             $("#f_chtype [value='" + this.options.chtype + "']").prop('selected', true);
             $("#f_limit").val(this.options.limit);
             $("#f_message").val(this.options.message);*/

            this.created = true;
        }
        else {
            $("#" + this.id).toggle();
        }
        this.master.ResizeFrame();
    }
    this.Begin = function () {
        var This = this;
        this.started = true;
        this.sent = 0;

        if (this.options.message.length == 0) return;

        this.History_add();

        $('#flud #flud_start').val('Стоп');
        $('#flud_message, #flud_limit, #flud_interval, #flud_chtype').attr('disabled', true);

        this.handleTimeout = setInterval(function () {
            This.Send();
        }, 1000 * (This.options.interval * 60));
        setTimeout(function () {
            This.Send();
        }, 100);


    }
    this.Stop = function () {
        this.started = false;
        $('#flud #flud_start').val('Старт');
        clearInterval(this.handleTimeout);
        this.flud_tl = 0;

        $('#flud_message, #flud_limit, #flud_interval, #flud_chtype').attr('disabled', false);
    }
    this.Send = function () {
        var This = this;
        var message = This.options.message[0];
        this.flud_tl = (this.options.interval * 60);

        var url = 'http://chat.oldbk.com/ch.php?chtype=' + This.options.chtype + '&om=&sys=&text=' + func.strEncode(message) + '&tsound=';

        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'jsonp',
            timeout: 30000
        });

        this.sent++;
        $('#flud #flud_sent').text('Отправлено: ' + this.sent);
        this.master.ResizeFrame();

        var limit = This.options.limit;

        if (limit > 0 && limit == this.sent) This.Stop();

        This.Timeleft();

    }
    this.History = function () {
        var This = this;

        if (this.hso == false) {
            this.hso = true;
            h = this.options.history;
            if (h != null) ha = h.split('|:|');
            $('#flud_history_h').html('<center><b>История</b></center>');
            if (h == null) {
                $('#flud_history_h').append('<center>Ваша история пуста</center>');
            } else {
                for (var i = 0; i < ha.length; i++) {
                    $('#flud_history_h').append('<input type="button" class="history_msg" value="<<" id="h_' + i + '"> <span id="msg_' + i + '">' + ha[i] + '</span><br/>');
                }
                $('#flud_history_h').append('<p style="text-align:left;"><input type="button" value="Очистить" id="flud_clear"></p>');
            }
        } else {
            $('#flud_history_h').html('');
            this.hso = false;
        }
        this.master.ResizeFrame();

        $("#flud_clear").bind("click", function () {
            This.History_clear();
        });

        $("#flud .history_msg").bind("click", function () {
            var st = this.id.substring(2);
            This.History_open(st);
        });
    }
    this.History_add = function () {
        var This = this;

        h = this.options.history, upd = 0;
        if (h == undefined) {
            nh = new Array();
            nh.push(this.options.message[0]);
            upd = 1;
        } else if (h.split('|:|').length >= 3) {
            if (h.indexOf(this.options.message[0]) == -1) {
                nh = h.split('|:|');
                nh.splice(0, 1);
                nh.push(this.options.message[0]);
                upd = 1;
            }
        } else {
            if (h.indexOf(this.options.message[0]) == -1) {
                nh = h.split('|:|');
                nh.push(this.options.message[0]);
                upd = 1;
            }
        }
        if (upd == 1) {
            this.options.history = nh.join('|:|');
            upd = 0;
        }

        This.master.SaveOptions(This.id, This.options);
    }
    this.History_clear = function () {
        var This = this;
        this.options.history = null;
        $('#flud_history_h').html('<center>История очищена</center>');
        this.hso = false;
        This.master.SaveOptions(This.id, This.options);
    }
    this.History_open = function (i) {
        if (this.started) {
            alert("Остановите флудер!");
            return;
        }
        hs = $('#msg_' + i).text();
        $('#flud_message').val(hs);
        this.options.message[0] = hs;
        this.master.SaveOptions(this.id, this.options);
    }
    this.Timeleft = function (n) {
        var This = this;
        this.flud_tl--;
        if (this.flud_tl <= 0) {
            this.flud_tl = 0;
            $('#flud_timeLeft').text('До следующего сообщения: --:--');
            return false;
        } else {
            var mm = parseInt(this.flud_tl / 60);
            var ss = this.flud_tl - mm * 60;
            if (mm < 10) mm = "0" + mm;
            if (ss < 10) ss = "0" + ss;
            setTimeout(function () {
                This.Timeleft();
            }, 1000);
            $('#flud_timeLeft').text('До следующего сообщения: ' + mm + ":" + ss);
        }
        this.master.ResizeFrame();
    }
    this.Dispose = function () {
        this.created = false;
    }
}