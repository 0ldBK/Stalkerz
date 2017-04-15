<?php
header('Access-Control-Allow-Origin: *');
header("Content-Type: text/html;charset=utf-8");
require_once("db.class.php");
require_once("paginator.class.php");



@session_start();

$dataAcc = array(
    'login' => 'pass'
);


if (isset($_POST["enter"])) {
    if (isset($_POST['login']) and isset($_POST['password'])) {
        foreach ($dataAcc as $login => $pass) {
            if ($login == $_POST['login'] and $pass == $_POST['password']) {
                $_SESSION['admin'] = 1;
                $_SESSION['login'] = $login;
            }
        }
    } else {
        $error = true;
    }
}

if (!isset($_SESSION['admin'])) {

    $to_show = <<<HTML
    <form method="post">
        <table border="0">
            <tr>
                <td>Логин:</td>
                <td><input type="text" size="20" name="login" value="{$_POST['login']}"/></td>
            </tr>
            <tr>
                <td>Пароль:</td>
                <td><input type="password" size="20" name="password"/></td>
            </tr>
            <tr>
                <td colspan="2" style="text-align:right"><input name="enter" type="submit" value=" ВХОД "/></td>
            </tr>
        </table>
    </form>
HTML;
    echo $to_show;
}
else {
    $arr = array();

    $settings = parse_ini_file("settings.ini.php", true);
    $db = new MysqliDb ($settings['prod']);


    if (isset($_GET["delete"]) && isset($_GET["id"])) {
        $db->where('id', $_GET["id"]);
        $db->delete('log');
        header("Location: ".$_SERVER['PHP_SELF']);
    }

    $db->setTrace (true);
    $db->pageLimit = 15;
    $pages = new Paginator($db->pageLimit, 'p');
    $pages->set_total($db->getValue("log", "count(id)"));
    $db->orderBy('id', 'desc');
    $persons = $db->get("log", $pages->get_limit());
    var_dump ($db->trace);


    foreach ($persons as $i) {
        if (!empty($i["clan"])) {
            $clan = "<img src=\"http://i.oldbk.com/i/klan/".$i['clan'].".gif\">";
        } else {
            $clan = "";
        }
        $arr[] .=
            "<tr>
                <td>".$i["date"]."</td>
                <td>".$i["ip"]." <a href=\"http://who.is/whois-ip/ip-address/".$i["ip"]."\" target=\"_blank\">&nbsp;who is</a></td>
                <td>".$i["login"]."<a target=\"_blank\" href=\"http://capitalcity.oldbk.com/inf.php?".$i["gid"]."\">
                    <img width=\"12\" height=\"11\"  src=\"http://i.oldbk.com/i/inf.gif\"></a>
                </td>
                <td><img src=\"http://i.oldbk.com/i/align_".$i["align"].".gif\">".$clan.$i["clan"]."</td>
                <td>".$i["session"]."</td>
                <td><a onClick=\"if(confirm('Точно?')) return true;else return false\" href='?delete=&id=".$i["id"]."'>Удалить</a></td>
            </tr>";
    }
    $join = join($arr, "\n");
    $links = $pages->page_links();
    echo <<<html
<style>
table, tr, td, th {border:solid 1px;border-collapse:separate;}
td{padding: 5px;}
thead,th {background-color: #ebebeb;}
a{text-decoration: none;}
.pagination {
    clear: both;
    padding: 0;
}
.pagination li {
	display:inline;
}
.pagination a {
    border: 1px solid #D5D5D5;
    color: #666666;
    font-size: 11px;
    font-weight: bold;
    height: 25px;
    padding: 4px 8px;
    text-decoration: none;
    margin:2px;
}
.pagination a:hover, .pagination a:active {
    background:#efefef;
}
.pagination span.current {
    background-color: #687282;
    border: 1px solid #D5D5D5;
    color: #ffffff;
    font-size: 11px;
    font-weight: bold;
    height: 25px;
    padding: 4px 8px;
    text-decoration: none;
	margin:2px;
}
.pagination span.disabled {
    border: 1px solid #EEEEEE;
    color: #DDDDDD;
    font-size: 11px;
    margin: 2px;
    padding: 4px 8px;
}
</style>
$links
<table>
    <thead>
        <th>Дата</th>
        <th>IP</th>
        <th>Логин</th>
        <th>Склонность/Клан</th>
        <th>Сессия</th>
        <th></th>
    </thead>
    <tbody>
        $join
    </tbody>
</table>
$links
html;
}
