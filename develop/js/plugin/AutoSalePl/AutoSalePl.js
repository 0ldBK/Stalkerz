function AutoSalePl() {
    this.help = "#";
    this.name = "Автопродажа";
    this.id = "AutoSale";
    this.master = null;
    this.menuitem = null;
    this.enabled = false;
    this.options = {};
    this.SaleList = {};
    this.fsale = null;
    this.Start = function (win) {
        if (win.document.URL.indexOf("/church.php?got=1&level11=1") != -1 /*|| win.document.URL.indexOf("/shop.php") != -1*/) {
            if (this.enabled) {
                if (win.document.URL.indexOf("church.php?got=1&level11=1") != -1) {
                    this.fsale = "RepSale";
                }
                //else if(win.document.URL.indexOf("shop.php") != -1 ){
                //    this.fsale = "KrSale";
                //}
                DivSale = top.frames["main"].document.getElementById('sales');
                if (DivSale == null) {
                    DivSale = top.frames["main"].document.createElement('div');
                    DivSale.id = 'sales';
                    DivSale.style.position = "absolute";
                    DivSale.style.background = "#d7d7d7";
                    DivSale.style.fontFamily = "Tahoma, Verdana, Arial";
                    DivSale.style.fontSize = "12px";
                    DivSale.style.left = "0";
                    DivSale.style.top = "0px";
                    DivSale.style.padding = "10px";
                    DivSale.style.display = "block";
                    DivSale.innerHTML = "<button  onclick='top.window.PM.plugins[\"" + this.id + "\"]." + this.fsale + "()'>Продать все ресурсы</button><hr><div id='stext'></div>";
                    top.frames["main"].document.body.appendChild(DivSale);
                }
            }
        }
        else if (win.document.URL.indexOf("repair.php") != -1) {
            var DivRepair = top.frames["main"].document.getElementById('repair');
            if (DivRepair == null) {
                DivRepair = top.frames["main"].document.createElement('div');
                DivRepair.id = 'repair';
                DivRepair.style.background = "#d7d7d7";
                DivRepair.style.position = "absolute";
                DivRepair.style.top = "170px";
                DivRepair.style.right = "0";
                DivRepair.style.width = "285px";
                DivRepair.style.fontFamily = "Tahoma, Verdana, Arial";
                DivRepair.style.fontSize = "12px";
                DivRepair.style.padding = "10px";
                DivRepair.style.display = "block";
                DivRepair.innerHTML =
                    '<div style="text-align: left; width: 100%;">' +
                    '    <label>' +
                    '       <input name="undress" id="undressrepair" type="checkbox" value="1" checked> Раздеться перед ремонтом/перезарядкой' +
                    '    </label>' +
                    '</div>' +
                    '<div style="text-align: left; width: 100%;">' +
                    '    <label>' +
                    '        <input name="artrepair" id="artrepair" type="checkbox" value="1"> Ремонт артефактов' +
                    '    </label>' +
                    '</div>' +
                    '<hr>' +
                    '<div style="margin:0 auto;width: 250px;">' +
                    '<button style="padding: 2px;width: 250px;font-size: 10px;margin-bottom: 5px;" onclick=\'console.log("Charger all");top.window.PM.plugins["' + this.id + '"].Recharger(0);\'>Перезарядить ВСЕ встройки</button>' +
                    '<button style="padding: 2px;width: 250px;font-size: 10px;margin-bottom: 5px;" onclick=\'console.log("Charger cr");top.window.PM.plugins["' + this.id + '"].Recharger(1);\'>Перезарядить кредовые встройки</button>' +
                    '<button style="padding: 2px;width: 250px;font-size: 10px;margin-bottom: 5px;" onclick=\'console.log("Charger ecr");top.window.PM.plugins["' + this.id + '"].Recharger(2);\'>Перезарядить екровые встройки</button>' +
                    '<button style="padding: 2px;width: 250px;font-size: 10px;margin-bottom: 5px;" onclick=\'console.log("Repair");top.window.PM.plugins["' + this.id + '"].Recharger(false, true);\'>Отремонтировать синие вещи</button>' +
                    '<button style="padding: 2px;width: 250px;font-size: 10px;margin-bottom: 5px;" onclick=\'console.log("Repair");top.window.PM.plugins["' + this.id + '"].Recharger(false, true, true);\'>Отремонтировать ВСЕ вещи</button>' +
                    '   <div>';
                top.frames["main"].document.body.appendChild(DivRepair);

            }
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
                    This.options = {};
                }
            }
        }
    }
    this.Enable = function () {
        this.enabled = true;
    }
    this.Disable = function () {
        this.enabled = false;
    }
    this.MenuItem = function () {
        if (this.master != null && this.menuitem == null) {
            var This = this;
            This.mid = this.master.menu_id;
            This.cid = this.master.content_id;
            var menu_item = $('<input type="hidden" value="Продажа Pесурсов"/>');
            this.menuitem = $(menu_item);
            return this.menuitem;
        } else
            return this.menuitem;
    }
    this.RepSale = function () {
        var This = this;
        var reputation = 0;

        func.query("church.php?got=1&level11=1")
            .then(function (data) {
                var resources = func.searchAll("got=1&level11=1&doit=([0-9]+)", data);
                var reslength = resources.length, i = 0;
                for (i; i < reslength; i++) {
                    func.query("church.php?got=1&level11=1&doit=" + resources[i])
                        .then(function (data2) {
                            reslength--;
                            if (data2.indexOf("Вы пожертвовали") != -1) {
                                var inf = data2.match(/отделку: (.+?) x([0-9]+).*?<\/b><br>И получили ([0-9]+)/i);
                                reputation += parseInt(inf[3]);
                                DivSale.innerHTML += "<div>" + inf[1] + " x " + inf[2] + " за " + parseInt(inf[3]) + " репы</div>";
                            } else {
                                DivSale.innerHTML += "<div>Ошибка сдачи ресов!</div>";
                            }
                            if (reslength < 1) {
                                func.notify('Автопродажа', 'Сдано ресурсов на: ' + reputation + ' репутации.');
                                func.message("Сдано ресурсов на: " + reputation + " репутации.", "Автопродажа", "shop-bot");
                            }
                        });
                }

            });
    }
    this.KrSale = function () {
        var allp = 0, allc = 0;
        $.post("shop.php", {sale: 1, ssave: 1, rzd0: 1, f: 2}, function (data) {
            var counts = data.match(/количество:<b> ([0-9]+)/g);
            var infos = data.match(/AddCount\('([0-9]+)', '([^']+)/g);
            allc = infos.length;
            for (var i in infos) {
                var count = counts[i].match(/количество:<b> ([0-9]+)/i);
                var info = infos[i].match(/AddCount\('([0-9]+)', '([^']+)/i);

                var id = info[1], name = info[2];
                count = count[1];

                $.post("shop.php?sale=1&id=1&tmp=0&gift=1", {is_sale: 1, set: id, count: count}, function (data) {
                    allc--;
                    if (data.indexOf("Вы продали") > -1) {
                        var inf = data.match(/<font color="?'?red"?'?><b>Вы продали "([^"]+)" \(?x?([0-9]+)?\)?\s?за ([0-9\.]+) кр.<\/b><\/font>/i); //'
                        allp = allp + parseInt(inf[3]);
                        DivSale.innerHTML += "<div>Продано: " + inf[1] + " x " + inf[2] + " за " + inf[3] + " кр.</div>";
                    } else {
                        DivSale.innerHTML += "<div>Ошибка продажи</div>";
                    }
                    if (allc < 1) {
                        func.message("Продано ресурсов на сумму: " + allp + " кр.", "Автопродажа", "shop-bot");
                        //DivSale.innerHTML += "Продано ресурсов на сумму: "+allp+" кр.";
                    }
                });
            }
        });

    }
    this.Dispose = function () {
    }
    this.saveSet = function (name, callback) {
        $.post('main.php?edit=1', {'sd4': 6, 'savecomplect': name}, function (html) {
            if (html.indexOf("Вы перезаписали комплект") > -1) {
                console.debug('Комплект перезаписан');
                if (callback) callback(true);
            } else if (html.indexOf("Вы запомнили комплект") > -1) {
                console.debug('Комплект сохранён');
                if (callback) callback(true);
            } else {
                if (callback) callback(false);
                console.debug('Комплект НЕ сохранён');
            }
        });
    }
    this.dressSet = function (id, manual, callback) {
        var This = this;
        $.ajax({
            url: '/main.php?edit=1',
            success: function (data) {
                var sets = func.searchAll("&complect=([0-9]+).+?Надеть.+?([^<\"]+)", data);
                for (var set1 in sets) {
                    //if(Sets[set1][1].toLowerCase() == id.toLowerCase() || Sets[set1][0] == id) {
                    if (sets[set1][1] == id) {
                        id = sets[set1][0];
                        break;
                    }
                }
                $.get('main.php?edit=1&complect=' + id, function (html) {
                    if (html.indexOf("&nbsp;Обмундирование") > -1) {
                        console.debug('Комплект одет');
                        if (callback) {
                            callback(true);
                        } else if (manual) alert('Комплект одет');
                    } else {
                        console.debug('Комплект НЕ одет');
                        if (callback) {
                            callback(false);
                        } else if (manual) alert('Ошибка!');
                    }
                });
            }
        });
    }
    this.undressAll = function (callback) {
        $.get('main.php?edit=1&undress=all', function (html) {
            if (html.indexOf("&nbsp;Обмундирование") > -1) {
                console.debug('Шмот снят');
                callback(true);
            } else {
                callback(false);
                console.debug('Шмот НЕ снят!!!');
            }
        });
    }
    this.Recharge = function (type, dress) {
        var This = this;
        var regexp = 'razdel=2&it=([0-9]+)(&ekr=1)?';
        func.message("Перезарядка... ");
        //получаем список вещей для перезаряда
        $.get("/repair.php?razdel=2", function (data) {
            data = data.split('\n').join('');
            data = data.split('\r').join('');
            data = data.split('\t').join('');
            data = data.split('  ').join(' ');

            var installs = data.match(new RegExp(regexp, "ig"));
            var all = installs ? installs.length : 0, charge = 0, stopEcr = false, stopCr = false;
            if (all < 1) {
                if (dress) {
                    This.dressSet('repair-tmp', false, function () {
                        func.message('Нечего перезаряжать. Комплект одет.', "Перезарядка");
                        top.frames.main.location.href = top.frames.main.location.href;
                    });
                } else {
                    func.message('Нечего перезаряжать.', "Перезарядка");
                }

                return;
            }

            for (var i in installs) {
                var install = installs[i].match(new RegExp(regexp, "i"));
                console.debug(install);
                if (type == 0 || (type == 1 && !install[2]) || (type == 2 && install[2])) {
                    //перезаряжаемся
                    $.get("/repair.php?razdel=2&it=" + install[1] + install[2], function (data) {
                        all--;
                        var bad = false;
                        if (data.indexOf("Войти в счет") > -1) {
                            if (!stopEcr)
                                func.message('Войдите в личный счёт для перезаряда екровых встроек!', "Перезарядка");
                            stopEcr = true, bad = true;
                        }
                        if (data.indexOf("У вас не хватает еврокредитов") > -1) {
                            if (!stopEcr)
                                func.message('У вас не хватает еврокредитов!', "Перезарядка");
                            stopEcr = true, bad = true;
                        }
                        if (data.indexOf("У вас не хватает денег") > -1) {
                            if (!stopCr)
                                func.message('У вас не хватает кредитов!', "Перезарядка");
                            stopCr = true, bad = true;
                        }
                        if (!bad) charge++;

                        if (all < 1) {
                            var message = "Перезарядка окончена. Вещей перезаряжено: " + charge + ". ";
                            if (stopEcr) message += "Не все екровые вещи перезаряжены. ";
                            if (stopCr) message += "Не все кредовые вещи перезаряжены. ";

                            if (dress) {
                                This.dressSet('repair-tmp', false, function () {
                                    func.message(message + "Комплект одет.", "Перезарядка");
                                    top.frames.main.location.href = top.frames.main.location.href;
                                });
                            } else {
                                func.message(message, "Перезарядка");
                                top.frames.main.location.href = top.frames.main.location.href;
                            }
                        }
                    });
                } else {
                    all--;
                }
            }
            if (all < 1) {
                var message = "Перезарядка окончена. Вещей перезаряжено: " + charge + ". ";
                if (stopEcr) message += "Не все екровые вещи перезаряжены. ";
                if (stopCr) message += "Не все кредовые вещи перезаряжены. ";

                if (dress) {
                    This.dressSet('repair-tmp', false, function () {
                        func.message(message + "Комплект одет.", "Перезарядка");
                        top.frames.main.location.href = top.frames.main.location.href;
                    });
                } else {
                    func.message(message, "Перезарядка");
                    top.frames.main.location.href = top.frames.main.location.href;
                }
            }
        });
    }
    this.Recharger = function (type, isRepair, isFullRepair) {
        var This = this;
        var undress = $("#undressrepair", top.frames.main.document.body).is(":checked");

        if (undress) {
            This.saveSet('repair-tmp', function () {
                This.undressAll(function () {//config.message("Разделись...");
                    if (isRepair) {
                        This.Repair(true, isFullRepair);
                    } else {
                        This.Recharge(type, true);
                    }
                });
            });
        } else {
            if (isRepair) {
                This.Repair(false, isFullRepair);
            } else
                This.Recharge(type);
        }
    }
    this.Repair = function (dress, isFullRepair) {
        var This = this;
        console.debug('Ремонт');
        var regexp = '<TR bgcolor=#[^>]+>.+?</small></td></TR>';
        var artrepair = $("#artrepair", top.frames.main.document.body).is(":checked");

        //получаем список вещей для ремонта
        $.get("/repair.php?razdel=0", function (data) {

            data = data.split('\n').join('');
            data = data.split('\r').join('');
            data = data.split('\t').join('');
            data = data.split('  ').join(' ');
            var sost = data.match(/<BR>Долговечность: ([0-9]+)\/([0-9]+)/ig);
            var link = data.match(/rep=([0-9]+)&sid=/ig);
            var name = data.match(/target=_blank>([^<]+)<\/a>/ig);
            var IDS = [], TMP = {}, all = 0, fall = 0, repair = 0, stopCr = false;
            for (var i in link) {
                var id = link[i].match(/rep=([0-9]+)&sid=/i);
                if (!TMP[id[1]]) {
                    IDS.push(+id[1]);
                }
                TMP[id[1]] = true;
            }

            all = IDS.length;

            for (var i in name) {
                var iname = name[i].match(/target=_blank>([^<]+)<\/a>/i);
                var isost = sost[i].match(/<BR>Долговечность: ([0-9]+)\/([0-9]+)/i);
                var min = +isost[1], max = +isost[2], item = iname[1], id = IDS[i];
                var isArt = max <= 100 ? false : true;
                var isBlue = (max - min < 3) ? true : false;

                if ((isArt && !artrepair) || (!isBlue && !isFullRepair) || min < 2) {
                    all--;
                    continue;
                }
                fall++;

                console.debug('>match! ' + [item, min, max, id]);

                func.message("Ремонт предмета " + item + " [" + min + "/" + max + "]", "Ремонт");

                $.get("/repair.php?rep=" + id + "&sid=full&e=0", function (data) {
                    all--;
                    if (data.indexOf("Недостаточно денег") > -1) {
                        if (!stopCr)
                            func.message('У вас не хватает кредитов на ремонт!');
                        stopCr = true;
                    }
                    if (!stopCr) repair++;
                    if (all < 1) {
                        message = "Ремонт окончен. Вещей починено: " + repair + " из " + fall + ". ";
                        if (dress) {
                            This.dressSet('repair-tmp', false, function () {
                                func.message(message + "Комплект одет.", "Ремонт");
                                top.frames.main.location.href = top.frames.main.location.href;
                            });
                        } else func.message(message, "Ремонт");
                    }
                });
            }
            if (all < 1) {
                message = "Ремонт окончен. Вещей починено: " + repair + " из " + fall + ". ";
                if (dress) {
                    This.dressSet('repair-tmp', false, function () {
                        func.message(message + "Комплект одет.", "Ремонт");
                        top.frames.main.location.href = top.frames.main.location.href;
                    });
                } else func.message(message, "Ремонт");
            }
        });
    }
}