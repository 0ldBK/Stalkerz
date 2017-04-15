<?php
//header('Content-Type: application/json; charset=utf-8');
if(isset($_POST["clan"])){
    $data = array(
        "login"=>"",
        "pass"=>"",
        "recipient"=>"klan",//получатель канал клана klan
        "cookie"=>"chat_bot"
    );
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
}
