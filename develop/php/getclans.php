<?php
//ini_set('xdebug.var_display_max_depth', 5);
//ini_set('xdebug.var_display_max_children', 256);
//ini_set('xdebug.var_display_max_data', 1024);

header('Access-Control-Allow-Origin: *');

require_once (__DIR__.'/simple_html_dom.php');


$html = file_get_html('http://oldbk.com/encicl/klani/clans.php');

$table_library = $html->find('td[class=TD1]', 0)->find('strong');


$data = array();

foreach ($table_library as $key => $strong) {

    $name = trim($strong->text());
    preg_match('/align_(\d+(?:\.\d{0,2})?)\.gif/i', $strong->children[0], $align);

    if( ($_GET['dark'] == "false" && $align[1] == "3") ||
        ($_GET['bright'] == "false" && ($align[1] == "6" || $align[1] == "1.99")) ||
        ($_GET['neutral'] == "false" && $align[1] == "2")
    ) {
        continue;
    }

    if ((stripos($name, 'test') !== false || stripos($name, 'admin') !== false)) {
        continue;
    }

    if ($name == 'Paladins') {
        $data[$key]['name'] = 'pal';
    } else {
        $data[$key]['name'] = $name;
    }

    switch($align[1]) {
        case "2":
            $data[$key]['type'] = "neutral";
            break;

        case "3":
            $data[$key]['type'] = "dark";

            break;

        case "1.99":
        case "6":
            $data[$key]['type'] = "bright";
            break;
    }

    ;

}

echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);