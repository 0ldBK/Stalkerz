function WarPl() {
    this.name = "Локатор";
    this.id = "War";
    this.master = null;
    this.menuitem = null;
    this.state = 0;
    this.enabled = false;
    this.created = false;
    this.options = {
        enemies: [],
        user_filter: 1,
        clan_filter: {'dark': true, 'bright': true, 'neutral': true},
        clan_list: {}
    };
    this.FrameOpen = false;
    this.Enemies = [];
    this.RefreshList = [];
    this.AttackOrder = [];
    this.AttackType = 0;
    this.DuelWar = false;
    this.contentHTML = '\
        <div id="War" class="pl_wrap">\
           <div class="pl_section">\
               <div class="pl_section_title">Локатор</div>\
                   <table>\
                       <tr>\
                           <td colspan="3">\
                               <div id="War_clan_filter"> Фильтр: темные<input  id="filter_dark" type="checkbox">\
                                   светлые<input  id="filter_bright" type="checkbox">\
                                   нейтралы<input  id="filter_neutral" type="checkbox">\
                               </div>\
                           </td>\
                       </tr>\
                       <tr>\
                           <td>\
                               <select  id="War_enemies" size="10" style="width: 100px;" multiple="multiple"></select>\
                           </td>\
                           <td valign="middle">\
                               <input id="War_enemies_right" type="button" value=">>>"><br>\
                               <input id="War_enemies_left" type="button" value="<<<"><br>\
                               <input id="War_btn_clear_all" type="button" value="Очистить"><br>\
                               <input id="War_btn_load" value="Загрузить" type="button"><br>\
                               <input id="War_btn_refresh" type="button" value="Обновить"><br>\
                           </td>\
                           <td valign="top">\
                               <select id="War_enemies_selected"  size="10" style="width:100px;" multiple="multiple"></select>\
                           </td>\
                       </tr>\
                       <tr>\
                           <td colspan="3">\
                               <div id="War_user_filter">\
                                   <input  type="radio" name="War_user_filter" value="1"> всех\
                                   <input  type="radio" name="War_user_filter" value="3"> невидимки\
                                   <input  type="radio" name="War_user_filter" value="2"> только онлайн\
                                   &nbsp;&nbsp; уровень\
                                   <select id="War_level" name="War_level">\
                                       <option value=""></option>\
                                       <option value="7">7</option>\
                                       <option value="8">8</option>\
                                       <option value="9">9</option>\
                                       <option value="10">10</option>\
                                       <option value="11">11</option>\
                                       <option value="12">12</option>\
                                       <option value="13">13</option>\
                                   </select>\
                               </div>\
                           </td>\
                       </tr>\
                   </table>\
           </div>\
           <iframe name="warfr" src="klan.php?razdel=wars" style="visibility:hidden; height: 5px;"></iframe>\
           <div id="War_sostav" style="line-height:0.2em;"></div>\
           <div style="width:100%;text-align: center;" id="War_progress"></div>\
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
                        enemies: [],
                        user_filter: 1,
                        clan_filter: {
                            'dark': true,
                            'bright': true,
                            'neutral': true
                        },
                        clan_list: {}
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
                if (This.master.Current != This) This.master.Current.Dispose();
                This.master.Current = This;
                if (This.enabled) {
                    This.ToggleContent();
                }
            });
            this.menuitem = $(menu_item);
        }
        return this.menuitem;
    }
    this.Dispose = function () {
        this.created = false;
    }
    this.ToggleContent = function () {
        var This = this;
        if (!this.created) {
            //$(this.cid, document).html(this.contentHTML);

            This.master.CreatePopUp(this.id, null, this.contentHTML);

            this.loadClans()
                .then(function (clans) {
                    $("#"+This.id+" #War_enemies").html(clans);
                });
            //Radio
            $("#War_user_filter > input", document).each(function () {
                var each = this;
                $(this).change(function () {
                    var id = this.name.replace(This.id + "_", "");
                    This.options[id] = this.value;
                    This.master.SaveOptions(This.id, This.options);
                });
            });
            $("#War_user_filter > input[value=" + This.options.user_filter + "]", document).attr("checked", "checked");

            $("#War_auto_attack").bind("click", function () {
                This.AttackType = 0;
                This.AttackOrder = [];
                if ($(this).val() == "Автонападение") {
                    for (var i in This.Enemies) {
                        if (This.Enemies[i].checked)
                            This.AttackOrder.push(This.Enemies[i]);
                    }
                    This.AttackType = 2;
                    $(this).val("Остановить");
                    This.AutoAttack();
                } else $(this).val("Автонападение");
            });
            $("#War_btn_load").bind("click", function () {
                This.RefreshWarlist();
            });
            $("#War_btn_refresh").bind("click", function () {
                This.RefreshWarlist();
            });
            $("#War_btn_add_all").bind("click", function () {
                $("#War_enemies option").prop('selected', true);
                $("#War_enemies_right").click();
            });
            $("#War_btn_clear_all").bind("click", function () {
                $("#War_enemies_selected option").prop('selected', true);
                $("#War_enemies_left").click();
            });

            //////////////////////
            if (!$.isEmptyObject(This.options.enemies)) {
                var option = '';
                $(This.options.enemies).each(function (i, enemy) {
                    option += "<option value=" + enemy + ">" + enemy + "</option>";
                });
                $("#" + This.id + " #War_enemies_selected").html(option);

            }

            $("#War_enemies_right").bind("click", function () {
                $.each($("#War_enemies option:selected"), function () {
                    if (func.in_array($(this).val(), This.options.enemies))
                        return true;
                    This.options.enemies.push($(this).val());
                    $("#War_enemies_selected").append($("<option value=" + $(this).val() + ">" + $(this).val() + "</option>"));

                });
                This.master.SaveOptions(This.id, This.options);
            });

            $("#War_enemies_left").bind("click", function () {
                $.each($("#War_enemies_selected option:selected"), function () {
                    This.options.enemies.splice(This.options.enemies.indexOf($(this).val()), 1);
                    $(this).remove();
                });
                This.master.SaveOptions(This.id, This.options);
            });
            //////////////////////////

            $("#War_clan_filter > input").each(function () {
                $(this).change(function () {
                    var id = this.id.replace("filter_", "");
                    This.options.clan_filter[id] = $(this).is(':checked');
                    This.loadClans().then(function (option) {
                        $("#War select#War_enemies").html(option);
                    });
                    This.master.SaveOptions(This.id, This.options);
                });


                var id = this.id.replace("filter_", "");
                $(this).attr("checked", This.options.clan_filter[id]);


            });

            //this.created = true;
        }
        else {
            //This.master.ClosePopUp(this.id);
            //$("#"+this.id, document).toggle();
        }
        //this.master.ResizeFrame();
    }
    this.DrawEnemies = function () {
        var This = this;
        var enemies_html = '';
        this.RefreshList = [];
        this.DuelWar = false;
        var display = '';

        for (var i in this.Enemies) {
            var nevid = false;

            this.Enemies[i].checked = false;
            this.display = this.Enemies[i].lasttime;

            if ($("#War_level option:selected").val() != '') {
                if ($("#War_level option:selected").val() != this.Enemies[i].level) {
                    continue;
                }
            }

            if (this.options.user_filter == 2) {
                if (this.Enemies[i].ingame == 'offline') {
                    continue;
                }
            }

            if (this.options.user_filter == 3) {
                if (
                    (this.Enemies[i].lasttime == '1 мин.') &&
                    this.Enemies[i].battle == 0 &&
                    this.Enemies[i].ingame == 'offline' &&
                    this.Enemies[i].room == ''
                ) {
                    nevid = true;
                    this.display = ' - <font color=brown>невид???</font>';
                }
                else if (
                    (this.Enemies[i].lasttime == 'меньше минуты') &&
                        //this.Enemies[i].battle == 0 &&
                    this.Enemies[i].ingame == 'offline' &&
                    this.Enemies[i].room == ''
                ) {
                    this.display = ' - выкл. чат';
                }
                else {
                    continue;
                }
            }

            enemies_html += '<span id="e' + this.Enemies[i].id + '" style="display:block;">' +
                '<b><a title="Нападение" style="cursor: pointer" onclick="window.PM.plugins[\'War\'].doAttack(\'post_attack\', \'' + this.Enemies[i].login + '\', \'klan.php?razdel=wars\', \''+this.Enemies[i].id+'\');">X </a></b>' +
                '<b><a title="Аркан" style="cursor: pointer" onclick="window.PM.plugins[\'War\'].doAttack( \'post_attack2\', \'' + this.Enemies[i].login + '\', \'klan.php?razdel=wars\', \''+this.Enemies[i].id+'\');">A </a></b>' +
                '<b><a title="Противостояние" style="cursor: pointer" onclick="window.PM.plugins[\'War\'].doAttack(\'opposition\', \'' + this.Enemies[i].login + '\', \'myabil.php\', \''+this.Enemies[i].id+'\');">DP </a></b>' +
                '<img src="http://i.oldbk.com/i/align_' + this.Enemies[i].align + '.gif" title="" height="15" width="12">' +
                '<a href="http://oldbk.com/encicl/klani/clans.php?clan=' + this.Enemies[i].clan + '" target="_blank">' +
                '<img src="http://i.oldbk.com/i/klan/' + this.Enemies[i].clan + '.gif" title="' + this.Enemies[i].clan + '">' +
                '</a>' +
                '<span id="login_'+this.Enemies[i].id+'" onclick="top.window.func.selectText(this.id);" class="ahm" style="cursor:pointer;">' +
                '<b>' + this.Enemies[i].login + '</b>' +
                '</span>' + ' [' + this.Enemies[i].level + ']' +
                '<a href="http://capitalcity.oldbk.com/inf.php?' + this.Enemies[i].id + '" target="_blank" title="Инф. о ' + this.Enemies[i].login + '">' +
                '<img src="http://i.oldbk.com/i/inf.gif" alt="Инф. о ' + this.Enemies[i].login + '" border="0" height="11" width="12">' +
                '</a> ' +
                (this.Enemies[i].ingame == 'online' ? this.Enemies[i].room : this.display) +
                '<span class="War_attack_info"></span>' +
                '</span>' +
                '<br>';
        }
        if (enemies_html.length == 0) {
            enemies_html = 'ничего не нашли...';
        }
        $("#War_sostav").html(enemies_html);

    }
    this.RefreshWarlist = function () {
        var This = this;
        $("#War_sostav").html('');

        var enem = this.options.enemies.length > 0 ? this.options.enemies : $("#" + This.id + " #War_enemies option").map(function() {return $(this).val();}).get();

        if(enem.length > 70){
            alert("Многовато....");
            return;
        }

        $.ajax({
            url: top.panelDir + 'php/clans.php?clans=' + enem ,
            dataType: 'json',
            async: true,
            success: function (data) {
                This.Enemies = data;
            },
            beforeSend: function () {
                $("#War_progress").html('<img height="20px" src="' + top.panelDir + 'img/294.gif" />');
            },
            complete: function () {
                $("#War_progress").html('');
                This.DrawEnemies();
            },
            error: function () {
                This.Enemies = [];
            }
        });


    }
    this.loadClans = function () {
        var This = this;

        return new Promise(function (resolve) {

            if(Object.keys(This.options.clan_list).length == 0){
                var par = func.param({
                    "dark": true,
                    "bright": true,
                    "neutral": true
                });
                func.query(top.panelDir + 'php/getclans.php?' + par)
                    .then(function (clans) {
                        clans = func.evalJSON(clans);
                        This.options.clan_list = clans;
                        This.master.SaveOptions(This.id, This.options);
                    })
                    .then(function () {
                        var options = '';
                        for (var i in This.options.clan_list) {
                            if(
                                This.options.clan_filter["neutral"] === false && This.options.clan_list[i].type["neutral"] ||
                                This.options.clan_filter["dark"] === false && This.options.clan_list[i].type["dark"] ||
                                This.options.clan_filter["bright"] === false && This.options.clan_list[i].type["bright"]

                            ){
                                continue;
                            }
                            options += '<option value="' + This.options.clan_list[i].name + '">' + This.options.clan_list[i].name + '</option>';
                        }
                        resolve(options);
                    })
                    .catch(func.errorLog);
            }
            else {
                var options = '';
                for (var i in This.options.clan_list) {

                    if(
                        This.options.clan_filter["neutral"] === false && This.options.clan_list[i].type == "neutral" ||
                        This.options.clan_filter["dark"] === false && This.options.clan_list[i].type == "dark" ||
                        This.options.clan_filter["bright"] === false && This.options.clan_list[i].type == "bright"

                    ){
                        continue;
                    }
                    options += '<option value="' + This.options.clan_list[i].name + '">' + This.options.clan_list[i].name + '</option>';
                }
                resolve(options);
            }
        });
    }
    this.doAttack = function (magic, target, url, id) {
        var selector = 'font[color=red]:eq(0)';
        var data = "abit=undefined&sd4=" + this.master.user.id + "&use="+magic+"&target=" + func.strEncode(target);

        func.query(url, data)
            .then(function (html) {

                if($(html).text().search("Не в бою|Ваш ход") !=-1) {
                    top.frames['main'].location = '/fbattle.php';
                    return;
                }

                var dat = $(html).find(selector).text();
                $("#e"+id+" .War_attack_info").html("  : <font color=red>" + dat + "</font>");

                setTimeout(function() {
                    $("#e"+id+" .War_attack_info").html('');
                }, 2000);

            })
            .catch(func.errorLog);
    }
}

