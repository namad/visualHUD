<?
try {
  $db = mysql_pconnect('localhost:0000', 'visualhud', 'password') or die("Database error!");
  mysql_select_db('visualhud', $db);
}
catch (Exception $e) {
  # do nothing. We still should be able to download config.
}

function initialize_counter() {
  $directory = "../../_temp/";
  $count = count(glob("" . $directory . "*.zip"));
  
  $query = "INSERT INTO downloads_count (`name`, `count`) VALUES ('downloads' , $count) ON DUPLICATE KEY UPDATE `count` =  $count";
  mysql_query($query) or die("Query error!");
  if (mysql_affected_rows() > 0 ) { return true; }
  return false;
}

function increment_downloads_counter() {
  $query = "INSERT INTO downloads_count (`name`, `count`) VALUES ('downloads' , 1) ON DUPLICATE KEY UPDATE `count` = `count` + 1";
  mysql_query($query) or die("Query error!");
  if (mysql_affected_rows() > 0 ) { return true; }
  return false;
}

function get_downloads_counter() {
  $query = "SELECT `count` FROM downloads_count WHERE `name` = 'downloads'";
  $resource = mysql_query($query) or die("Query error!");
  $result = mysql_fetch_assoc($resource);
  return $result['count'];
  return false;
}
?>
