<?php
header('Access-Control-Allow-Origin: *');

require("loger.class.php");


if (isset($_POST['save']) && !empty($_POST['save'])) {
    $log = new JSONLoger("blist");
    $log->write(json_encode($_POST['save']));
}
elseif(isset($_POST['load'])){
    $log = new JSONLoger("blist");
    echo $log->load();

}