<?php

/**
 * Interface ILoger
 */
interface ILoger
{
    public function write($message);
}

/**
 * Class FileLoger
 */
class FileLoger implements ILoger
{
    private $path = '/logs/';

    public function __construct()
    {
        date_default_timezone_set('Europe/Kiev');
        $this->path = dirname(__FILE__).$this->path;
    }

    public function write($message)
    {
        $date = new DateTime();
        $log = $this->path.$date->format('Y-m-d').".txt";

        if (is_dir($this->path)) {
            if (!file_exists($log)) {
                $fh = fopen($log, 'a+') or die("Fatal Error !");
                $logcontent = "Time : ".$date->format('H:i:s')."\r\n".$message."\r\n";
                fwrite($fh, $logcontent);
                fclose($fh);
            } else {
                $this->edit($log, $message);
            }
        } else {
            if (mkdir($this->path, 0777) === true) {
                $this->write($message);
            }
        }
    }

    private function edit($log, $message)
    {
        $date = new DateTime();
        $logcontent = "Time : ".$date->format('H:i:s')."\r\n".$message."\r\n\r\n";
        $logcontent = $logcontent.file_get_contents($log);
        file_put_contents($log, $logcontent);
    }
}

/**
 * Class DBLoger
 */
class DBLoger implements ILoger
{
    private $table;

    public function __construct($table='log')
    {
        $this->table = $table;
    }
    public function write($message)
    {
        $person = new Person();
        $person->table = $this->table;
        foreach ($message as $key => $item) {
            $person->$key = $item;
        }

        $person->create();
    }

    public function edit()
    {

    }
}

/**
 * Class JSONLoger
 */
class JSONLoger implements ILoger
{
    private $path = '/logs/';
    private $filename;

    public function __construct($filename)
    {
        $this->path = dirname(__FILE__).$this->path;
        $this->filename = $filename;
    }

    public function write($message)
    {
        $log = $this->path.$this->filename.".json";

        if (is_dir($this->path)) {
            if (!file_exists($log)) {
                $fh = fopen($log, 'a+') or die("Fatal Error !");
                fwrite($fh, $message);
                fclose($fh);
            } else {
                $this->edit($log, $message);
            }
        } else {
            if (mkdir($this->path, 0777) === true) {
                $this->write($message);
            }
        }
    }

    private function edit($log, $message)
    {
        $message = $message.file_get_contents($log);
        file_put_contents($log, $message);
    }

    public function load()
    {
        $log = $this->path.$this->filename.".json";
        $json_a = json_encode(file_get_contents($log));
        return $json_a;
    }
}