<?php
  /*session_set_cookie_params(3600, '/~lbaw1523'); //FIXME
  session_start();
*/
  error_reporting(E_ERROR | E_WARNING); // E_NOTICE by default

  $BASE_DIR = '/Users/test/Desktop/Faculdade/4/SINF/project/SINF/'; //FIXME
  //$BASE_URL = '/~lbaw1523/final/'; //FIXME
/*
  $conn = new PDO('pgsql:host=dbm;dbname=lbaw1523', 'lbaw1523', 'YX18C6X0'); //FIXME
  $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  $conn->exec('SET SCHEMA \'final\''); //FIXME
*/
  include_once( '/Users/test/Desktop/Faculdade/4/SINF/project/SINF/smarty-3.1.30/Smarty.class.php');

  $smarty = new Smarty;
  $smarty->template_dir = $BASE_DIR . 'templates/';
  $smarty->compile_dir = $BASE_DIR . 'templates_c/';
  $smarty->cache_dir = $BASE_DIR . 'cache/';
  $smarty->config_dir = $BASE_DIR . 'configs/';
  //$smarty->assign('BASE_URL', $BASE_URL);
/*
  $smarty->assign('ERROR_MESSAGES', $_SESSION['error_messages']);
  $smarty->assign('FIELD_ERRORS', $_SESSION['field_errors']);
  $smarty->assign('SUCCESS_MESSAGES', $_SESSION['success_messages']);
  $smarty->assign('FORM_VALUES', $_SESSION['form_values']);
  $smarty->assign('USERNAME', $_SESSION['username']);

  unset($_SESSION['success_messages']);
  unset($_SESSION['error_messages']);
  unset($_SESSION['field_errors']);
  unset($_SESSION['form_values']);
  */
?>
