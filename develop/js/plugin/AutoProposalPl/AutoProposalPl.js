function AutoProposalPl() {
    this.help = "#";
    this.name = "Автозаявка";
    this.id = "autoproposal";
    this.master = null;
    this.menuitem = null;
    this.started = false;
    this.enabled = false;
    this.options = {
        startime: 300,
        timeout: 3,
        htype: 3,
        levellogin: 0,
        autoblow: true,
        travma: false,
        buter_hp: 0,
        start_hp: 80,
        random: false
    };
    this.handleTimeout = null;
    //this.posted         = false;
    //this.inBattle       = false;
    this.contentHTML =
        '<div id="' + this.id + '" class="pl_wrap">\
        <div class="pl_section">\
            <div class="pl_section_title">Настройки плагина</div>\
            <table>\
                <tr>\
                    <td>\
                        Юз бутера при ХП менее(%):\
                    </td>\
                    <td>\
                        <input type="text" name="autoproposal_buter_hp" id="autoproposal_buter_hp" class="pl_numbox"> * 0 не использовать.\
                    </td>\
                </tr>\
                <tr>\
                    <td>\
                        Подача заявки при ХП более(%):\
                    </td>\
                    <td>\
                        <input type="text" name="autoproposal_start_hp" id="autoproposal_start_hp" class="pl_numbox">\
                    </td>\
                </tr>\
                <tr>\
                    <td colspan="2" style="vert-align: bottom;">\
                        <input id="proposal_start" type="button" value="Старт">\
                    </td>\
                </tr>\
            </table>\
        </div>\
        <div class="pl_section">\
            <div class="pl_section_title">Настройки заявки</div>\
                <table>\
                    <tr>\
                        <td>\
                            <legeng>Начало боя через </legeng>\
                            <select name="autoproposal_startime" id="autoproposal_startime" class="pl_selectbox">\
                                <option value="300">5 минут</option>\
                                <option value="600">10 минут</option>\
                                <option value="900">15 минут</option>\
                                <option value="1800">30 минут</option>\
                                <option value="2700">45 минут</option>\
                                <option value="3600">1 час</option>\
                            </select>\
                        </td>\
                        <td>\
                            <legeng>Таймаут </legeng>\
                            <select name="autoproposal_timeout" id="autoproposal_timeout" class="pl_selectbox">\
                                <option value="3">3 мин.</option>\
                                <option value="5">5 мин.</option>\
                                <option value="10">10 мин.</option>\
                            </select>\
                        </td>\
                        <td>\
                            <legeng>Тип боя </legeng>\
                            <select name="autoproposal_htype" id="autoproposal_htype" class="pl_selectbox">\
                                <option value="3">с оружием</option>\
                                <option value="5">кулачный</option>\
                            </select>\
                        </td>\
                    </tr>\
                    <tr>\
                        <td colspan="3">\
                            <legeng>Уровни бойцов </legeng>\
                            <select name="autoproposal_levellogin" id="autoproposal_levellogin" class="pl_selectbox">\
                               <!--<option value="11">Бой на букетах, любой уровень (до 100 игроков в заявке, без вмешательства)</option>-->\
                               <option value="0">любой уровень (до 150 игроков в заявке, без вмешательства)</option>\
                               <option value="10">Бой на елках, любой уровень (до 100 игроков в заявке, без вмешательства)</option>\
                               <option value="3">только моего уровня (до 50 игроков в заявке)</option>\
                               <option value="6">мой уровень +/- 1 (до 50 игроков в заявке)</option>\
                           </select>\
                        </td>\
                    </tr>\
                    <tr>\
                        <td colspan="3">\
                            <input type="checkbox" name="autoproposal_autoblow" id="autoproposal_autoblow" class="pl_checkbox"> Бой c автоударом <br />\
                            <input type="checkbox" name="autoproposal_travma" id="autoproposal_travma" class="pl_checkbox"> Бой без правил<br />\
                            <input type="checkbox" name="autoproposal_random" id="autoproposal_random" class="pl_checkbox"> Cлучайное распределение\
                        </td>\
                    </tr>\
                </table>\
        </div>\
    </div>';
    this.Start = function (win) {
        if (this.started) {
            //if(win.document.URL.indexOf("fbattle.php") != -1){
            //    this.inBattle = true;
            //}
            //else {
            //    this.inBattle = false;
            //}
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
                        startime: 300,
                        timeout: 3,
                        htype: 3,
                        levellogin: 0,
                        autoblow: true,
                        travma: false,
                        buter_hp: 0,
                        start_hp: 80,
                        random: false
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

            this.master.SetEvents(this, "autoproposal");

            if (This.started) {
                $("#proposal_start").val('Стоп');
            }

            $("#proposal_start").bind("click", function () {
                if (!This.started) {
                    This.Begin();
                } else {
                    This.End();
                }
            });

            this.created = true;
        } else {
            $("#" + this.id + "").toggle();
        }
        this.master.ResizeFrame();
    }
    this.Dispose = function () {
        this.created = false;
    }
    this.Begin = function () {
        var This = this;
        this.started = true;
        $("#proposal_start").val('Стоп');
        This.SendProposal();
    }
    this.End = function () {
        clearTimeout(this.handleTimeout);
        this.started = false;
        //this.inBattle = false;
        //this.posted = false;
        $("#proposal_start").val('Старт');
    }
    this.CheckStatus = function (callback) {
        //top.frames.main.location.href = "zayavka.php?level=haos&"+Math.random();
        clearTimeout(this.handleTimeout);
        var st = {"hp": 0, "maxhp": 0, "status": 0, "statustext": '', "interval": 15000};

        $.get("zayavka.php?level=haos&" + Math.random(), function (data) {

            var statustxt = [
                'Подать заявку на хаотичный бой',
                'Ожидаем начала группового боя',
                'Ваш ход',
                'В этой комнате нельзя подавать заявки',
                'Бой закончен! Всего вами нанесено урона',
                'Ожидаем хода противника',
                'Ожидаем, пока бой закончат другие игроки',
                'Данные не получены',
                '<center>cloudflare-nginx</center>',
                'Веб-страница недоступна',
                'убегаете из клуба?'
            ].join('|');

            //var statustxtTostr = statustxt.join('|');
            var res = func.search('(' + statustxt + ')', data);
            if (res.length > 0) {
                if (res == "Подать заявку на хаотичный бой") {
                    st['status'] = 1;
                    st['statustext'] = res;
                }
                else {
                    st['status'] = 2;
                    st['statustext'] = res;
                }
            } else {
                st['status'] = 3;
                st['statustext'] = "Опять...ошибка..нужно отловить !!!";
            }

            var resHP = func.search(': ([0-9]+)/([0-9]+)', data);
            if (resHP.length > 0) {
                st['hp'] = resHP[0];
                st['maxhp'] = resHP[1];
            }
            callback(st);
        });
    }
    this.SendProposal = function () {
        var This = this;
        if (!this.started) {
            return;
        }

        this.CheckStatus(function (status) {

            switch (status['status']) {
                case 1:
                    if (status['maxhp'] == This.master.user.vinos * 6) {
                        console.log("По ходу упали шмотки )");
                        This.End();
                        func.message("По ходу упали шмотки )", "Автозаявка");
                        return;
                    }
                    else if (This.options.buter_hp > 0 && 100 * status['hp'] / status['maxhp'] < This.options.buter_hp) {
                        This.master.ParseInv('buter', function (list) {
                            var counts = list['counts'];
                            if (counts > 0) {
                                console.log("Хиляемся....");
                                This.master.UseItem(list);
                                This.handleTimeout = setTimeout(function () {
                                    This.SendProposal();
                                }, status['interval'] / 7);
                            }
                            else {
                                /*This.options.buter_hp = 0;
                                 $("#autoproposal_buter_hp").val(This.options.buter_hp);
                                 This.master.SaveOptions();*/
                                //$.message("Возможно закончились бутеры, ждем регена....", "Автозаявка");
                                This.handleTimeout = setTimeout(function () {
                                    This.SendProposal();
                                }, status['interval']);
                            }
                        });
                        return;
                    }
                    else if (100 * status['hp'] / status['maxhp'] < This.options.start_hp) {
                        console.log("Ждем пока хп восстановится");
                        This.handleTimeout = setTimeout(function () {
                            This.SendProposal();
                        }, status['interval'] * 2);
                        return;
                    }
                    else {
                        //startime2=300
                        // &timeout=3&
                        // levellogin1=6&
                        // k=3&
                        // hrandom=on
                        // &cmt=
                        // &securityCode=&
                        // open=%CF%EE%E4%E0%F2%FC+%E7%E0%FF%E2%EA%F3&
                        // view=10
                        // &level=haos&
                        // confirm2=1&
                        // securityCode1=&
                        // price3263898=0&
                        // price3263891=0&
                        // price3263877=0&
                        // securityCode2=
                        console.log("Подаем заявку");
                        $.post("zayavka.php?level=haos&tklogs=&logs=", {
                            startime2: This.options.startime,
                            timeout: This.options.timeout,
                            levellogin1: This.options.levellogin,
                            hrandom: This.options.random ? 'on' : '',
                            k: This.options.htype,
                            autoblow: This.options.autoblow ? 'on' : '',
                            travma: This.options.travma ? 'on' : '',
                            cmt: "",
                            securityCode: "",
                            securityCode1: "",
                            view: This.master.user.level,
                            level: "haos",
                            confirm2: 1,
                            /*price1: 0,
                             price2: 0,*/
                            open: 1
                        }).done(function (data) {
                            var error = false, msg = '',
                                responsemsg = [
                                    'Вы подали заявку на бой',
                                    'Вы не ввели защитный код!',
                                    'Неверный защитный код!',
                                    'Вы слишком ослаблены для боя, восстановитесь.',
                                    'У вас тяжелая травма, вы не сможете драться...',
                                    'В этой комнате нельзя подавать заявки.',
                                    'У вас средняя травма, поединки с оружием слишком тяжелы для вас'
                                ].join('|');


                            //var responsemsgTostr = ;
                            var res = func.search('(' + responsemsg + ')', data);
                            if (res.length > 0) {
                                if (res != "Вы подали заявку на бой") {
                                    error = true;
                                    msg = res;
                                } else {
                                    msg = res;
                                }
                            }
                            else {
                                console.log("Не известная ошибка");
                                This.End();
                                func.message("Не известная ошибка", "Автозаявка");
                            }


                            if (!error) {
                                top.frames.main.location.href = "zayavka.php?level=haos&" + Math.random();
                                func.message(msg, "Автозаявка");
                                This.handleTimeout = setTimeout(function () {
                                    This.SendProposal();
                                }, status['interval']);
                            } else {
                                This.End();
                                func.message(msg, "Автозаявка");
                            }
                        });
                    }

                    break;

                case 2:
                    console.log(status['statustext']);
                    if (status['statustext'] == "Ожидаем, пока бой закончат другие игроки") {
                        status['interval'] = 5000;
                    }
                    else if (status['statustext'] == "Ожидаем начала группового боя") {
                        top.frames.main.location.href = "zayavka.php?level=haos&" + Math.random();
                    }
                    else if (status['statustext'] == "Бой закончен! Всего вами нанесено урона") {
                        status['interval'] = 2000;
                    }
                    else if (status['statustext'] == "В этой комнате нельзя подавать заявки") {
                        console.log(status['statustext']);
                        This.End();
                        func.message(status['statustext'], "Автозаявка");
                        return;
                    }
                    This.handleTimeout = setTimeout(function () {
                        This.SendProposal();
                    }, status['interval']);

                    break;

                case 3:
                    console.log(status['statustext']);
                    This.handleTimeout = setTimeout(function () {
                        This.SendProposal();
                    }, status['interval'] * 4);

                    break;

            }
        });
    }
}