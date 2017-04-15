<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: text/html; charset=utf-8');

function myIconv($data){
    if(is_array($data))
        return array_map('myIconv', $data);
    else
        return iconv('WINDOWS-1251', 'UTF-8', $data);
}

if(isset($_GET['event']) && $_GET['event'] == 'ih'){
    $file = simplexml_load_file('http://oldbk.com/api/doska_xml.php');

    $xpath = $file->xpath("//event[@bot_id]");

    if($xpath){
        $bot_id = $xpath[0]['bot_id'];
        $bot_description = $xpath[0]['description'];
        $bot_room = $xpath[0]['bot_room'][0];


        $ih = explode("-", $bot_description);
        $ih_name = trim($ih[0]);
        $ih_status = trim($ih[1]);
        $ih_time = '';

        preg_match('/(\d+)/is', $ih_name, $ih_lvl);

        if(preg_match('/через\:(\d+) ч\. (\d+) мин\./is', $ih_status, $m)){
            $ih_time = $m[2];
        }


        $arr = array(
            "name" => (string)$ih_name,
            "status" => (string)$ih_status,
            "room" => (string)$bot_room,
            "id" => (int)$bot_id,
            "level" => (int)$ih_lvl[0],
            "time" => (int)$ih_time
        );

        echo json_encode($arr);
    }
}