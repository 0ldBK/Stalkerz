<?php
error_reporting(E_ALL | E_STRICT);
ini_set('display_errors', '1');

header('Access-Control-Allow-Origin: *');
header('Content-Type: text/html; charset=windows-1251');


class oldbk
{

    protected $login;
    protected $password;
    protected $name_cookie;
    protected $battle = null;
    public $PHPSESSID;
    protected $agent = "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:26.0) Gecko/20100101 Firefox/26.0";

    /**
     * @param $login
     */
    protected function login($login)
    {
        $this->login = $login;
    }

    /**
     * @param $password
     */
    protected function password($password)
    {
        $this->password = $password;
    }

    /**
     * @param $name_cookie
     */
    protected function name_cookie($name_cookie)
    {
        $this->name_cookie = $name_cookie;
    }

    /**
     * @param bool $head
     */
    protected function connect($head = false)
    {
        $ref = 'http://oldbk.com/';
        $ch = curl_init('http://capitalcity.oldbk.com/enter.php');
        curl_setopt($ch, CURLOPT_USERAGENT, $this->agent);
        curl_setopt($ch, CURLOPT_REFERER, $ref);
        curl_setopt($ch, CURLOPT_HEADER, $head);
        curl_setopt($ch, CURLOPT_NOBODY, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
//        curl_setopt($ch, CURLOPT_HTTPHEADER, $header );
        curl_setopt($ch, CURLOPT_COOKIESESSION, true);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, "login=".urlencode($this->login)."&psw=".$this->password);
        curl_setopt($ch, CURLOPT_COOKIEJAR, dirname(__FILE__).'/logs/'.$this->name_cookie.'.txt');
        $header = curl_exec($ch);
        curl_close($ch);

        if ($head) {
            $this->parser($header);
        }
    }

    /**
     * @param $conn
     * @return bool
     */
    protected function checkConnect($conn)
    {
        $this->connect($conn);

        if (is_null($this->battle)) {
            return false;
        }

        return true;
    }

    /**
     * @param $url
     * @param bool $returntransfer
     * @param bool $post
     * @param bool $postdata
     * @return mixed
     */
    protected function getContent($url, $returntransfer = true, $post = false, $postdata = false)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_USERAGENT, $this->agent);
        curl_setopt($ch, CURLOPT_REFERER, 'http://chat.oldbk.com/buttons.php');
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, $returntransfer);
//        curl_setopt($ch, CURLOPT_HTTPHEADER, $header );
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_ENCODING, "");
        curl_setopt($ch, CURLOPT_POST, $post);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postdata);
        curl_setopt($ch, CURLOPT_COOKIEFILE, dirname(__FILE__).'/logs/'.$this->name_cookie.'.txt');
        $content = curl_exec($ch);
        curl_close($ch);


        return $content;
//        return $this->convert_data($content);
    }

    /**
     * @param $header
     */
    protected function parser($header)
    {
        if (preg_match_all("/PHPSESSID\=(.*?)\;/is", $header, $arr)) {
            $this->PHPSESSID = end($arr[1]);
        }
        if (preg_match_all("/battle\=(\d+)/i", $header, $arr2)) {
            $this->battle = $arr2[1][0];
        }
    }

    /**
     * @param $t
     * @param string $from
     * @param string $to
     * @return array|string
     */
    protected function convert_data($t, $from = 'UTF-8', $to = 'WINDOWS-1251')
    {
        $to = strtolower($to);
        $from = strtolower($from);

        if (function_exists('mb_convert_encoding')) {
            if (is_array($t)) {
                $t = array_map(array('self', 'convert_data'), $t);
            } else {
                $t = mb_convert_encoding($t, $to, $from);
            }
        } else {
            if (function_exists('iconv')) {
                if (is_array($t)) {
                    $t = array_map(array('self', 'convert_data'), $t);
                } else {
                    $t = iconv($from, $to."//IGNORE", $t);
                }
            }
        }

        return $t;

    }

}

class ChatBot extends oldbk
{
    private $msg;
    private $nick;
    private $clan;
    private $privateTo;
    private $recipient = 'klan'; // получатель


    /**
     * ChatBot constructor.
     * @param $data
     */
    public function __construct($data)
    {
        $this->nick = $data['nick'];
        $this->msg = $data['msg'];
        $this->clan = $data['clan'];


        $bot_data = $this->getBotData();
        /**
         * Set bot  login , pass for connect
         */
        $this->login($bot_data["login"]);
        $this->password($bot_data["pass"]);
        $this->name_cookie($bot_data["cookie"]);
        $this->recipient = $bot_data['recipient'];

    }

    /**
     * Initialize
     */
    public function init()
    {
        $checkConnect = $this->checkConnect(true);
        $this->privateTo = "private [{$this->recipient}] {$this->nick}: ";
        if ($checkConnect) {
            $this->to_chat(rawurlencode($this->privateTo), rawurlencode(htmlspecialchars_decode($this->msg)));
        }
    }


    /**
     * @param $privat
     * @param $to_chat
     */
    private function to_chat($privat, $to_chat)
    {
        $url = 'http://chat.oldbk.com/ch.php?chtype=1&text='.$privat.' '.$to_chat.'  (c) chatbot';
        $this->getContent($url);
    }

    private function getBotData()
    {

        switch ($this->clan) {
            case 'Clanname':
                $url = '';
                break;


            default:

                $url = null;

        }

        if (is_null($url)) {
            die();
        }

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(array("clan" => $this->clan)));
        $result = curl_exec($ch);
        curl_close($ch);

        $bot_data = json_decode($result, true);

        return $bot_data;
    }
}


if (isset($_POST['msg']) and isset($_POST['nick'])) {
    if (!empty($_POST['msg'])) {

        $data = array(
            "nick" => trim(rawurldecode($_POST['nick'])),
            "msg" => trim(rawurldecode($_POST['msg'])),
            "clan" => trim($_POST['clan']),
        );

        $obj = new ChatBot($data);
        $obj->init();
    }
}