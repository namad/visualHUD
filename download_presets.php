<?php
if (!empty($_POST) && !empty($_POST['hud_data'])) {

    $json_text = stripslashes($_POST['hud_data']);
    $json = json_decode($json_text);

    $zip = new ZipArchive;
    $temp_name = uniqid(rand(), true);

    $zip_name = "../../_temp/$temp_name.zip";

    $res = $zip->open($zip_name, ZipArchive::CREATE);
    $success = true;

    if ($res === TRUE) {
        foreach($json as $preset) {
            try {
                $zip->addFromString("$preset->name.vhud", json_encode($preset));
            } catch (Exception $e) {
                $success = false;
                echo "Oops :(";
            }
        }
        if($success == true) {
            $zip->close();
            header("Pragma: public");
            header("Expires: 0");
            header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
            header("Cache-Control: private",false);
            header("Content-Type: application/octet-stream");
            header("Content-Disposition: attachment; filename=$temp_name.zip");
            header("Content-Transfer-Encoding: binary");
            header("Content-Length: ".filesize($zip_name));
            echo readfile("$zip_name");
        }
    } else {
        echo "Unable to create zip archive";
    }
} else {
    header("Location: /");
}
?>