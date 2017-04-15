function RadioPL() {
    this.help = "";
    this.name = "Радио";
    this.id = "Radio";
    this.master = null;
    this.menuitem = null;
    this.created = false;
    this.enabled = false;
    this.options = {ulist: false, player_vl: 10};
    this.play = false;
    this.list = [
        ['http://online-kissfm.tavrmedia.ua/KissFM', 'Kiss FM'],
        ['http://online-kissfm.tavrmedia.ua/KissFM_digital', 'Kiss FM Digital 2.0'],
        ['http://online-kissfm.tavrmedia.ua/KissFM_trance', 'Kiss FM Trance 2.0'],
        ['http://online-kissfm.tavrmedia.ua/KissFM_dnb', 'Kiss FM D\'n B 2.0'],
        ['http://stream.kissfm.ua/KissFM_deep', 'Kiss FM - Deep 2.0'],
        ['http://radio.oldbk.com:8000/rusfm', 'OldBK Rus FM'],
        ['http://media.brg.ua:8010/;stream.nsv', 'DJ FM'],
        ['http://pub1.diforfree.org:8000/di_minimal_hi', 'DI.FM - Minimal'],
        ['http://pub1.diforfree.org:8000/di_drumandbass_hi', 'DI.FM - Drum \'n Bass'],
        ['http://pub1.diforfree.org:8000/di_russianclubhits_hi', 'DI.FM - Russian Club Hits'],
        ['http://pub1.diforfree.org:8000/di_trap_hi', 'DI.FM - Trap'],
        ['http://pub1.diforfree.org:8000/di_trance_hi', 'DI.FM - Trance']
    ];
    //this.played          = this.list[0][0];
    this.contentHTML =
        '<div id="radio_m" class="pl_wrap">\
            <div class="pl_section">\
                <div class="pl_section_title">Радио</div>\
                    <table>\
                        <tr>\
                             <!--<td>\
                             button_add\
                             </td>-->\
                             <td id="stations">\
                             </td>\
                        </tr>\
                        <tr>\
                             <td align="center">\
                                <input id="radio_vl" type="range" orient="vertical" min="0" max="10" title="Уровень звука"/>\
                            </td>\
                        </tr>\
                        <tr>\
                            <td>\
                                <input type="button" id="radio_play" value="Play">\
                            </td>\
                         <tr>\
                    <table>\
             </div>\
         </div>';
    this.Start = function (win) {

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
                    This.options = {ulist: false, player_vl: 10};
                }
            }
        }
    }
    this.MenuItem = function () {
        if (this.master != null && this.menuitem == null) {
            var This = this;
            This.mid = this.master.menu_id;
            This.cid = this.master.content_id;
            var menu_item = $('<input type="button" value="Радио"/>');
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
    this.change = function (t) {
        this.play = false;
        this.played = t.value;
        audio.pause();
        audio.setAttribute("src", t.value);
        $('#radio_play').val('Play');
        this.pp();
    }
    this.station = function () {
        s = this.list;
        ret = '<select id="radio_list">';
        for (var i = 0; i < s.length; i++) {
            if (this.played == s[i][0]) {
                ret += '<option value="' + s[i][0] + '" selected>' + s[i][1] + '</option>';
            } else {
                ret += '<option value="' + s[i][0] + '">' + s[i][1] + '</option>';
            }
        }
        if (this.options.ulist != false) {
            ul = this.options.ulist;
            for (var i = 0; i < ul.length; i++) {
                if (this.played == ul[i][0]) {
                    ret += '<option value="' + ul[i][0] + '" selected>' + ul[i][1] + '</option>';
                } else {
                    ret += '<option value="' + ul[i][0] + '">' + ul[i][1] + '</option>';
                }
            }
        }
        ret += '</select>';

        return ret;
    }
    this.ulist_select = function () {
        ret = '<select id="u_list">';
        if (this.options.ulist != false) {

            ul = this.options.ulist;
            for (var i = 0; i < ul.length; i++) {
                ret += '<option value="' + ul[i][0] + '">' + ul[i][1] + '</option>';
            }

        }
        ret += '</select>';

        return ret;
    }
    this.pp = function () {
        if (this.play == false) {
            audio.volume = parseFloat(this.options.player_vl / 10);
            audio.play();
            $('#radio_play').val('Stop');
            this.play = true;
        } else {
            audio.pause();
            audio.setAttribute("src", this.played);
            $('#radio_play').val('Play');
            this.play = false;
        }
    }
    this.vl_ch = function () {
        this.options.player_vl = $('#radio_vl').val();
        audio.volume = parseFloat(this.options.player_vl / 10);
        this.master.SaveOptions(this.id, this.options);
    }
    this.add_st = function () {
        var error = false,
            errTxt = '';
        name = $('#ra_name').val();
        url = $('#ra_url').val();

        if (name == '' && url == '') {
            error = true;
            errTxt = 'Пусто';
        }

        st = this.options.ulist;
        for (var i = 0; i < st.length; i++) {
            if (st[i][1] == name || st[i][0] == url) {
                error = true;
                errTxt = 'Радиостанция с таким именем или потоком уже существуе';
            }
        }

        if (error == false) {
            $('#radio_list, #u_list').append(new Option(name, url));
            p = [url, name];
            if (this.options.ulist == false) {
                this.options.ulist = new Array();
            }
            this.options.ulist.push(p);
            this.master.SaveOptions(this.id, this.options);
        } else {
            alert(errTxt);
        }
    }
    this.st_clear = function () {
        this.options.ulist = false;
        this.master.SaveOptions(this.id, this.options);
        this.created = false;
        this.ToggleContent();
    }
    this.st_del = function () {
        if (this.options.ulist != false) {
            var error = false;
            var val_list = $('#u_list').val();
            if (val_list == '') {
                error = true;
                alert("Нечего удалять");
            }

            if (error == false) {
                var selIndx = $('#u_list')[0].selectedIndex;
                this.options.ulist.splice(selIndx, 1);
                if (this.options.ulist.length < 1) {
                    this.options.ulist = false;
                }
                this.master.SaveOptions(this.id, this.options);
                $('#u_list').html(this.ulist_select());
                $('#radio_list').html(this.station());
            }
        } else {
            alert("Нечего удалять");
        }
    }
    this.init = function () {
        html_vol = '<input id="radio_vl" type="range" min="0" max="10" value="' + this.options.player_vl + '" onchange="RAPL.vl_ch()" title="Уровень звука"/>';
        html_add = '<table valign="top">' +
            '<tr>' +
            '<td colspan="2">' +
            'Добавить радиостанцию' +
            '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>' +
            'Название:' +
            '</td>' +
            '<td>' +
            '<input type="text" id="ra_name">' +
            '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>' +
            'Поток:' +
            '</td>' +
            '<td>' +
            '<input type="text" id="ra_url">' +
            '</td>' +
            '</tr>' +
            '<tr>' +
            '<td colspan="2" align="center">' +
            '<input type="button" value="Добавить" onclick="RAPL.add_st()"/>' +
            '</td>' +
            '</tr>' +
            '<tr>' +
            '<td colspan="2">' +
            'Удалить радиостанцию' +
            '</td>' +
            '</tr>' +
            '<tr>' +
            '<td >' +
            'Название:' +
            '</td>' +
            '<td >' +
            this.ulist_select() +
            '</td>' +
            '<td  align="center">' +
                // '<input type="button" value="Удалить" onclick="RAPL.st_clear()"/>'+
            '<input type="button" value="Удалить" onclick="RAPL.st_del()"/>' +
            '</td>' +
            '</tr>' +
            '</table>';
        button_add = '';
        var player = '<table>' +
            '<tr>' +
            '<td>' +
            button_add +
            '</td>' +
            '<td>' +
            this.station() +
            '</td>' +
            '<td align="center">' +
            html_vol +
            '</td>' +
            '<td>' +
            '<input type="button" id="radio_play" value="Play" onclick="RAPL.pp()">' +
            '</td>' +
            '<tr>' +
            '<table>' +
            '<div id="add_station" style="display:none;"></div>';
        $('#radio_m .pl_section').append(player);
    }
    this.ToggleContent = function () {
        var This = this;
        if (!this.created) {
            $(this.cid).html(this.contentHTML);

            $("#stations").html(this.station());

            if (this.play == true) {
                $('#radio_play').val('Stop');
            }

            $("#radio_add").bind("click", function () {
                if ($("#add_station").css("display") == "none") {
                    $("#add_station").show();
                    $("#add_station").html(html_add);
                }
                else {
                    $("#add_station").hide();
                }
                This.master.ResizeFrame();
            });

            $("#radio_play").bind("click", function () {
                This.pp();
            });

            $("#radio_list").on('change', function () {
                This.change(this);
            });

            $("#radio_vl").on('change', function () {
                This.vl_ch();
            });


            $('#radio_vl').val(this.options.player_vl);

            this.created = true;
        }
        else {
            $("#radio_m ").toggle();
        }
        this.master.ResizeFrame();
    }
    this.Dispose = function () {
        this.created = false;
    }
}