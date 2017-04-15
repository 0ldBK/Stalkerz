<?php
header('Access-Control-Allow-Origin: *');


class Panel
{
    private $panel_src;
    private $game_id;
    private $game_session;
    private $url = 'http://capitalcity.oldbk.com/myabil.php';

    public function __construct($post)
    {
        $post = array_map('trim', $post);

        $this->game_id = $post['gid'];
        $this->game_session = $post['gses'];
    }

    private function run()
    {
        if ($this->checkAuth()) {
            $this->panel_src['data'] = '<%= panelDir %>Core_panel.js?' . mt_rand();
        } else {
            $this->panel_src['error'] = 'Auth fail';
        }
        return $this->tojson($this->panel_src);
    }

    private function checkAuth()
    {
        if ($this->game_session && $this->game_id && strpos($_SERVER['HTTP_REFERER'], 'oldbk.com') !==false) {
            return true;
        }

        return false;
    }

    private function tojson($data)
    {
        return json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    public function __toString()
    {
        return $this->run();
    }

}

echo new Panel($_POST);

