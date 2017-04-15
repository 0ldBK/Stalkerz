<?php
//header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Origin: http://capitalcity.oldbk.com');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');


require_once("db.class.php");

class Plugins
{
    public $plugins = [];

    public function setType($type)
    {
        $plugins = [];

        switch ($type) {
            case 'basic':
                $plugins = [
                    'PluginMaster',
                    'NastroikaPl',
                    'AutoFightPl',
                    'AutoUdarPl',
                    'RestalPl',
                    'Labirint2Pl',
                    'RuinsPl',
                    'ResetHpPl',
                    'RunAwayPl',
                    'RadioPL',
                    'AutoSalePl',
                    'FludPL',
                    'AutoAttackPL',
                ];
                break;

            case 'clan':
                $plugins = [
                    'PluginMaster',
                    'NastroikaPl',
                    'AutoFightPl',
                    'AutoUdarPl',
                    'RestalPl',
                    'Labirint2Pl',
                    'RuinsPl',
                    'ResetHpPl',
                    'RunAwayPl',
                    'RadioPL',
                    'AutoSalePl',
                    'FludPL',
                    'AutoWarPl',
                    'ChatBotPl',
                    'AutoAttackPL',
                ];
                break;


            case 'admin':
                $plugins = [
                    'PluginMaster',
                    'NastroikaPl',
                    'AutoFightPl',
                    'AutoUdarPl',
                    'RestalPl',
                    'Labirint2Pl',
                    'RuinsPl',
                    'NaviPl',
                    'ResetHpPl',
                    'RunAwayPl',
                    'TrapPl',
                    'RadioPL',
                    'AutoSalePl',
                    'FludPL',
                    'WarPl',
                    'AutoWarPl',
                    'ChatBotPl',
                    'AutoAttackPL',
                    'AutoProposalPl',
                    'AutoCurePl',
                ];
                break;

            case 'dev':

                $plugins = [];

                break;
        }

        foreach ($plugins as $key => $item) {
            $file = '../js/plugin/'.$item.'/'.$item.'.js';
            if(file_exists($file)) {
                $html = file_get_contents($file);
                $this->plugins[$key]['name'] = $item;
                $this->plugins[$key]['data'] = $html;
            }
        }

        return $this->plugins;
    }
}


class Access
{
    private $db;
    private $allowed;
    private $user;
    private $game_id;
    private $game_session;
    private $url = 'http://capitalcity.oldbk.com/myabil.php';

    public function __construct($post)
    {
        $settings = parse_ini_file("settings.ini.php", true);
        $this->db = new MysqliDb ($settings['local']);

        $post = array_map('trim', $post);

        $this->game_id = $post['gid'];
        $this->game_session = $post['gses'];

        $this->allowed = include 'allowed.php';
    }

    private function run()
    {
        if ($this->checkAuth()) {
            $this->user = $this->get_user_param();

            $pl = new Plugins;

            if ($this->user['id'] == 0) {
                $this->user['accept'] = (bool)true;
                $this->user['plugins'] = $pl->setType('admin');
            } else {
                if (in_array($this->user['klan'], $this->allowed['clans'])) {
                    $this->user['accept'] = (bool)true;
                    $this->user['plugins'] = $pl->setType('clan');
                } elseif (array_key_exists($this->user['id'], $this->allowed['users'])) {
                    $this->user['accept'] = (bool)true;
                    $this->user['plugins'] = $pl->setType('basic');
                } else {
                    $this->user['accept'] = (bool)false;
                    $this->user['plugins'] = (bool)false;
                }
            }
        }

        return $this->tojson($this->user);
    }

    private function get_user_param()
    {
        $html = file_get_contents('http://capitalcity.oldbk.com/inf.php?'.$this->game_id.'&short=1&r='.rand());
        $html = $this->myIconv($html);

        $key_val = explode((PHP_OS == "WINNT") ? "\n" : PHP_EOL, $html);

        $params = array_map(
            function ($i) {
                return explode('=', $i);
            },
            $key_val
        );

        $arr = [];
        foreach ($params as $param) {
            if (!$param[0]) {
                continue;
            }
            $arr[$param[0]] = is_numeric($param[1]) ? (int)$param[1] : (string)$param[1];
        }

        return $arr;

    }

    private function curl_get($url, $pid, $psession)
    {
        $agent = $_SERVER['HTTP_USER_AGENT'];
        $strCookie = 'PHPSESSID='.$psession.'; battle='.$pid.'; path=/';

        $options = array(
            CURLOPT_RETURNTRANSFER => true,     // return web page
            CURLINFO_HEADER_OUT => true,
            CURLOPT_HEADER => false,            // don't return headers
            CURLOPT_FOLLOWLOCATION => true,     // follow redirects
            CURLOPT_ENCODING => "",             // handle all encodings
            CURLOPT_USERAGENT => $agent,        // who am i
            CURLOPT_AUTOREFERER => true,        // set referer on redirect
            CURLOPT_CONNECTTIMEOUT => 120,      // timeout on connect
            CURLOPT_TIMEOUT => 120,             // timeout on response
            CURLOPT_MAXREDIRS => 10,            // stop after 10 redirects
            CURLOPT_COOKIE => $strCookie,
            CURLOPT_COOKIESESSION => true,
        );

        $ch = curl_init($url);
        curl_setopt_array($ch, $options);
        curl_exec($ch);
        $header = curl_getinfo($ch, CURLINFO_HEADER_OUT);
        curl_close($ch);

        return $header;
    }

    private function checkAuth()
    {
        $header = $this->curl_get($this->url, $this->game_id, $this->game_session);

        if (
            preg_match('/PHPSESSID=\s*([^;]*)/i', $header, $session) &&
            preg_match('/battle=\s*([^;]*)/i', $header, $id)
        ) {
            if ($session[1] == $this->game_session && $id[1] == $this->game_id) {
                return true;
            }
        }

        return false;
    }

    private function myIconv($data)
    {
        return is_array($data) ? array_map('myIconv', $data) : iconv('WINDOWS-1251', 'UTF-8', $data);
    }

    private function logUser()
    {
        $session = $this->findUserSession();

        if (is_null($session) || $session !== $this->game_session) {
            $this->db->insert(
                'log',
                array(
                    "ip" => $_SERVER['REMOTE_ADDR'],
                    "login" => $this->user["login"],
                    "align" => $this->user["align"],
                    "clan" => $this->user["klan"],
                    "gid" => $this->user["id"],
                    "session" => $this->game_session,
                )
            );
        }
    }

    private function findUserSession()
    {
        $this->db->where("session", $this->game_session);
        $user = $this->db->getOne("log");

        if (is_null($user)) {
            return null;
        }

        return $user['session'];
    }

    private function tojson($data)
    {
        return json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
    }

    public function __toString()
    {
        return $this->run();
    }

    public function __destruct()
    {
        $this->logUser();
    }

}

echo new Access($_POST);