<?php
header('Access-Control-Allow-Origin: *');

if(isset($_GET['clans'])){
    $arr = [];
    $clans = trim(urldecode($_GET['clans']));

    $arrClans = explode(",", $clans);

    foreach ($arrClans as $key => $clan) {
        $xml = simplexml_load_file('http://oldbk.com/api/clans_xml.php?clan='.$clan);

        if(!$xml) continue;

        foreach ( $xml->xpath('//user') as $key2 =>  $value) {
            $arr[]  = array(
                'id'      => (int)($value['id']),
                'align'   => (int)$value->align,
                'clan'    => (string)$clan,
                'login'   => (string)$value->login,
                'level'   => (int)$value->level,
                'ingame'  => (string)$value->ingame,
                'room'    => (string)$value->room,
                'battle'  => (int)$value->battle,
                'lasttime'  => (string)trim($value->lasttime)
            );
        }

    }

    $json = json_encode($arr);

    echo $json;
    unset($arr);
    unset($json);
}