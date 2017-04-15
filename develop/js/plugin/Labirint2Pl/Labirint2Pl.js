function Labirint2Pl() {
    this.help = "#";
    this.name = "Лабиринт";
    this.id = "Labirint";
    this.master = null;
    this.menuitem = null;
    this.created = false;
    this.enabled = false;
    this.options = {
        enter: false,
        enter_time: '',
        quest: true,
        auto_exit: true,
        autodrop: true,
        labahill: 80,
        buterhill: 0,
        noattackhp: 50,
        autoantidot: 10,
        set: 0,
        bot: true,
        auto_heroic: true,
        magic_heal: false,
        statue: true,
        check: true,
        sale: true,
        deadlocks: true,
        open_door: false,
        open_door_filter: false,
        open_door_filter_txt: '0',
        autoart: false,
        arts: [],
        thirst: false,
        started_time: null,
        cup: false,
        cup_1_2: true//,
        //cup_2_3:false
    };
    this.started = false;
    this.Map = [];
    this.Me = {x: 0, y: 0, hp: 0, max_hp: 0};
    this.Dealer = {x: 0, y: 0, visit: 0};
    this.MapOptions = {
        quest: false,
        end: false,
        statues: 0,
        dealerprogress: { // 0 - не проводился, 1-в данный момент происходит, 2- успех
            cashout: 0,
            createstatue: 0,
            changecup: 0,
            saleart: 0,
        }
    };
    this.Marshrut = [];
    this.DropLog = [];
    this.LastDrop = [];
    this.LastStep = 0;
    this.timer = null;
    this.useItem = false;
    this.expire = 1000 * 60 * 60 * 24 * 30;
    this.contentHTML =
        '<div id="laba" class="pl_wrap">\
            <div class="pl_section">\
                <div class="pl_section_title">Запуск/Автовход</div>\
                    <div>\
                        <input id="laba_start" type="button" value="Старт" />\
                        <input id="laba_map" type="button" value="Карта" /><br /><br>\
                        <input class="pl_checkbox" id="laba_enter" type="checkbox" value="enter" />Автовход в обычный лабиринт.<br>\
                        Время автовхода <input class="pl_textbox w40" id="laba_enter_time" type="text" value="" />*пусто - по откату<br>\
                        <input class="pl_checkbox" id="laba_quest" type="checkbox" value="quest" />Авто сдача и взятие квеста<br>\
                        <input class="pl_checkbox" id="laba_auto_exit" type="checkbox" value="auto_exit" />Автовыход<br />\
                        <input class="pl_checkbox" id="laba_autodrop" type="checkbox" value="autodrop" />Автоподъем ресурсов.\
                        <a id="laba_log" href="javascript:void(0)">Лог</a> (<a id="laba_log_clear" href="javascript:void(0)">очистить</a>)\
                    </div>\
                    <div>\
                        <input id="laba_dot" type="button" value="Антидот" />\
                        <input id="laba_heal" type="button" value="Бутер" /><br>\
                    </div>\
            </div>\
            <div class="pl_section">\
                <div class="pl_section_title">Настройки</div>\
                <table>\
                    <tr>\
                        <td>\
                            <input class="pl_checkbox" id="laba_bot" type="checkbox" value="bot" />Автобот вкл.<br/>\
                            <input class="pl_checkbox" id="laba_auto_heroic" type="checkbox" value="auto_heroic" />Автопереход в Героик<br>\
                            <input class="pl_checkbox" id="laba_magic_heal" type="checkbox" value="magic_heal" />Есть хилки перед бутерами<br>\
                            <input class="pl_checkbox" id="laba_statue" type="checkbox" value="statue" />Обменивать статуи<br />\
                            <input class="pl_checkbox" id="laba_check" type="checkbox" value="check" />Обменивать чеки<br />\
                            <input class="pl_checkbox" id="laba_sale" type="checkbox" value="sale" />Продать вещи перед выходом<br />\
                            <input class="pl_checkbox" id="laba_cup" type="checkbox" value="cup" />Обмен чарок\
                            <input class="pl_checkbox" id="laba_cup_1_2"  type="checkbox" value="cup_1_2" disabled/>1=>2<br>\
                            <!--<input class="pl_checkbox" id="laba_cup_2_3" type="checkbox" value="cup_2_3" />2=>3-->\
                            <input class="pl_checkbox" id="laba_thirst" type="checkbox" value="thirst" />Юзать жажду при переходе в героик<br>\
                        </td>\
                        <td>\
                            <input class="pl_checkbox" id="laba_deadlocks" type="checkbox" value="deadlocks" />Не ходить в тупики<br>\
                            <input class="pl_checkbox" id="laba_open_door" type="checkbox" value="open_door" />Открывать двери<br />\
                            <input class="pl_checkbox" id="laba_open_door_filter" type="checkbox" value="open_door_filter" />Не открывать, если в комнате <br />(имена, через зпт):<br>\
                            <input class="pl_textbox" id="laba_open_door_filter_txt" type="text" value="" size="25" /><br>\
                            *0-никого,1-Опасная зона<br /><br>\
                            Познание лабиринта, id карты:<br>\
                            <input class="pl_textbox" id="laba_cognition_txt" type="text" value="" size="25" />\
                            <input  id="laba_cognition" type="button" value="Нанести" />\
                        </td>\
                    </tr>\
                </table>\
            </div><br>\
            <div class="pl_section">\
                <div class="pl_section_title">Автохил/Антидот/Атака мобов</div>\
                <table>\
                    <tr>\
                        <td>\
                            Автохил(с карты) при HP менее (%)\
                        </td>\
                        <td>\
                            <input class="pl_numbox" id="laba_labahill" type="text" value="0" />*0-не юзать\
                        </td>\
                    </tr>\
                    <tr>\
                        <td>\
                            Автохил(бутеры) при HP менее\
                        </td>\
                        <td>\
                            <input  class="pl_numbox"  id="laba_buterhill" type="text" value="0" />*0-не юзать\
                        </td>\
                    </tr>\
                    <tr>\
                        <td>\
                            Не атаковать мобов при HP менее (%)\
                        </td>\
                        <td>\
                            <input class="pl_numbox" id="laba_noattackhp" type="text" value="70" />*0-атаковать всегда\
                        </td>\
                    </tr>\
                    <tr>\
                        <td>\
                            Автоантидот при задержке более (мин.)\
                        </td>\
                        <td>\
                            <input  class="pl_numbox"  id="laba_autoantidot" type="text" value="0" />*0-отключить\
                        </td>\
                    </tr>\
                    <tr>\
                        <td>\
                            Одеть комплект после выхода (ID комплекта)\
                        </td>\
                        <td>\
                            <input class="pl_numbox" id="laba_set" type="text" value="0" style="width:60px" />\
                        </td>\
                    </tr>\
                </table>\
            </div>\
            <div class="pl_section">\
                <div class="pl_section_title">Арты</div>\
                <table>\
                    <tr>\
                        <td>\
                            Арты:<br/>\
                            <select id="laba_art_base" size="8">\
                                <option value="1">Дубинка Радости</option>\
                                <option value="2">Топор Вихря</option>\
                                <option value="3">Меч Кромуса</option>\
                                <option value="4">Закрытый шлем Развития</option>\
                                <option value="5">Доспех Хаоса</option>\
                                <option value="6">Щит Откровения</option>\
                                <option value="7">Щит Пророчества</option>\
                                <option value="8">Кольцо Жизни</option>\
                                <option value="9">Шлем Ангела</option>\
                                <option value="10">Меч Героев</option>\
                                <option value="11">Броня Ангела</option>\
                                <option value="12">Доспех -Броня Титанов-</option>\
                                <option value="13">Панцирь Злости</option>\
                                <option value="14">Лучшие Ботинки</option>\
                                <option value="15">Великое Кольцо Жизни</option>\
                            </select>\
                        </td>\
                        <td valign="middle">\
                            <input id="laba_art_right" type="button" value=">>>"><br>\
                            <input id="laba_art_left" type="button" value="<<<">\
                        </td>\
                        <td valign="top">\
                            <input class="pl_checkbox" id="laba_autoart" type="checkbox" value="autoart" />Надеть:<br>\
                            <select id="laba_art_dress" size="4"></select>\
                        </td>\
                    </tr>\
                </table>\
            </div>\
        </div>';
    this.AStar = function () {
        /**
         * A* (A-Star) algorithm for a path finder
         * @author  Andrea Giammarchi
         * @license Mit Style License
         */
        function diagonalSuccessors($N, $S, $E, $W, N, S, E, W, grid, rows, cols, result, i) {
            if ($N) {
                $E && !grid[N][E] && (result[i++] = {x: E, y: N});
                $W && !grid[N][W] && (result[i++] = {x: W, y: N});
            }
            if ($S) {
                $E && !grid[S][E] && (result[i++] = {x: E, y: S});
                $W && !grid[S][W] && (result[i++] = {x: W, y: S});
            }
            return result;
        }

        function diagonalSuccessorsFree($N, $S, $E, $W, N, S, E, W, grid, rows, cols, result, i) {
            $N = N > -1;
            $S = S < rows;
            $E = E < cols;
            $W = W > -1;
            if ($E) {
                $N && !grid[N][E] && (result[i++] = {x: E, y: N});
                $S && !grid[S][E] && (result[i++] = {x: E, y: S});
            }
            if ($W) {
                $N && !grid[N][W] && (result[i++] = {x: W, y: N});
                $S && !grid[S][W] && (result[i++] = {x: W, y: S});
            }
            return result;
        }

        function nothingToDo($N, $S, $E, $W, N, S, E, W, grid, rows, cols, result, i) {
            return result;
        }

        function successors(find, x, y, grid, rows, cols) {
            var
                N = y - 1,
                S = y + 1,
                E = x + 1,
                W = x - 1,
                $N = N > -1 && !grid[N][x],
                $S = S < rows && !grid[S][x],
                $E = E < cols && !grid[y][E],
                $W = W > -1 && !grid[y][W],
                result = [],
                i = 0
                ;
            $N && (result[i++] = {x: x, y: N});
            $E && (result[i++] = {x: E, y: y});
            $S && (result[i++] = {x: x, y: S});
            $W && (result[i++] = {x: W, y: y});
            return find($N, $S, $E, $W, N, S, E, W, grid, rows, cols, result, i);
        }

        function diagonal(start, end, f1, f2) {
            return f2(f1(start.x - end.x), f1(start.y - end.y));
        }

        function euclidean(start, end, f1, f2) {
            var
                x = start.x - end.x,
                y = start.y - end.y
                ;
            return f2(x * x + y * y);
        }

        function manhattan(start, end, f1, f2) {
            return f1(start.x - end.x) + f1(start.y - end.y);
        }

        function AStar(grid, start, end, f) {
            var
                cols = grid[0].length,
                rows = grid.length,
                limit = cols * rows,
                f1 = Math.abs,
                f2 = Math.max,
                list = {},
                result = [],
                open = [{x: start[0], y: start[1], f: 0, g: 0, v: start[0] + start[1] * cols}],
                length = 1,
                adj, distance, find, i, j, max, min, current, next
                ;
            end = {x: end[0], y: end[1], v: end[0] + end[1] * cols};
            switch (f) {
                case "Diagonal":
                    find = diagonalSuccessors;
                case "DiagonalFree":
                    distance = diagonal;
                    break;
                case "Euclidean":
                    find = diagonalSuccessors;
                case "EuclideanFree":
                    f2 = Math.sqrt;
                    distance = euclidean;
                    break;
                default:
                    distance = manhattan;
                    find = nothingToDo;
                    break;
            }
            find || (find = diagonalSuccessorsFree);
            do {
                max = limit;
                min = 0;
                for (i = 0; i < length; ++i) {
                    if ((f = open[i].f) < max) {
                        max = f;
                        min = i;
                    }
                }
                ;
                current = open.splice(min, 1)[0];
                if (current.v != end.v) {
                    --length;
                    next = successors(find, current.x, current.y, grid, rows, cols);
                    for (i = 0, j = next.length; i < j; ++i) {
                        (adj = next[i]).p = current;
                        adj.f = adj.g = 0;
                        adj.v = adj.x + adj.y * cols;
                        if (!(adj.v in list)) {
                            adj.f = (adj.g = current.g + distance(adj, current, f1, f2)) + distance(adj, end, f1, f2);
                            open[length++] = adj;
                            list[adj.v] = 1;
                        }
                    }
                } else {
                    i = length = 0;
                    do {
                        result[i++] = [current.x, current.y];
                    } while (current = current.p);
                    result.reverse();
                }
            } while (length);

            return result;
        }

        return AStar;
    }();
    this.Start = function (win) {
        if (new RegExp('\\/lab.?\\.php', 'i').test(win.document.URL) && win.document.URL.indexOf("talk=") == -1) {
            clearTimeout(this.timer);
            this.timer = null;
            this.Init(win);
        }
        else if (win.document.URL.indexOf("/lab.php?talk=") != -1) {
            var dialog = $("td[bgcolor=f2f0f0] a", win.document);

            if (this.options.statue && this.MapOptions.statues < 9 && this.MapOptions.dealerprogress.createstatue == 0) {
                try {
                    this.CreateStatue(dialog, 3, win);
                }
                catch (e) {
                    console.log(e);
                }
            }
            else if (this.options.check && this.MapOptions.dealerprogress.cashout == 0) {
                try {
                    this.CashOut(dialog, 0);
                }
                catch (e) {
                    console.log(e);
                }
            }
            else if (this.options.cup && (this.options.cup_1_2 /* || this.options.cup_2_3*/) && this.MapOptions.dealerprogress.changecup == 0) {
                try {
                    this.CupChange(dialog, 4, win);
                }
                catch (e) {
                    console.log(e);
                }
            }
            else if (dialog[dialog.length - 1].innerHTML.indexOf("Спасибо тебе") != -1) {
                dialog[dialog.length - 1].click();
            }
        }
        else if (win.document.URL.indexOf("/lab2.php?talk=") != -1) {
            var dialog = $("td[bgcolor=f2f0f0] a", win.document);

            if (this.options.statue && this.MapOptions.statues < 9 && this.MapOptions.dealerprogress.createstatue == 0 && this.Dealer.visit == 1) {
                try {
                    this.CreateStatue(dialog, 4, win);
                }
                catch (e) {
                    console.log(e);
                }
            }
            else if (this.options.check && this.MapOptions.dealerprogress.cashout == 0 && this.Dealer.visit == 1) {
                try {
                    this.CashOut(dialog, 1);
                }
                catch (e) {
                    console.log(e);
                }
            }
            else if (this.options.cup && (this.options.cup_1_2 /*|| this.options.cup_2_3*/) && this.MapOptions.dealerprogress.changecup == 0 && this.Dealer.visit == 1) {
                try {
                    this.CupChange(dialog, 5, win);
                }
                catch (e) {
                    console.log(e);
                }
            }
            else if (this.options.sale && this.MapOptions.dealerprogress.saleart == 0 && this.Dealer.visit == 1) {
                try {
                    this.SaleArt(dialog, 0);
                }
                catch (e) {
                    console.log(e);
                }
            }
            else if (this.Dealer.visit == 1 && dialog[dialog.length - 1].innerHTML.indexOf("Спасибо тебе") != -1) {
                this.Dealer.visit = 2;
                if ($.jStorage.storageAvailable()) {
                    $.jStorage.set('Dealer', func.toJSON(this.Dealer), {TTL: this.expire});
                }
                dialog[dialog.length - 1].click();
            }
        }
        else if (win.document.URL.indexOf("/startlab.php") != -1) {
            if (this.options.enter) {
                if (win.document.body.innerHTML.indexOf("До следующего посещения лабиринта") != -1) {

                } else {
                    var res = this.options.enter_time.match(/(\d\d):(\d\d)/);
                    if (res && res.length > 1) {
                        var dt = new Date();
                        var hm = 3600 * parseInt(res[1], 10) + parseInt(res[2], 10);
                        var nhm = 3600 * dt.getHours() + dt.getMinutes();
                        if ((hm <= 43200 && nhm <= 43200 || hm > 43200 && nhm > 43200) && hm <= nhm) {
                            if (win.document.getElementsByName("open").length > 0) {
                                win.document.getElementsByName("open")[0].click();
                            } else if (win.document.getElementsByName("startzay").length > 0) {
                                win.document.getElementsByName("startzay")[0].click();
                            }
                        }
                    } else {
                        if (win.document.getElementsByName("open").length > 0) {
                            win.document.getElementsByName("open")[0].click();
                        } else if (win.document.getElementsByName("startzay").length > 0) {
                            win.document.getElementsByName("startzay")[0].click();
                        }
                    }
                }
            }
            if (!this.MapOptions.quest && this.options.quest) {
                if (win.document.getElementsByName("quest").length > 0) {
                    if (win.document.getElementsByName("quest")[0].value == "Отменить задание") {
                        this.MapOptions.quest = true;
                        win.document.getElementsByName("ref")[0].click();
                    } else win.document.getElementsByName("quest")[0].click();
                } else if (win.document.getElementsByName("ref").length > 0) win.document.getElementsByName("ref")[0].click();
            }
            if (this.MapOptions.end) {
                this.MapOptions.quest = false;
                if (this.options.set != 0) {
                    var rhp = /:? ?(\d+)\/(\d+)</mi;
                    var res = $('body', win.document).html().match(rhp);
                    if (res && res.length > 1) {
                        if (parseInt(res[2], 10) == this.master.user.vinos * 6) {
                            $.get("main.php?edit=1&complect=" + this.options.set + "&" + Math.random(), function (data) {
                                win.location.href = '/startlab.php';
                            });
                        } else this.MapOptions.end = false;
                    } else win.location.href = '/startlab.php';
                } else this.MapOptions.end = false;

                if (this.options.started_time != null) {
                    var endLabTime = new Date().getTime();
                    var resultTime = endLabTime - this.options.started_time;
                    var convertedTime = func.msToTime(resultTime);
                    func.message(convertedTime.hours + " ч. " + convertedTime.minutes + " м. " + convertedTime.seconds + " сек.", "Лабиринт пройден за");
                    func.message("Лабиринт завершен");
                    this.options.started_time = null;
                    this.master.SaveOptions(this.id, this.options);
                    if (this.master.plugins['Nastroika'].options.sound == 1)func.sound("endlab");
                }
            }
        }
    }
    this.CupChange = function (dialog, index, win) {
        if (dialog[0] && dialog[0].innerHTML.indexOf("Выбрать") != -1) {
            dialog[dialog.length - 1].click();
            this.MapOptions.dealerprogress.changecup = 2;
        }
        else if (dialog[0] && dialog[0].innerHTML.indexOf("Cвиток Чарования") != -1 && dialog[0].href.indexOf("talk=") != -1) {
            if (this.options.cup_1_2) {
                dialog[0].click();
            }
        }
        else if ($("input[name^=scrol]", win.document).length > 0) {
            var cb = $("input[name^=scrol]", win.document);

            if (cb && cb.length > 0) {
                if (cb.length <= 2) {
                    this.MapOptions.dealerprogress.changecup = 2;
                    dialog[dialog.length - 1].click();
                }
                else {
                    for (var i = 0; i < 3; i++) cb[i].click();
                    $("form", win.document)[1].submit();
                }
            }

        }
        else if (dialog[index] && dialog[index].innerHTML.indexOf("Соединить чарки") != -1) {
            dialog[index].click();
        }
    }
    this.SaleArt = function (dialog, index) {
        if (dialog[index] && dialog[index].innerHTML.indexOf("на продажу") != -1) {
            $.get('http://capitalcity.oldbk.com/main.php?edit=1&undress=all', function () {
                dialog[index].click();
            });
        }
        else if (dialog[0].innerHTML.indexOf("Продать") == -1) {
            dialog[dialog.length - 1].click();
            this.MapOptions.dealerprogress.saleart = 2;
        }
        else if (dialog[0].innerHTML.indexOf("Продать") != -1) {
            dialog[0].click();
        }
    }
    this.CashOut = function (dialog, index) {
        if (dialog[index] && dialog[index].innerHTML.indexOf("Обналичить чек") != -1) {
            dialog[index].click();
        }
        else if (dialog[0].innerHTML.indexOf("Отдать Чек") != -1) {
            dialog[0].click();
        }
        else if (dialog[0].innerHTML.indexOf("Отдать Чек") == -1) {
            dialog[dialog.length - 1].click();
            this.MapOptions.dealerprogress.cashout = 2;
        }
    }
    this.CreateStatue = function (dialog, index, win) {
        if (this.MapOptions.statues < 9) {
            if (dialog[index] && dialog[index].innerHTML.indexOf("Собрать из осколков статую") != -1) {
                dialog[index].click();
            }
            else if (this.MapOptions.statues == 8) {
                this.MapOptions.statues++;
                dialog[dialog.length - 1].click();
                this.MapOptions.dealerprogress.createstatue = 2;
            }
            else if (dialog[0].innerHTML.indexOf("Выбрать") != -1) {
                this.MapOptions.statues++;
                dialog[0].click();
            }
            else if (dialog[0].innerHTML.indexOf("Статуя Мусорщика") != -1) {
                dialog[this.MapOptions.statues].click();
            }
            else {
                var cb = $("input[type=checkbox]", win.document);
                for (var i = 0; i < 5; i++) cb[i].click();
                $("form", win.document)[1].submit();
            }
        }
    }
    this.Begin = function () {
        if (!this.enabled) {
            alert("Плагин выключен. Перейдите в пункт верхнего меню *Настройки* и включите его");
        }
        if (!this.started && (top.frames["main"].location.href.indexOf("lab.php") != -1 || top.frames["main"].location.href.indexOf("lab2.php") != -1) && top.frames["main"].location.href.indexOf("talk=") == -1) {
            this.started = true;
            $("#laba_start").val('Стоп');
            $("a[href=#]", top.frames['main'].document)[2].click();
        }
    }
    this.Stop = function () {
        if (this.started) {
            this.started = false;
            $("#laba_start").val('Старт');
        }
        if ((top.frames["main"].location.href.indexOf("/lab.php") != -1 || top.frames["main"].location.href.indexOf("/lab2.php") != -1) && top.frames["main"].location.href.indexOf("talk=") == -1) $("a[href=#]", top.frames['main'].document)[2].click();
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
                        enter: false,
                        enter_time: '',
                        quest: true,
                        auto_exit: true,
                        autodrop: true,
                        labahill: 80,
                        buterhill: 0,
                        noattackhp: 50,
                        autoantidot: 10,
                        set: 0,
                        bot: true,
                        auto_heroic: true,
                        magic_heal: false,
                        statue: true,
                        check: true,
                        sale: true,
                        deadlocks: true,
                        open_door: false,
                        open_door_filter: false,
                        open_door_filter_txt: '0',
                        autoart: false,
                        arts: [],
                        thirst: false,
                        started_time: null,
                        cup: false,
                        cup_1_2: true//,
                        //cup_2_3:false
                    };
                }
            }
        }
    }
    this.Enable = function () {
        this.enabled = true;
        var mi = this.MenuItem();
        if (mi != null) mi.css('display', 'inherit');
    }
    this.Disable = function () {
        this.enabled = false;
        var mi = this.MenuItem();
        if (mi != null) mi.css('display', 'none');
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

            this.master.SetEvents(this, "laba");

            if (this.started) $("#laba_start", document).val("Стоп");

            $("#laba_start", document).bind("click", function () {
                if (!This.started) This.Begin();
                else This.Stop();
            });

            $("#laba_cognition", document).bind("click", function () {
                var mapID = parseInt($("#laba_cognition_txt", document).val(), 10);
                if (!mapID) {
                    alert('Только цифры!');
                    return;
                }
                This.CognitionLab(mapID);
            });
            $("#laba_map", document).bind("click", function () {
                This.ShowMap();
            });
            $("#laba_heal", document).bind("click", function () {
                //This.UseHill();
                This.UseButer();
            });
            $("#laba_log", document).bind("click", function () {
                var mess = '';
                for (var i in This.DropLog) {
                    //mess = mess + This.DropLog[i] + '\n';
                    mess = mess + This.DropLog[i] + '<br>';
                }
                if (mess == '') mess = 'лог пуст';
                This.master.CreatePopUp('log', this, mess);
            });
            $("#laba_log_clear", document).bind("click", function () {
                This.DropLog = [];
            });
            $("#laba_dot", document).bind("click", function () {
                This.UseDot();
            });

            //////////////////////
            if (!$.isEmptyObject(This.options.arts)) {
                $(This.options.arts).each(function (i, art) {
                    $("#laba_art_dress").append($("<option value=" + i + ">" + art + "</option>"));
                });
            }

            $("#laba_art_right").bind("click", function () {
                if ($("#laba_art_base").val()) {
                    if ($.inArray($("#laba_art_base option:selected").text(), This.options.arts) != -1)
                        return false;
                    This.options.arts.push($("#laba_art_base option:selected").text());
                    $("#laba_art_dress").append($("<option value=" + $("#laba_art_base").val() + ">" + $("#laba_art_base option:selected").text() + "</option>"));
                }
                This.master.SaveOptions(This.id, This.options);
            });
            $("#laba_art_left").bind("click", function () {
                if ($("#laba_art_dress").val()) {
                    This.options.arts.splice(This.options.arts.indexOf($("#laba_art_dress option:selected").text()), 1);
                    $("#laba_art_dress option:selected").remove();
                }
                This.master.SaveOptions(This.id, This.options);
            });
            //////////////////////////

            this.created = true;
        } else {
            $("#laba", document).toggle();
        }
        this.master.ResizeFrame();
    }
    this.Dispose = function () {
        this.created = false;
    }
    this.KeyPressed = function (win, e) {
        var evt = (win.event) ? win.event : e;
        var key = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode : ((evt.which) ? evt.which : 0));
        if (key == 13) {
            if (this.started) this.Stop();
            else this.Begin();
            if (e.preventDefault) e.preventDefault();
            else return false;
        }
        else if (key == 109 || key == 1100) this.ShowMap();
    }
    this.whoPoint = function (src) {
        var retVal = "";
        switch (src) {
            case 'http://i.oldbk.com/llabb/m.gif':
            case 'http://i.oldbk.com/llabb/m2.gif':
            case 'http://i.oldbk.com/llabb/n.gif':
            case 'http://i.oldbk.com/llabb/a2.gif':
            case 'http://i.oldbk.com/llabb/e2.gif':

                retVal = 'stena';
                break;

            case 'http://i.oldbk.com/llabb/r.gif':
            case 'http://i.oldbk.com/llabb/r2.gif':
            case 'http://i.oldbk.com/llabb/j2.gif':

                retVal = 'monstr';
                break;

            case 'http://i.oldbk.com/llabb/b.gif':
            case 'http://i.oldbk.com/llabb/b2.gif':

                retVal = 'lovushka';
                break;

            case 'http://i.oldbk.com/llabb/o.gif':
            case 'http://i.oldbk.com/llabb/o2.gif':
            case 'http://i.oldbk.com/llabb/g.gif':
            case 'http://i.oldbk.com/llabb/t2.gif':

                retVal = 'doroga';
                break;

            case 'http://i.oldbk.com/llabb/c.gif':
            case 'http://i.oldbk.com/llabb/d.gif':
            case 'http://i.oldbk.com/llabb/x.gif':
            case 'http://i.oldbk.com/llabb/z.gif':

                retVal = 'dver';
                break;

            case 'http://i.oldbk.com/llabb/e2.gif':
            case 'http://i.oldbk.com/llabb/a2.gif':

                retVal = 'dver_otkr';
                break;

            case 'http://i.oldbk.com/llabb/y2.gif':
            case 'http://i.oldbk.com/llabb/l2.gif':
            case 'http://i.oldbk.com/llabb/k2.gif':
            case 'http://i.oldbk.com/llabb/w2.gif':

                retVal = 'larec';
                break;

            case 'http://i.oldbk.com/llabb/s.gif':
            case 'http://i.oldbk.com/llabb/s2.gif':

                retVal = 'sunduk';
                break;

            case 'http://i.oldbk.com/llabb/h.gif':
            case 'http://i.oldbk.com/llabb/h2.gif':

                retVal = 'heal';
                break;

            case 'http://i.oldbk.com/llabb/p.gif':
            case 'http://i.oldbk.com/llabb/p2.gif':

                retVal = 'pandora';
                break;

            case 'http://i.oldbk.com/llabb/of.gif':
            case 'http://i.oldbk.com/llabb/of2.gif':

                retVal = 'exit';
                break;

            case 'http://i.oldbk.com/llabb/u.gif':
            case 'http://i.oldbk.com/llabb/u2.gif':

                retVal = 'me';
                break;

            default :
                retVal = '';
        }

        return retVal;
    }
    this.DrawMap = function () {
        var This = this;
        var html = '<table width="' + (10 * this.Map[0].length) + '" height="' + (10 * this.Map.length) + '" cellspacing="0" cellpadding="0" border="0"><tr><td>';
        for (var x = 0; x < this.Map.length; x++) {
            for (var y = 0; y < this.Map[x].length; y++)
                if (this.Map[x][y].src != '') {
                    var bgcolor = '#ddd';
                    if (this.Map[x][y].path) bgcolor = '#ecc';
                    else if (this.Map[x][y].was == 1) bgcolor = '#dda';
                    else if (this.Map[x][y].was == 2) bgcolor = '#cdc';
                    else if (this.Map[x][y].was > 2) bgcolor = '#cce';
                    var src = this.Map[x][y].src.replace("o2.gif", "o.gif").replace("h2.gif", "h.gif").replace("b2.gif", "b.gif").replace("p2.gif", "p.gif").replace("s2.gif", "s.gif").replace("u2.gif", "u.gif");
                    html += '<img width="10" height="10" style="background-color:' + bgcolor + '" title="' + this.Map[x][y].title + '" id="' + x + '_' + y + '" src="' + src + '">';
                } else html += '<img width="10" height="10" src="' + top.panelDir + 'img/point.gif">';
            if (x + 1 < this.Map.length) html += '<br>';
        }
        html += '</td></tr></table>';

        $("#popup_" + this.id + " .pp_contents").html(html);
        if (this.Marshrut.length > 0 && this.started)
            $('#popup_' + this.id + ' .pp_contents #' + this.Marshrut[this.Marshrut.length - 1][1] + '_' + this.Marshrut[this.Marshrut.length - 1][0]).attr('src', top.panelDir + "img/point_stop.gif");
        else if (this.Marshrut.length > 0)
            $('#popup_' + this.id + ' .pp_contents #' + this.Marshrut[this.Marshrut.length - 1][1] + '_' + this.Marshrut[this.Marshrut.length - 1][0]).attr('src', top.panelDir + "img/point_start.gif");
        $('#popup_' + this.id + ' .pp_contents img').each(function () {
            var xy = this.id.split('_');
            if (xy.length > 1) {
                this.x1 = parseInt(xy[0], 10) + 1;
                this.y1 = parseInt(xy[1], 10) + 1;
                if (This.Map[xy[0]][xy[1]].type != '' && This.Map[xy[0]][xy[1]].type != 'stena')
                    func.Bind('click', this, function (e) {
                        This.SetGoTo(window, e);
                    });
            }
        });


    }
    this.ShowMap = function () {
        var This = this;
        //var side = 2;
        //if (classie.has(document.getElementById('cbp-spmenu-s' + side), 'cbp-spmenu-open')) return;

        this.master.CreatePopUp(this.id, null, '');

        //this.master.CreateSideBar(this.id, '', side);
        this.DrawMap();
    }
    this.CheckDirection = function (x, y) {
        if (this.Map[x][y - 1].was == 1 && this.Map[x][y - 1].type != 'stena' && this.Map[x][y - 1].type != 'dver') return 1;
        if (this.Map[x - 1][y].was == 1 && this.Map[x - 1][y].type != 'stena' && this.Map[x - 1][y].type != 'dver') return 0;
        if (this.Map[x + 1][y].was == 1 && this.Map[x + 1][y].type != 'stena' && this.Map[x + 1][y].type != 'dver') return 4;
        if (y + 1 < this.Map[x].length && this.Map[x][y + 1].was == 1 && this.Map[x][y + 1].type != 'stena' && this.Map[x][y + 1].type != 'dver' && this.Map[x][y + 1].type != 'exit') return 3;
        if (this.Map[x][y - 1].was < 2 && this.Map[x][y - 1].type != 'stena' && this.Map[x][y - 1].type != 'dver') return 1;
        if (this.Map[x - 1][y].was < 2 && this.Map[x - 1][y].type != 'stena' && this.Map[x - 1][y].type != 'dver') return 0;
        if (this.Map[x + 1][y].was < 2 && this.Map[x + 1][y].type != 'stena' && this.Map[x + 1][y].type != 'dver') return 4;
        if (y + 1 < this.Map[x].length && this.Map[x][y + 1].was < 2 && this.Map[x][y + 1].type != 'stena' && this.Map[x][y + 1].type != 'dver' && this.Map[x][y + 1].type != 'exit') return 3;
        return -1;
    }
    this.FindPath = function (win) {
        var karta = new Array(this.Map.length);
        for (var x = 0; x < this.Map.length; x++) {
            karta[x] = new Array(this.Map[x].length);
            for (y = 0; y < this.Map[x].length; y++) {
                if (this.Map[x][y].type == '' || this.Map[x][y].type == 'stena') karta[x][y] = 1;
                else if (!this.options.open_door && this.Map[x][y].type == 'dver') karta[x][y] = 1;
                else karta[x][y] = 0;
            }
        }
        var minPath = [];
        var exit = [];
        for (var y = 1; y < this.Map[0].length - 1; y++) {
            for (var x = 1; x < this.Map.length - 1; x++) {
                if (this.Map[x][y].was < 2 && this.Map[x][y].type != 'stena' && this.Map[x][y].type != 'dver') {
                    var result = [];
                    if (this.Map[x][y - 1].was > 1 || this.Map[x - 1][y].was > 1 || this.Map[x][y + 1].was > 1 || this.Map[x + 1][y].was > 1) result = this.AStar(karta, [this.Me.y - 1, this.Me.x - 1], [y, x], "Manhattan");
                    if (result.length > 0 && (minPath.length == 0 || result.length < minPath.length || result.length == minPath.length && this.Map[result[result.length - 1][1]][result[result.length - 1][0]].was > this.Map[minPath[minPath.length - 1][1]][minPath[minPath.length - 1][0]].was)) minPath = result;
                }
            }
        }

        for (var x = 1; x < this.Map.length - 1; x++) {
            if (this.Map[x][this.Map[0].length - 1].type == 'exit') exit = [this.Map[0].length - 1, x];
        }
        if (minPath.length > 0) {
            return minPath;
        } else if (win.document.URL.indexOf('/lab2.php') != -1 && this.Dealer.x > 0 && this.Dealer.visit == 0 && (this.options.sale || this.options.check || this.options.statue || this.options.cup)) {
            this.Dealer.visit = 1;
            if ($.jStorage.storageAvailable()) $.jStorage.set('Dealer', func.toJSON(this.Dealer), {TTL: this.expire});
            return this.AStar(karta, [this.Me.y - 1, this.Me.x - 1], [this.Dealer.y - 1, this.Dealer.x - 1], "Manhattan");
        } else {
            return this.AStar(karta, [this.Me.y - 1, this.Me.x - 1], exit, "Manhattan");
        }
    }
    this.UseButer = function (stop) {
        var This = this;

        This.master.Parseitm(2, [
                'Бутерброд -Завтрак рыцаря-',
                'Сытный завтрак',
                'Гренка',
                'Легкий завтрак',
                'Коробка конфет «Ассорти»',
                'Конфетка',
                'Праздничный Торт',
                'Новогоднее печенье'
            ])
            .then(function (list) {
                if (list.counts["Бутерброд"] > 0)
                    This.master.UseItem(list["Бутерброд"]);
                else {
                    if (stop) {
                        This.options.bot = false;
                        This.Dispose();
                        This.ToggleContent();
                        func.message("Нечем восполнять здоровье. Автобот остановлен.", 'Автолог');
                    }
                }
            })
            .catch(function (mess) {
                func.message(mess.message, "Автоюз");
            });

    }
    this.UseDot = function () {
        var This = this;

        This.master.Parseitm(2, ['Антидот'])
            .then(function (list) {
                if (list.counts["Антидот"] > 0)
                    This.master.UseItem(list["Антидот"]);
            })
            .catch(function (mess) {
                func.message(mess.message, "Автоюз");
            });
    }
    this.UseHill = function () {
        var This = this;

        This.master.Parseitm(1, ['Восстановление энергии 60HP'])
            .then(function (list) {
                if (list.counts["Восстановление энергии 60HP"] > 0)
                    This.master.UseItem(list["Восстановление энергии 60HP"]);
                else {
                    func.message("Хилок нет, юзаем бутер", "Автоюз");
                    This.UseButer(true);
                }
            })
            .catch(function (mess) {
                func.message(mess.message, "Автоюз");
            });

    }
    this.Go = function (win) {
        var This = this;
        var direction = -1;
        if (this.Marshrut.length > 0 && this.started) {
            if (this.Me.x > this.Marshrut[0][1] + 1) direction = 0;
            else if (this.Me.y < this.Marshrut[0][0] + 1) direction = 3;
            else if (this.Me.x < this.Marshrut[0][1] + 1) direction = 4;
            else direction = 1;
        }
        else if (this.options.bot) {
            if (this.Me.y == 1) direction = 3;
            else {
                direction = this.CheckDirection(this.Me.x - 1, this.Me.y - 1);
                if (direction == -1) {
                    this.Marshrut = this.FindPath(win);
                    if (this.Marshrut.length > 0) {
                        this.Marshrut.shift();
                        this.Go(win);
                        return;
                    }
                }
            }
        }
        var dLink = '';
        var delay = 0;
        if (direction != -1) {
            if (this.options.autoantidot > 0) {
                var pattern = /Время перехода \+3 секунды.*?(?:Осталось:|Длительность:\+)([\d\.]+)мин/mi;
                var res = $('body', win.document).html().match(pattern);
                if (res && res.length > 0) {
                    rtime = parseInt(res[1], 10);
                    if (rtime >= this.options.autoantidot && this.options.autoantidot > 0) {
                        this.UseDot();
                    }
                }
            }

            if (
                direction == 0 &&
                this.Map[this.Me.x - 2][this.Me.y - 1].type == 'monstr' ||
                direction == 1 &&
                this.Map[this.Me.x - 1][this.Me.y - 2].type == 'monstr' ||
                direction == 3 &&
                this.Map[this.Me.x - 1][this.Me.y].type == 'monstr' ||
                direction == 4 &&
                this.Map[this.Me.x][this.Me.y - 1].type == 'monstr'
            ) {
                if (this.Me.hp < this.options.buterhill) {
                    direction = 2;
                    delay = 5000;
                    if (this.Me.hp < this.Me.max_hp && 6 * this.master.user.vinos < this.Me.max_hp) {
                        if (this.options.magic_heal) {
                            this.UseHill();
                        }
                        else {
                            this.UseButer(true);
                        }
                    }
                } else if (100 * this.Me.hp / this.Me.max_hp <= this.options.noattackhp && win.document.URL.indexOf('/lab.php') != -1) {
                    direction = 2;
                    delay = 60000;
                }
            }
            pattern = /href="(.*?)";/mi;
            res = $('a[href=#]', win.document)[direction].onclick.toString().match(pattern);
            if (res && res.length > 0) dLink = res[1];
        }
        if (dLink != '') {
            var timeout = 4000 + this.LastStep - (new Date()).getTime();
            if (win.document.body.innerHTML.indexOf('Время перехода +3 секунды') != -1) timeout += 3000;
            else if (win.document.URL.indexOf("lab2.php") != -1) timeout -= 2000;
            if (win.document.body.innerHTML.indexOf('Не так быстро') != -1) timeout = (40 - win.progressAt) * 100;
            this.timer = setTimeout(function () {
                if (top.frames['main'].document.URL.indexOf('/lab') != -1) {
                    if (delay == 0) This.LastStep = (new Date()).getTime();
                    win.document.location.href = dLink;
                }
            }, (delay > 0 ? delay : (timeout < 1 ? 1 : timeout)));
        } else if (this.started) this.Stop();
    }
    this.SetGoTo = function (win, e) {
        var img = null;
        if (win.event) img = win.event.srcElement;
        else if (e) img = e.target;
        if (this.Marshrut.length > 0) {
            if (this.Marshrut[this.Marshrut.length - 1][1] + 1 == img.x1 && this.Marshrut[this.Marshrut.length - 1][0] + 1 == img.y1) {
                if (this.started) this.Stop();
                else this.Begin();
                return;
            }
        }
        var karta = new Array(this.Map.length);
        for (var x = 0; x < this.Map.length; x++) {
            karta[x] = new Array(this.Map[x].length);
            for (y = 0; y < this.Map[x].length; y++) {
                if (this.Map[x][y].type == '' || this.Map[x][y].type == 'stena') karta[x][y] = 1;
                else karta[x][y] = 0;
            }
        }
        this.Marshrut = this.AStar(karta, [this.Me.y - 1, this.Me.x - 1], [img.y1 - 1, img.x1 - 1], "Manhattan");
        if (this.Marshrut.length > 0) $("a[href=#]", top.frames['main'].document)[2].click();
    }
    this.CheckDeadlock = function (x, y) {
        var X_max = this.Map.length - 2;
        if (this.options.deadlocks && this.Map[x][y].was == 0 && (this.Map[x][y].type == 'doroga' || this.Map[x][y].type == 'lovushka' || this.Map[x][y].type == 'heal')) {
            if ((y == 1 && this.Map[x][y - 1].type != 'me' || this.Map[x][y - 1].was > 2 || this.Map[x][y - 1].type == 'stena') && (x == 1 || this.Map[x - 1][y].was > 2 || this.Map[x - 1][y].type == 'stena') && (this.Map[x][y + 1].was > 2 || this.Map[x][y + 1].type == 'stena')) return 3;
            if ((x == 1 || this.Map[x - 1][y].was > 2 || this.Map[x - 1][y].type == 'stena') && (this.Map[x][y + 1].was > 2 || this.Map[x][y + 1].type == 'stena') && (x == X_max || this.Map[x + 1][y].was > 2 || this.Map[x + 1][y].type == 'stena')) return 3;
            if ((this.Map[x][y + 1].was > 2 || this.Map[x][y + 1].type == 'stena') && (x == X_max || this.Map[x + 1][y].was > 2 || this.Map[x + 1][y].type == 'stena') && (y == 1 && this.Map[x][y - 1].type != 'me' || this.Map[x][y - 1].was > 2 || this.Map[x][y - 1].type == 'stena')) return 3;
            if ((x == X_max || this.Map[x + 1][y].was > 2 || this.Map[x + 1][y].type == 'stena') && (y == 1 && this.Map[x][y - 1].type != 'me' || this.Map[x][y - 1].was > 2 || this.Map[x][y - 1].type == 'stena') && (x == 1 || this.Map[x - 1][y].was > 2 || this.Map[x - 1][y].type == 'stena')) return 3;
            if (this.Map[x][y - 1].was == 2 && this.Map[x][y + 1].was == 2 && (this.Map[x - 1][y].was > 1 || this.Map[x - 1][y].type == 'stena') && (this.Map[x + 1][y].was > 1 || this.Map[x + 1][y].type == 'stena')) return 3;
            if (this.Map[x - 1][y].was == 2 && this.Map[x + 1][y].was == 2 && (this.Map[x][y - 1].was > 1 || this.Map[x][y - 1].type == 'stena') && (this.Map[x][y + 1].was > 1 || this.Map[x][y + 1].type == 'stena')) return 3;
            if (this.Map[x][y - 1].was == 1 && this.Map[x][y + 1].was == 2 && (this.Map[x - 1][y].was > 1 || this.Map[x - 1][y].type == 'stena') && (this.Map[x + 1][y].was > 1 || this.Map[x + 1][y].type == 'stena')) return 1;
            if (this.Map[x - 1][y].was == 1 && this.Map[x + 1][y].was == 2 && (this.Map[x][y - 1].was > 1 || this.Map[x][y - 1].type == 'stena') && (this.Map[x][y + 1].was > 1 || this.Map[x][y + 1].type == 'stena')) return 1;
            if (this.Map[x][y - 1].was == 2 && this.Map[x][y + 1].was == 1 && (this.Map[x - 1][y].was > 1 || this.Map[x - 1][y].type == 'stena') && (this.Map[x + 1][y].was > 1 || this.Map[x + 1][y].type == 'stena')) return 1;
            if (this.Map[x - 1][y].was == 2 && this.Map[x + 1][y].was == 1 && (this.Map[x][y - 1].was > 1 || this.Map[x][y - 1].type == 'stena') && (this.Map[x][y + 1].was > 1 || this.Map[x][y + 1].type == 'stena')) return 1;
            if (this.Map[x][y - 1].type != 'me' && this.Map[x - 1][y].type != 'me' && this.Map[x][y + 1].type != 'me' && this.Map[x + 1][y].type != 'me') {
                if ((y == 1 || this.Map[x][y - 1].was > 1 || this.Map[x][y - 1].type == 'stena') && (x == 1 || this.Map[x - 1][y].was > 1 || this.Map[x - 1][y].type == 'stena') && (this.Map[x][y + 1].was > 1 || this.Map[x][y + 1].type == 'stena')) return 4;
                if ((x == 1 || this.Map[x - 1][y].was > 1 || this.Map[x - 1][y].type == 'stena') && (this.Map[x][y + 1].was > 1 || this.Map[x][y + 1].type == 'stena') && (x == X_max || this.Map[x + 1][y].was > 1 || this.Map[x + 1][y].type == 'stena')) return 4;
                if ((this.Map[x][y + 1].was > 1 || this.Map[x][y + 1].type == 'stena') && (x == X_max || this.Map[x + 1][y].was > 1 || this.Map[x + 1][y].type == 'stena') && (y == 1 || this.Map[x][y - 1].was > 1 || this.Map[x][y - 1].type == 'stena')) return 4;
                if ((x == X_max || this.Map[x + 1][y].was > 1 || this.Map[x + 1][y].type == 'stena') && (y == 1 || this.Map[x][y - 1].was > 1 || this.Map[x][y - 1].type == 'stena') && (x == 1 || this.Map[x - 1][y].was > 1 || this.Map[x - 1][y].type == 'stena')) return 4;
            }
        }
        if (this.Map[x][y].was == 0 && this.Map[x][y].type != 'stena') {
            if ((y == 1 && this.Map[x][y - 1].type != 'me' || this.Map[x][y - 1].was == 1 || this.Map[x][y - 1].was > 2 || this.Map[x][y - 1].type == 'stena') && (x == 1 || this.Map[x - 1][y].was == 1 || this.Map[x - 1][y].was > 2 || this.Map[x - 1][y].type == 'stena') && (this.Map[x][y + 1].was == 1 || this.Map[x][y + 1].was > 2 || this.Map[x][y + 1].type == 'stena')) return 1;
            if ((x == 1 || this.Map[x - 1][y].was == 1 || this.Map[x - 1][y].was > 2 || this.Map[x - 1][y].type == 'stena') && (this.Map[x][y + 1].was == 1 || this.Map[x][y + 1].was > 2 || this.Map[x][y + 1].type == 'stena') && (x == X_max || this.Map[x + 1][y].was == 1 || this.Map[x + 1][y].was > 2 || this.Map[x + 1][y].type == 'stena')) return 1;
            if ((this.Map[x][y + 1].was == 1 || this.Map[x][y + 1].was > 2 || this.Map[x][y + 1].type == 'stena') && (x == X_max || this.Map[x + 1][y].was == 1 || this.Map[x + 1][y].was > 2 || this.Map[x + 1][y].type == 'stena') && (y == 1 && this.Map[x][y - 1].type != 'me' || this.Map[x][y - 1].was == 1 || this.Map[x][y - 1].was > 2 || this.Map[x][y - 1].type == 'stena')) return 1;
            if ((x == X_max || this.Map[x + 1][y].was == 1 || this.Map[x + 1][y].was > 2 || this.Map[x + 1][y].type == 'stena') && (y == 1 && this.Map[x][y - 1].type != 'me' || this.Map[x][y - 1].was == 1 || this.Map[x][y - 1].was > 2 || this.Map[x][y - 1].type == 'stena') && (x == 1 || this.Map[x - 1][y].was == 1 || this.Map[x - 1][y].was > 2 || this.Map[x - 1][y].type == 'stena')) return 1;
        }
        return 0;
    }
    this.MarkDeadlocks = function () {
        var karta1 = new Array(this.Map.length);
        var karta2 = new Array(this.Map.length);
        for (var x = 0; x < this.Map.length; x++) {
            karta1[x] = new Array(this.Map[x].length);
            karta2[x] = new Array(this.Map[x].length);
            for (y = 0; y < this.Map[x].length; y++) {
                if (this.Map[x][y].type == '' || this.Map[x][y].type == 'stena') karta1[x][y] = 1;
                else karta1[x][y] = 0;
                if (this.Map[x][y].type == '' || this.Map[x][y].type == 'stena' || this.Map[x][y].was > 1 && this.Map[x][y].type != 'me') karta2[x][y] = 1;
                else karta2[x][y] = 0;
            }
        }
        for (var x = 1; x < this.Map.length - 1; x++) {
            for (var y = 1; y < this.Map[x].length - 1; y++) {
                var dl = this.CheckDeadlock(x, y);
                if (dl > 0) {
                    var result = this.AStar(karta1, [this.Me.y - 1, this.Me.x - 1], [y, x], "Manhattan");
                    if (result.length !== 0) {
                        if (dl == 1 && result.length > 4 && this.Map[result[result.length - 4][1]][result[result.length - 4][0]].type == 'dver') {
                            if (!this.options.open_door) dl = 3;
                            else if (this.options.open_door_filter) {
                                var Monstr = this.Map[result[result.length - 3][1]][result[result.length - 3][0]].title.replace(/\s*X\d+Y\d+/, '');
                                if (this.Map[result[result.length - 3][1]][result[result.length - 3][0]].src.indexOf('r2.gif') != -1) Monstr = 1;
                                else if (this.Map[result[result.length - 3][1]][result[result.length - 3][0]].src.indexOf('j2.gif') == -1) Monstr = 0;
                                var res = this.options.open_door_filter_txt.match(RegExp('(?:^|,)(?:' + Monstr + ')(?:,|$)', "i"));
                                if (res && res.length > 0) dl = 3;
                            }
                            for (var i = result.length - 1; i > result.length - 5; i--) this.Map[result[i][1]][result[i][0]].was = dl;
                        } else if (dl != 4 || this.Map[result[result.length - 2][1]][result[result.length - 2][0]].was != 2) {
                            for (var i = result.length - 1; i > 0; i--) {
                                var was = this.CheckDeadlock(result[i][1], result[i][0]);
                                if (was > 0) this.Map[result[i][1]][result[i][0]].was = was;
                                else break;
                            }
                        }
                    }
                    result = this.AStar(karta2, [this.Me.y - 1, this.Me.x - 1], [y, x], "Manhattan");
                    if (result.length !== 0) {
                        if (dl == 4 && this.Map[result[result.length - 2][1]][result[result.length - 2][0]].was == 2) continue;
                        if (dl == 1 && result.length > 4 && this.Map[result[result.length - 4][1]][result[result.length - 4][0]].type == 'dver') {
                            if (!this.options.open_door) dl = 3;
                            else if (this.options.open_door_filter) {
                                var Monstr = this.Map[result[result.length - 3][1]][result[result.length - 3][0]].title.replace(/\s*X\d+Y\d+/, '');
                                if (this.Map[result[result.length - 3][1]][result[result.length - 3][0]].src.indexOf('r2.gif') != -1) Monstr = 1;
                                else if (this.Map[result[result.length - 3][1]][result[result.length - 3][0]].src.indexOf('j2.gif') == -1) Monstr = 0;
                                var res = this.options.open_door_filter_txt.match(RegExp('(?:^|,)(?:' + Monstr + ')(?:,|$)', "i"));
                                if (res && res.length > 0) dl = 3;
                            }
                            for (var i = result.length - 1; i > result.length - 5; i--) this.Map[result[i][1]][result[i][0]].was = dl;
                        } else {
                            for (var i = result.length - 1; i > 0; i--) {
                                var was = this.CheckDeadlock(result[i][1], result[i][0]);
                                if (was > 0) this.Map[result[i][1]][result[i][0]].was = was;
                                else break;
                            }
                        }
                    }
                }
            }
        }
    }
    this.Init = function (win) {
        var This = this;

        if (!$.jStorage.storageAvailable()) {
            return;
        }

        var pattern = /Карта:([\d]+)/mi;
        var res = $('body', win.document).html().match(pattern);
        if (res && res.length > 0) {
            var MapID = parseInt(res[1], 10);
        } else {
            $("a[href=#]", win.document)[2].click();
            return;
        }
        var X_max = 25;
        var Y_max = 25;
        if (win.document.URL.indexOf("lab2.php") != -1) {
            X_max = 49;
            Y_max = 49;
        }
        if (this.options.bot && !this.started && this.Me.y != Y_max) {
            this.Begin();
            return;
        }

        if (this.options.started_time == null) {
            this.options.started_time = new Date().getTime();
            this.master.SaveOptions(this.id, this.options);
            func.message("Лабиринт запущен");
        }

        if (MapID == $.jStorage.get("MapID")) {
            this.Map = func.evalJSON($.jStorage.get("Map"));
            this.Dealer = func.evalJSON($.jStorage.get("Dealer"));
        }
        if (MapID != $.jStorage.get("MapID") || this.Map.length != X_max) {
            //if (this.master.FrameOpened && this.master.contentId == this.id && this.Map.length != X_max) top.document.getElementById('plfs').cols = '*,' + (10 * X_max + 18);
            this.Map = [];
            for (var x = 0; x < X_max; x++) {
                this.Map[x] = [];
                for (var y = 0; y < Y_max; y++) this.Map[x][y] = {src: '', title: '', type: 0, was: 0, path: false};
            }
            this.Dealer = {x: 0, y: 0, visit: 0};
            this.MapOptions.statues = 0;
            this.MapOptions.dealerprogress.cashout = 0;
            this.MapOptions.dealerprogress.changecup = 0;
            this.MapOptions.dealerprogress.createstatue = 0;
            this.MapOptions.dealerprogress.saleart = 0;
            $.jStorage.set('MapID', func.toJSON(MapID), {TTL: this.expire});
            $.jStorage.set('Map', func.toJSON(this.Map), {TTL: this.expire});
            $.jStorage.set('Dealer', func.toJSON(this.Dealer), {TTL: this.expire});
        }

        pattern = /координаты : X=(\d+).*?Y=(\d+)/mi;
        res = win.document.body.innerHTML.match(pattern);
        var x = y = 0;
        var lx = ly = 0;
        if (res && res.length > 0) {
            x = parseInt(res[1], 10);
            y = parseInt(res[2], 10);
            lx = (x < 6 ? 1 : (x > X_max - 5 ? X_max - 10 : x - 5));
            ly = (y < 6 ? 1 : (y > Y_max - 5 ? Y_max - 10 : y - 5));
            this.Me.x = x;
            this.Me.y = y;
        } else {
            $("a[href=#]", win.document)[2].click();
            return;
        }

        pattern = /(\d+)\/(\d+)/mi;
        var res = win.document.getElementsByName('HP1')[0].nextElementSibling.innerHTML.match(pattern);
        if (res && res.length > 0) {
            this.Me.hp = parseInt(res[1], 10);
            this.Me.max_hp = parseInt(res[2], 10);
        } else {
            $("a[href=#]", win.document)[2].click();
            return;
        }
        this.Map[x - 1][y - 1].was = 2;
        this.Map[x - 1][y - 1].path = false;
        var i = 0;
        $('table table table td>img', win.document.body).each(function () {
            var mx = lx + Math.floor(i / 11);
            var my = ly + i % 11;

            This.Map[mx - 1][my - 1].src = this.src;
            This.Map[mx - 1][my - 1].type = This.whoPoint(this.src);
            this.x1 = mx;
            this.y1 = my;
            this.type1 = This.Map[mx - 1][my - 1].type;
            this.title = this.title + (this.title != '' ? ' ' : '') + 'X' + mx + 'Y' + my;
            this.id = (mx - 1) + '_' + (my - 1);
            This.Map[mx - 1][my - 1].title = this.title;
            if (this.type1 != 'stena') func.Bind("click", this, function (e) {
                This.SetGoTo(win, e);
            });
            if (This.Marshrut.length > 0 && This.Marshrut[This.Marshrut.length - 1][1] + 1 == mx && This.Marshrut[This.Marshrut.length - 1][0] + 1 == my) this.src = top.panelDir + "img/point_" + (This.started ? "stop" : "start") + ".gif";
            i++;
        });
        if (this.Dealer.x == 0 && win.document.URL.indexOf('/lab2.php') != -1 && win.document.body.innerHTML.indexOf('Старьевщик') != -1) {
            this.Dealer.x = x;
            this.Dealer.y = y;
        } else if (this.Dealer.x != 0) {
            this.Map[this.Dealer.x - 1][this.Dealer.y - 1].src = 'http://i.oldbk.com/llabb/2.gif';
            this.Map[this.Dealer.x - 1][this.Dealer.y - 1].title = 'Старьевщик X' + this.Dealer.x + 'Y' + this.Dealer.y;
        }
        this.MarkDeadlocks();
        func.Bind('keypress', win.document, function (e) {
            This.KeyPressed(win, e);
        });
        $.jStorage.set('Map', func.toJSON(this.Map), {TTL: this.expire});
        $.jStorage.set('Dealer', func.toJSON(this.Dealer), {TTL: this.expire});
        $(this.Marshrut).each(function () {
            This.Map[this[1]][this[0]].path = true;
        });
        if (this.Marshrut.length > 0 && this.Marshrut[0][1] + 1 == this.Me.x && this.Marshrut[0][0] + 1 == this.Me.y) this.Marshrut.shift();
        if (/*classie.has(document.getElementById('cbp-spmenu-s' + 2), 'cbp-spmenu-open') &&*/ $("#popup_" + This.id)) this.DrawMap();
        if (
            this.Dealer.visit == 1 && win.document.URL.indexOf("lab2.php") != -1 ||
            ((this.options.check && this.MapOptions.dealerprogress.cashout == 0 ||
            this.options.statue && this.MapOptions.dealerprogress.createstatue == 0 && this.MapOptions.statues < 9 ||
            this.options.cup && this.MapOptions.dealerprogress.changecup == 0) &&
                //this.MapOptions.statues < 9 &&
            win.document.URL.indexOf("lab.php") != -1)
        ) {
            var dealer = $('input[name=talk]', win.document.body);
            if (dealer.length == 1) {
                dealer[0].click();
                return;
            }
        }
        if (this.options.auto_heroic && win.document.URL.indexOf("lab.php") != -1) {
            var heroic = $('input[name=gotolab2]', win.document.body);
            if (heroic.length == 1) {
                //TODO юз наживы при переходе
                //heroic[0].onclick = '';
                heroic[0].onclick = function () {
                    if (This.options.thirst) {
                        func.query('myabil.php', 'abit=abil&sd4=' + This.master.user.id + '&use=813&target=1')
                            .then(function (html) {
                                var message = $('font[color=red]:eq(0)', html).text();
                                func.message(message, 'Автоюз');
                            });
                    }
                };
                heroic[0].click();
                return;
            }
        }
        if (this.options.auto_exit) {
            var exit = $('input[name=exit_good]', win.document.body);
            if (exit.length == 1) {
                this.MapOptions.end = true;
                exit[0].click();
                $.jStorage.deleteKey('MapID');
                $.jStorage.deleteKey('Map');
                $.jStorage.deleteKey('Dealer');
                return;
            }
        }
        if (y == Y_max && this.started) this.Stop();
        else if (y == Y_max) return;

        if (this.options.labahill > 0) {
            var water = $('a[href="?hill=1"]', win.document);
            if (water.length == 1) {
                //if (this.Me.hp < this.options.labahill && this.Me.hp != this.Me.max_hp) {
                if (100 * this.Me.hp / this.Me.max_hp < this.options.labahill && this.Me.hp != this.Me.max_hp) {
                    water[0].click();
                    return;
                }
            }
        }

        if (this.options.autoart && this.options.arts.length != 0) {
            var artsTostring = this.options.arts.join('|');
            var html = win.document.body.innerHTML;
            var res = func.search('и забрал.? \\"(' + artsTostring + ')\\"', html);
            if (res && res.length > 0) {
                This.master.Parseitm(0, [res])
                    .then(function (list) {
                        if (list.counts[res] > 0)
                            This.master.DressItem(list[res]);
                    })
                    .catch(function (mess) {
                        func.message(mess.message, "Автоарт");
                    });
                return;
            }
        }

        var box = $('a[href="?openbox=1"], a[href="?sunduk=get"], a[href="?keybox=get"]', win.document.body);
        if (box.length > 0) {
            box[0].click();
            return;
        }

        if (win.document.body.innerHTML.indexOf("Недостаточно места в рюкзаке.") != -1) {
            this.options.bot = false;
            this.Dispose();
            this.ToggleContent();
            this.LastDrop.pop();
            func.message('Недостаточно места в рюкзаке. Автобот остановлен.', 'Внимание');
            return;
        }

        if (this.options.autodrop && win.document.body.innerHTML.indexOf("?getitem=") != -1) {
            var links = $('table table td a', win.document.body);
            for (var i = 0; i < links.length; i++) {
                if (links[i].href.indexOf('getitem') != -1 && links[i].href.indexOf('#') == -1) {
                    this.LastDrop.push($(links[i]).find("img")[0].alt);
                    win.location.href = links[i].href;
                    return;
                }
            }
        }

        if (this.LastDrop.length > 0) {
            var message = ' В локации X=' + this.Me.x + " Y=" + this.Me.y + " подобрано " + this.LastDrop.join(', ');
            this.DropLog.push(message);
            this.LastDrop = [];
            func.message(message, 'Автодроп');
        }

        if (this.options.open_door && win.document.body.innerHTML.indexOf('Использовать Ключ') != -1) {
            if (!this.options.open_door_filter) {
                $('a[href="?useitem=1"], a[href="?useitem=2"], a[href="?useitem=3"], a[href="?useitem=4"], a[href="?useitem=666"]', win.document.body)[0].click();
                return;
            }
            var d = [[1, 2, 1, 3, 0, 2, 0, 0], [2, 1, 3, 1, 2, 0, 0, 0], [1, 0, 1, -1, 0, 0, 0, 2], [0, 1, -1, 1, 0, 0, 2, 0]];
            for (var i in d) {
                if (x > d[i][4] && x < X_max - d[i][6] && y > d[i][5] && y < Y_max - d[i][7] && this.Map[x - d[i][0]][y - d[i][1]].type == 'dver') {
                    var key = 0;
                    if (this.Map[x - d[i][0]][y - d[i][1]].src.indexOf('d.gif') != -1) key = 1;
                    else if (this.Map[x - d[i][0]][y - d[i][1]].src.indexOf('z.gif') != -1) key = 2;
                    else if (this.Map[x - d[i][0]][y - d[i][1]].src.indexOf('x.gif') != -1) key = 3;
                    else if (this.Map[x - d[i][0]][y - d[i][1]].src.indexOf('c.gif') != -1) key = 4;
                    var Monstr = 0;
                    if (this.Map[x - d[i][2]][y - d[i][3]].type == 'monstr') Monstr = this.Map[x - d[i][2]][y - d[i][3]].title.replace(/\s*X\d+Y\d+/, '');
                    if (Monstr == 'Опасная зона') Monstr = 1;
                    var res = this.options.open_door_filter_txt.match(RegExp('(?:^|,)(?:' + Monstr + ')(?:,|$)', "i"));
                    if (!res) {
                        var keyLinks = $('a[href="?useitem=' + key + '"]', win.document.body);
                        if (keyLinks.length > 0) {
                            keyLinks[0].click();
                            return;
                        }
                    }
                }
            }
        }

        this.Go(win);
    }
    this.CognitionLab = function (mapID) {
        var This = this;

        func.query("lab2.php?lookmap=" + mapID)
            .then(function (html) {
                var rmapid = func.search('Карта:([0-9]+)<br><html>', html);
                if (rmapid != $.jStorage.get("MapID")) {
                    alert('Это карта другого лабиринта');
                    return;
                }

                var me = 0, dil = 0, html = html.split('\n').join(' ');
                var cells = func.searchAll('<img src="?(http:\\/\\/i.oldbk.com\\/llabb\\/([^\.]+).gif)"?[^">]*"?([^">]+)?"?[^>]*>', html);

                for (var i in cells) {
                    if (cells[i][0] == 'http://i.oldbk.com/llabb/ot2.gif') {
                        me = i;
                        break;
                    }
                }

                var px = Math.floor(me / 49), py = (me - (px * 49));
                px = This.Me.x - px;
                py = This.Me.y - py;


                for (var i in cells) {
                    var sx = Math.floor(i / 49),
                        sy = (i - (sx * 49)),
                        x = px + sx,
                        y = py + sy,
                        xy = x + '_' + y;


                    if (x < 1 || x > 49 || y < 1) continue;

                    var img = cells[i][0],
                        title = (cells[i][2] != undefined ? cells[i][2] + ' ' : '') + 'X' + sx + 'Y' + sy,
                        type = This.whoPoint(img);

                    This.Map[sx][sy].src = img;
                    This.Map[sx][sy].type = type;
                    This.Map[sx][sy].title = title;

                }

                if ($.jStorage.storageAvailable()) {
                    $.jStorage.set('Map', func.toJSON(This.Map), {TTL: This.expire});
                    func.message('Карта обновлена', 'Познание лабиринта');
                }
                if (/*classie.has(document.getElementById('cbp-spmenu-s' + 2), 'cbp-spmenu-open') &&*/ $("#popup_" + This.id)) {
                    This.DrawMap();
                }
            });
    }
}