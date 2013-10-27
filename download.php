<?php
$bar_steps = 50;

include("lib/mysql.php");

function get_bar_ownerdraw($item) {
    if($item->name == 'armorBar') {
        return 'CG_PLAYER_ARMOR_VALUE';
    };
    if($item->name == 'healthBar') {
        return 'CG_PLAYER_HEALTH';
    };
}

function get_bar_left_offset($itm, $idx) {

    global $bar_steps;

    $w =  $itm->coordinates->width - $itm->padding*2;
    $mw = $w / $bar_steps;
    $offs = $itm->padding;

    if($itm->barDirection == '1'){
        $offs = $w - round($mw * $idx) + $itm->padding;
    };

    return $offs;
}

function get_bar_top_offset($itm, $idx) {

    global $bar_steps;

    $h =  $itm->coordinates->height - $itm->padding*2;
    $mh = $h / $bar_steps;
    $offs = $itm->padding;

    if($itm->barDirection == '0' || $itm->barDirection == '1') {
	    $height = $itm->coordinates->height - $offset * 2;
	    $barHeight = get_bar_height($itm, $idx);
	    $offs = round($offs - ($barHeight - $height) / 2, 2);
    }
    else if($itm->barDirection == '3'){
        $offs = $h - round($mh * $idx) + $itm->padding;
    };

    return $offs;
}

function get_bar_width($itm, $idx) {
    global $bar_steps;

    if($itm->barDirection == '0' || $itm->barDirection == '1'){
        $offset = $itm->padding;
        $width = $itm->coordinates->width - $offset * 2;
        $w = $width / $bar_steps;
    }
    else {
        $idx = 1;
        $w = $itm->coordinates->width - $offset * 2;
    }
    return round($w * $idx, 2);
}

function get_bar_height($itm, $idx) {
    global $bar_steps;

    $height = $itm->coordinates->height - $offset * 2;

    if($itm->barDirection == '0' || $itm->barDirection == '1'){
        $idx = 1;
	    $barHeight = round(($height * 8) / 7, 2);
    }
    else {
        $barHeight = round((($height / $bar_steps) * 8) / 7, 2);
    }
    return round($barHeight * $idx, 2);
}

function decode_color($color_string = "") {
    $res = preg_match("/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/", $color_string, $hex);
    if ($res) {
      $hex = array_slice($hex, 1);
      if (count($hex) != 3) return false;
      $rgb = array();
      for ($i = 0; $i < 3; $i++) {
        $rgb[] = round(intval((strlen($hex[$i]) == 1 ? $hex[$i].$hex[$i] : $hex[$i]), 16)/255, 1);
      }
      $ints = implode(" ", $rgb);
      return $ints;
    };
    return false;
}

function get_range_color($ranges, $idx, $end = NULL) {
    $i1 = $idx * 2;
    $i2 = is_null($end) ? $i1 + 1 : $end;
    foreach($ranges as $r){
        if($r->range[0] <= $i1 && $r->range[1] >= $i2){
            return $r->color;
        }
        if($r->range[1] == $i1){
            return $r->color;
        }
    }
}

function get_skill_color($ranges, $idx) {
    foreach($ranges as $r){
        if($r->range[0] <= $idx && $r->range[1] >= $idx){
            return $r->color;
        }
    }
}

function get_skill_range($start, $stop) {
    $string = "";

    $array = array();

    for ($i = 0; $start <= $stop; $start++) {
        array_push($array,$start);
    }

    return join(",", $array);
}
    
if (!empty($_POST) && !empty($_POST['hud_data'])) {

    $config_name = uniqid(rand(), true);

    $json_text = stripslashes($_POST['hud_data']);
    $json = json_decode($json_text);

    if (is_object($json)) {
      $items = $json->items;
    }

    if($json->name) {
        $config_name = $json->name;
    }

    ob_start();
    include("templates/header.php"); 

    foreach($items as $menuItem)
    {
      $name = ($menuItem->name == "scoreBox") ? "scoreBox_$menuItem->iconStyle" : $menuItem->name;
      include("templates/$name.php");
      print_r("\n\n");
    }
	
    //include("templates/chat.php");
    print_r("\n\n");
	  
    $menu_text = ob_get_clean();
    
    ob_start();
    include("templates/config.php");
    $config_text = ob_get_clean();

    ob_start();
    include("templates/how_to_install.php");
    $readme_text = ob_get_clean();

    ob_start();
    include("templates/_install_hud.php");
    $ibat_text = ob_get_clean();
	
    $zip = new ZipArchive; 
    $temp_name = uniqid(rand(), true);
  
    $zip_name = "../../_temp/$temp_name.zip";
  
    $res = $zip->open($zip_name, ZipArchive::CREATE);
    if ($res === TRUE) {
      try {
        $zip->addFromString("install_win_hud.bat", $ibat_text);
        $zip->addFromString("how to install.html", $readme_text);
        $zip->addFromString("$config_name.menu", $menu_text);
        $zip->addFromString("$config_name.cfg", $config_text);
        $zip->addFromString("$config_name.vhud", $json_text);
        $zip->close();
        
        increment_downloads_counter();
        
        header("Pragma: public");
        header("Expires: 0");
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Cache-Control: private",false);
        header("Content-Type: application/octet-stream");
        header("Content-Disposition: attachment; filename=$config_name.zip");
        header("Content-Transfer-Encoding: binary");
        header("Content-Length: ".filesize($zip_name));
        ob_clean();
        flush();
        echo readfile("$zip_name");
      } catch (Exception $e) {
        echo "Oops :(";
      }
    } else {
      echo "Oops :(";
    }
} else {
    header("Location: /");
}
?>