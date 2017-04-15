function PalPL() {
    this.help = "";
    this.name = "Пал панель";
    this.id = "Pal";
    this.master = null;
    this.menuitem = null;
    this.state = 0;
    this.started = false;
    this.enabled = false;
    this.options = {};
    this.allowedbuttons = [];
    this.buttonsrepo = {
        sleep: {
            name: 'Наложить заклятие молчания',
            magic: 'sleep',
            type: ''
        },
        sleep_off: {
            name: 'Снять заклятие молчания',
            magic: 'sleep_off',
            type: '1'
        },
        sleepf: {
            name: 'Наложить заклятие форумного молчания',
            magic: 'sleepf',
            type: ''
        },
        sleepf_off: {
            name: 'Снять заклятие форумного молчания',
            magic: 'sleepf_off',
            type: '1'
        },
        haosn: {
            name: 'Наложить заклятие хаоса',
            magic: 'haosn',
            type: '144'
        },
        haosn_off: {
            name: 'Снять заклятие хаоса',
            magic: 'haosn_off',
            type: '1'
        },
        death: {
            name: 'Наложить заклятие смерти',
            magic: 'death',
            type: '1'
        },
        death_off: {
            name: 'Снять заклятие смерти',
            magic: 'death_off',
            type: '1'
        },
        obezl: {
            name: 'Наложить заклятие обезличивания',
            magic: 'obezl',
            type: '2'
        },
        obezl_off: {
            name: 'Снять заклятие обезличивания',
            magic: 'obezl_off',
            type: '1'
        },
        marry: {
            name: 'Зарегистрировать брак',
            magic: 'marry',
            type: '4'
        },
        unmarry: {
            name: 'Расторгнуть брак',
            magic: 'unmarry',
            type: '4'
        },
        check: {
            name: 'Поставить проверку',
            magic: 'check',
            type: '1'
        },
        ldadd: {
            name: 'Добавить запись в ЛД',
            magic: 'ldadd',
            type: 'ldadd'
        },
        note: {
            name: 'Добавить комментарий в бой',
            magic: 'note',
            type: 'note'
        }
    };
    this.contentHTML =
        '<div id="Pal" class="pl_wrap">\
            <div class="pl_section">\
                <div class="pl_section_title">Пал панель</div>\
            </div>\
         </div>';
    this.Start = function (win) {
        /*if (this.started) {

         }*/
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
                this.SetAllowedButtons();
                this.AddPalButtons();
            }
        }
    }
    this.MenuItem = function () {
        if (this.master != null && this.menuitem == null) {
            var This = this;
            This.mid = this.master.menu_id;
            This.cid = this.master.content_id;
            var menu_item = $('<input type="button" value="Пал панель"/>');
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
        this.started = false;
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
    this.SetAllowedButtons = function () {

        var This = this;

        func.query("orden.php")
            .then(function (html) {
                var magics = func.searchAll('i\\/magic\\/(.+?)\.gif', html);

                for (var i in magics) {
                    if (magics.hasOwnProperty(i)) {
                        if (This.buttonsrepo[magics[i]])
                            This.allowedbuttons.push(This.buttonsrepo[magics[i]]);
                    }
                }
                This.allowedbuttons.push(This.buttonsrepo['ldadd']);
            });

    }
    this.AddPalButtons = function () {
        var This = this;

        $("#menu_buttons_right").append('<div id="pbtnpal" style="background: #ebebeb url(http://i.oldbk.com/i/align_' + this.master.user.align + '.gif) no-repeat center center;" title="Пал панель"></div>');


        $("#pbtnpal").on("click", function (e) {

            var html = '<div id="magic-type">';
            for (var span in This.allowedbuttons) {
                if (!This.allowedbuttons[span]) {
                    continue;
                }
                html += '<br><span style="padding: 2px; cursor: pointer;" onclick="PM.plugins[\'Pal\'].new_runmagic(\'' + This.allowedbuttons[span].name + '\',\'' + This.allowedbuttons[span].magic + '\',\'target\',\'target1\',\'' + This.allowedbuttons[span].type + '\'); return false;"><img src="http://i.oldbk.com/i/magic/' + This.allowedbuttons[span].magic + '.gif" title="' + This.allowedbuttons[span].name + '"></span>';
            }
            html += '<br><span  style="padding: 2px; cursor: pointer;" onclick="PM.plugins[\'Pal\'].showPrice(this); return false;"><img src="http://i.oldbk.com/i/sh/undef.gif" title="Прайс молчанок"></span>' +
                    //'<div id="pal_res"></div>' +
                '</div>';

            //This.master.CreatePopUp("fast_pal", this, html);
            This.master.CreateSideBar("fast_pal", html, 2);
        });

        setTimeout(function () {
            $("#pbtnpal").click();
        }, 2000);


        $("#mes", top.frames.chat.document).on("click", ".date2, .date", function (e) {
            e.preventDefault();
            if (document.getElementById("pal_res")) {
                if (e.target.className == "date2" || e.target.className == "date") {
                    var msg, msgId = func.search('\\(event,\\"(.+?)\\"\\)', e.target.attributes[1].nodeValue);
                    for (var i = 0, curr_mess = top.frames.chat.MsgArray; i < curr_mess.length; i++) {
                        if (/*curr_mess[i][1] != "5" &&*/ curr_mess[i][0].indexOf(msgId) != -1) {
                            msg = func.trim_spaces(func.strip_tags(curr_mess[i][0]));
                            msg += ' /// ';
                            $("#ldtext").val(msg).focus();
                            break;
                        }
                    }
                }
            }
        });

        top.AddTo = func.addCallListener(top.AddTo, {
            before: function (props) {
                var target;

                if (props.args[1] && props.args[1].altKey) {
                    target = document.getElementById('target');

                    if (target) {
                        target.value = props.args[0];
                    }
                } else {
                    target = document.getElementById('target');

                    if (target) {
                        target.value = props.args[0];
                        props.ssmtext = {
                            txt: $("input#ssmtext", top.frames.bottom.document.body).val()
                        };
                    }
                }
            },
            after: function (props) {

                if (document.getElementById('target')) {
                    if (props.ssmtext.txt.length == 0) {
                        $("input#ssmtext", top.frames.bottom.document.body).val("").blur();
                    } else {
                        $("input#ssmtext", top.frames.bottom.document.body).val(props.ssmtext.txt);
                    }
                    $("select[name=timer]").focus();
                }
            },
            error: function (props) {
                console.log('error', props);
            }
        });

    }
    this.showPrice = function (elm) {
        this.new_runmagic('azaza', '<div style="margin: 0 auto;width: 60px;"><img src="http://i.oldbk.com/i/smiles/horse.gif" width="60" height="40" border="0" alt=""></div>', '', '', 'log');
        return;

        var html = '' +
                //'<div>' +
            '   <table class="price-table" cellpadding="0" cellspacing="0" border="0">' +
            '       <thead>' +
            '       <tr>' +
            '           <th >' +
            '               №' +
            '           </th>' +
            '           <th>' +
            '               Вид нарушения' +
            '           </th>' +
            '           <th>' +
            '               Чат/Форум' +
            '           </th>' +
            '       </tr>' +
            '       </thead>' +
            '       <tbody>' +
            '       <tr>' +
            '           <td>' +
            '               <strong>1.1.</strong>' +
            '           </td>' +
            '           <td>' +
            '               Нарушение правил рекламы боев, торговли и рекламы услуг/флуд/капс/спам сообщениями, неклановой рекламой, проведением азартных игр/публичное общение на иноcтpанном языке/попрошайничество. Помехи в проведении свадебной церемонии. Помехи в работе паладину/флуд в рабочих топиках паладинов/нарушение установленных правил конференции форума/многократные сообщения постороннего характера, либо явно не имеющие отношения к нарушениям, с помощью функции "Сообщить о нарушении' +
            '           </td>' +
            '           <td>' +
            '               <p class="price-timer" data-timer="15"> 15 минут</p>' +
            '           </td>' +
            '       </tr>' +
            '       <tr>' +
            '           <td>' +
            '               <strong>1.2.</strong>' +
            '           </td>' +
            '           <td>' +
            '               Провокация конфликта и призывы к нарушению закона/любые намеки о нетрадиционной сексуальной ориентации в сторону других персонажей/адресные личные негативные характеристики/любые упоминания родственников с нелестными намеками/создание любых топов с тематикой межнационального конфликта и начинание/поддержание таких тем в чате' +
            '           </td>' +
            '           <td>' +
            '               <p class="price-timer" data-timer="15"> 15 минут</p>' +
            '           </td>' +
            '       </tr>' +
            '       <tr>' +
            '           <td>' +
            '               <strong>2.</strong>' +
            '           </td>' +
            '           <td>' +
            '               Нарушение правил клановой рекламы/ссылки на любые рессурсы, накручивающие рейтинг клан сайтов/реклама незарегистрированного клана/ссылки на сторонние не игровые ресурсы/флуд в чате "Помощь"/поиск/предложение услуг по "выносу" с обещанием доп.бонусов/поиск игроков, идущих на ПСЖ/реклама любых сторонних предприятий, компаний, заведений и т.д., не имеющих отношения к проекту ОлдБК/поиск/предложение покупки/продажи персонажей или кланов во всех локациях ОлдБК с посредничеством Ком.отдела' +
            '           </td>' +
            '           <td>' +
            '               <p class="price-timer" data-timer="60"> 1 час</p>' +
            '           </td>' +
            '       </tr>' +
            '       <tr>' +
            '           <td>' +
            '               <strong>3.</strong>' +
            '           </td>' +
            '           <td>' +
            '               Оскорбления/завуалированные оскорбления/цитата оскорблений/грубость' +
            '           </td>' +
            '           <td>' +
            '               <p class="price-timer" data-timer="30"> 1-2 слова	30 минут</p>' +
            '               <p class="price-timer" data-timer="60"> 3 и более слова	1 час</p>' +
            '           </td>' +
            '       </tr>' +
            '       <tr>' +
            '           <td>' +
            '               <strong>4.</strong>' +
            '           </td>' +
            '           <td>' +
            '               Призывы к массовым беспорядкам и участие в них' +
            '           </td>' +
            '           <td>' +
            '               <p class="price-timer" data-timer="180"> 3 часа</p>' +
            '           </td>' +
            '       </tr>' +
            '       <tr>' +
            '           <td>' +
            '               <strong>5.</strong>' +
            '           </td>' +
            '           <td>' +
            '               Мат/завмат/ссылки, содержащие мат/зав.мат (как в основном тексте, так и в комментариях, запощенных до публикации на форуме на первой странице)/цитата мата' +
            '           </td>' +
            '           <td>' +
            '               <p class="price-timer" data-timer="180"> 1-2 слова - 3 часа</p>' +
            '               <p class="price-timer" data-timer="360"> 3 и более слова - 6 часов</p>' +
            '           </td>' +
            '       </tr>' +
            '       <tr>' +
            '           <td>' +
            '               <strong>6.</strong>' +
            '           </td>' +
            '           <td>' +
            '               Оскорбление/мат в сторону членов семьи' +
            '           </td>' +
            '           <td>' +
            '               <p class="price-timer" data-timer="360"> 6 часов</p>' +
            '           </td>' +
            '       </tr>' +
            '       <tr>' +
            '           <td>' +
            '               <strong>7.</strong>' +
            '           </td>' +
            '           <td>' +
            '               Сексуальные домогательства/Обман игроков/Выманивание пароля' +
            '           </td>' +
            '           <td>' +
            '               <p class="price-timer" data-timer="360"> 6 часов</p>' +
            '           </td>' +
            '       </tr>' +
            '       <tr>' +
            '           <td>' +
            '               <strong>8.</strong>' +
            '           </td>' +
            '           <td>' +
            '               И так дале ....' +
            '           </td>' +
            '           <td>' +
            '               <p class="price-timer" data-timer="360"> 6 часов</p>' +
            '           </td>' +
            '       </tr>' +
            '       </tbody>' +
            '   </table>';
        //'</div>';

        //this.master.CreateSideBar("show-price", html, 2);
        this.master.CreatePopUp("show-price", null, html, [100, 250]);
    }
    this.closehint3 = function () {
        document.getElementById('pal_res').remove();
    }
    this.ordenPost = function (param) {
        return new Promise(function (resolve, reject) {
            func.query("orden.php", param)
                .then(function (data) {
                    var find = func.search('<\\/div><font color=red>(.+?)<\\/font><table>', data);
                    resolve(find);
                });
        });
    }
    this.check = function (type) {
        var x = document.getElementById('timer').value;
        if (type == 'timer') {
            if (x == '365') {
                document.getElementById('kr').disabled = false;
                document.getElementById('ekr').disabled = true;
                document.getElementById('vkr').setAttribute('checked', 'checked');
                document.getElementById('vekr').removeAttribute('checked');
                document.getElementById('no').removeAttribute('checked');
            }
            else {
                document.getElementById('kr').disabled = true;
                document.getElementById('vkr').removeAttribute('checked');
            }
        }
    }
    this.new_runmagic = function (title, magic, name, name1, type, abit, login) {
        var This = this,
            submbutton = '',
            resetbutton = '',
            magicformcontent = '',
            magicformreason = '',
            magicformreasonred = '';

        var settings_div = document.getElementById("settings");


        var el = document.getElementById("pal_res");

        if (!el) {
            el = document.createElement('div');
            el.id = "pal_res";
            el.className = "ahint";
            el.style.position = "absolute";
            el.style.top = "100px";
            el.style.left = "50%";
            settings_div.appendChild(el);
        }

        submbutton += '' +
            '<div style="float: right; margin: 2px;">' +
            '   <INPUT class="btn button-mid" TYPE="submit" value="  OK  ">' +
            '</div>';

        resetbutton += '' +
            '<div style="float: left; margin: 2px;">' +
            '   <INPUT class="btn button-mid" id="reset_form" TYPE="button" value="  Очистить  ">' +
            '</div>';


        switch (type) {

            case 'log':
            {
                resetbutton = '';
                magicformcontent = '<div style="padding: 10px;"><font color=red>' + magic + '</font></div>';
                submbutton = '<br><br><input style="float:right;" type="button" onclick="top.frames.PM.plugins[\'Pal\'].closehint3();" value=" Закрыть ">';
                break;
            }

            case '':
            {
                magicformcontent += '' +

                    '<div>' +
                    'Укажите логин персонажа:' +
                    '<small>' +
                    '<BR>' +
                    '(можно щелкнуть по логину в чате)' +
                    '</small>' +
                    '</div>' +
                    '<div>' +
                    '<INPUT TYPE=text id="' + name + '" NAME="' + name + '">' +
                    '<select style="background-color:#eceddf; color:#000000;" name="timer">' +
                    '<option value=0></option>' +
                    '<option value=15>15 мин</option>' +
                    '<option value=30>30 мин</option>' +
                    '<option value=60>1 час</option>' +
                    '<option value=180>3 часа</option>' +
                    '<option value=360>6 часов</option>' +
                    '<option value=720>12 часов</option>' +
                    '<option value=1440>сутки</option>' +
                    '</select>' +
                    '</div>' +
                    '<div>' +
                    'Продлить? <input type=checkbox name="updatetime">' +
                    '</div>';
                magicformreason += '' +
                    '<br><div>Добавить запись в ЛД <small>(текст /// причина:)</small>' +
                    '<br><textarea style="width: 100%; height: 30px;" id="ldtext" NAME="ldtext"></textarea>' +
                    '</div>';
                magicformreasonred += '<div><input type=checkbox name="red">' + ' как причину отправки в хаос/блок</div><br>';

                break;
            }

            case "ldadd" :
            {
                magicformcontent += '' +
                    '<div>' +
                    'Укажите логин персонажа:' +
                    '<small>' +
                    '<BR>' +
                    '(можно щелкнуть по логину в чате)' +
                    '</small>' +
                    '</div>' +
                    '<div>' +
                    '<INPUT TYPE=text id="' + name + '" NAME="' + name + '" value="' + (login ? login : "") + '">' +
                    '</div>';
                magicformreason += '' +
                    '<br><div>Добавить запись в ЛД <small>(текст /// причина:)</small>' +
                    '<br><textarea style="width: 100%; height: 30px;" id="ldtext" NAME="ldtext"></textarea>' +
                    '</div>';
                magicformreasonred += '<div><input type=checkbox name="red">' + ' как причину отправки в хаос/блок</div><br>';

                break;
            }

            case '1':
            {
                magicformcontent += '' +
                    '<div>' +
                    'Укажите логин персонажа:' +
                    '<small>' +
                    '<BR>' +
                    '(можно щелкнуть по логину в чате)' +
                    '</small>' +
                    '</div>' +
                    '<div>' +
                    '<input id="' + name + '" type="text" name="' + name + '">' +
                    '</div>';
                if (magic != 'check') {
                    magicformreason += '' +
                        '<br><div>Добавить запись в ЛД <small>(текст /// причина:)</small>' +
                        '<br><textarea style="width: 100%; height: 30px;" id="ldtext" NAME="ldtext"></textarea>' +
                        '</div>';
                    magicformreasonred += '<div><input type=checkbox name="red">' + ' как причину отправки в хаос/блок</div><br>';
                }

                break;
            }

            case '2':
            {
                magicformcontent += '' +
                    '<div>' +
                    'Укажите логин персонажа:' +
                    '<small><BR>(можно щелкнуть по логину в чате)<br>' +
                    '<input id="' + name + '" type="text" name="' + name + '">' +
                    '<select style="background-color:#eceddf; color:#000000;" name="timer">' +
                    '<option value=0></option>' +
                    '<option value=2>2 дня</option>' +
                    '<option value=3>3 дня</option>' +
                    '<option value=7>неделя</option>' +
                    '<option value=14>2 недели</option>' +
                    '<option value=30>1 месяц</option>' +
                    '<option value=60>2 месяца</option>' +
                    '<option value=365>бессрочно</option>' +
                    '</select>' +
                    '</div>';
                magicformreason += '' +
                    '<br><div>Добавить запись в ЛД <small>(текст /// причина:)</small>' +
                    '<br><textarea style="width: 100%; height: 30px;" id="ldtext" NAME="ldtext"></textarea>' +
                    '</div>';

                magicformreasonred += '<div><input type=checkbox name="red">' + ' как причину отправки в хаос/блок</div><br>';

                break;
            }

            case '4':
            {
                magicformcontent += '' +
                    '<div>' +
                    'Укажите логин жениха: <br>' +
                    '<input id="' + name + '" type="text" name="' + name + '">' +
                    '<br>Укажите логин невесты: <br>' +
                    '<input type="text" name="' + name1 + '">' +
                    '</div>';

                break;
            }

            case '144':
            {
                magicformcontent += '' +
                    '<div>' +
                    'Укажите логин персонажа:' +
                    '<small><br>(можно щелкнуть по логину в чате)' +
                    '<input id="' + name + '" type=text name="' + name + '">' +
                    '<select style="background-color:#eceddf; color:#000000;" name="timer" id="timer" onchange="PM.plugins[\'Pal\'].check(\'timer\')">' +
                    '<option value=0></option>' +
                    '<option value=2>2 дня</option>' +
                    '<option value=3>3 дня</option>' +
                    '<option value=7>неделя</option>' +
                    '<option value=14>2 недели</option>' +
                    '<option value=30>1 месяц</option>' +
                    '<option value=31>1 месяц (руны)</option>' +
                    '<option value=60>2 месяца</option>' +
                    '<option value=365>бессрочно</option>' +
                    '</select>' +
                    '<div style="display: none;">Выкуп' +
                    '<input type="radio" onclick="PM.plugins[\'Pal\'].check(\'kr\')" name="chose" value="kr" id="vkr">' +
                    '<input type="text" name="kr" id="kr" size="6" disabled>кр.' +
                    '<br>' +
                    '</div>' +
                    '</div>';
                magicformreason += '' +
                    '<br><div>Добавить запись в ЛД <small>(текст /// причина:)</small>' +
                    '<br><textarea style="width: 100%; height: 30px;" id="ldtext" NAME="ldtext"></textarea>' +
                    '</div>';
                magicformreasonred += '<div><input type=checkbox name="red">' + ' как причину отправки в хаос/блок</div><br>';

                break;
            }

            default:
            {
                resetbutton = '';
                magicformcontent = '';
                submbutton = '';
            }
        }

        el.innerHTML = '' +
            '<table class="new_runmagic" width=100% cellspacing=1 cellpadding=0 bgcolor=CCC3AA>' +
            '   <tr>' +
            '       <td align=center><h2 class="drag-table" style="cursor: move;">' + title + '</h2></td>' +
            '       <td width=20 align=right valign=top style="cursor: pointer" onclick="top.frames.PM.plugins[\'Pal\'].closehint3();"><B>X</b></td>' +
            '   </tr>' +
            '   <tr>' +
            '       <td colspan=2>' +
            '           <form id="order_action" action="" method=POST>' +
            '               <table width=100% cellspacing=0 cellpadding=2 bgcolor=FFF6DD>' +
            '                   <tr>' +
            '                       <td>' +
            magicformcontent + magicformreason + magicformreasonred + resetbutton + submbutton +
            '                       </td>' +
            '                   </tr>' +
            '               </table>' +
            '           </form>' +
            '       </td>' +
            '   </tr>' +
            '</table>';


        $('form#order_action')
            .on("submit", function (e) {
                e.preventDefault();
                if (type == 'log') {
                    return;
                }

                var target_value = ($("#" + name).val()).trim();
                var timer = $("select[name=timer]").val();

                if (target_value.length === 0) {
                    alert('Введите имя персонажа');
                    $("#" + name).focus();
                    return;
                }
                if (timer == 0) {
                    alert(title + ': Введите срок');
                    $("select[name=timer]").focus();
                    return;
                }

                var red = $("input[name=red]").is(":checked");
                var target_value_encoded = func.strEncode(target_value);
                var ldtext = func.strEncode($("#ldtext").val());
                var param = {};

                if (type == 'ldadd') {
                    param = {
                        ldnick: target_value_encoded,
                        ldtext: ldtext,
                        use: magic,
                        dec: "off"
                    };

                    if (red === true) {
                        param.red = "on";
                    }

                    This.ordenPost(func.param(param, true))
                        .then(function (data) {
                            This.new_runmagic(title, data, '', '', 'log');
                        });
                }
                else {
                    param = {
                        abit: abit,
                        sd4: This.master.user.id,
                        use: magic,
                        target: target_value_encoded,
                        timer: timer
                    };

                    if ($("input[name=updatetime]").is(":checked")) {
                        param.updatetime = "on";
                    }

                    This.ordenPost(func.param(param, true))
                        .then(function (data) {
                            var patt_good = [
                                'Успешно наложено заклятие молчания на персонажа',
                                'Успешно продлено заклятие молчания на персонажа',
                                'Успешно снято заклятие молчания с персонажа',

                                'Успешно наложено заклятие форумного молчания на персонажа',
                                'Успешно продлено заклятие форумного молчания на персонажа',
                                'Успешно снято заклятие форумного молчания с персонажа',

                                'Успешно наложено заклятие обезличивания на персонажа',
                                'Успешно снято заклятие обезличивания с персонажа',

                                'Успешно наложено заклятие смерти на персонажа',
                                'Успешно снято заклятие смерти с персонажа',

                                'Успешно наложено заклятие хаоса на персонажа',
                                'Успешно снято заклятие хаоса с персонажа'
                            ];

                            var found = false;
                            for (var i = 0; i < patt_good.length; i++) {
                                if (data.indexOf(patt_good[i]) != -1) {
                                    found = true;
                                    break;
                                }
                            }

                            if (found) {

                                var param2 = {};

                                if (red === true) {
                                    param2 = {
                                        ldnick: target_value_encoded,
                                        ldtext: ldtext,
                                        use: "ldadd",
                                        dec: "off",
                                        red: "on"
                                    };
                                    This.ordenPost(func.param(param2, true))
                                        .then(function (data2) {
                                            This.new_runmagic(title, data + "<br>" + data2, '', '', 'log');
                                        });
                                }
                                else if (ldtext && (ldtext.trim()).length !== 0) {

                                    param2 = {
                                        ldnick: target_value_encoded,
                                        ldtext: ldtext,
                                        use: "ldadd",
                                        dec: "off"
                                    };

                                    This.ordenPost(func.param(param2, true))
                                        .then(function (data2) {
                                            This.new_runmagic(title, data + "<br>" + data2, '', '', 'log');
                                        });
                                } else {
                                    This.new_runmagic('Добавить запись в ЛД', 'ldadd', 'target', 'target1', 'ldadd', 'undefined', '' + target_value + '');
                                    //$("#pal_res").append("<br><font color=red>" + data + "</font>");
                                }
                            } else {
                                This.new_runmagic(title, data, '', '', 'log');
                            }

                        });
                }

                return false;
            });

        $('form#order_action #reset_form').on("click", function () {
            $('form#order_action').trigger('reset');
        });

        $('#pal_res')
            .draggable({
                handle: ".drag-table",
                scroll: false
            });

        $('textarea#ldtext').on("keypress", function(e) {
            if(e.which == 13 && !e.shiftKey) {
                $(this.form).submit();
                e.preventDefault();
                return false;
            }
        });
    }

}