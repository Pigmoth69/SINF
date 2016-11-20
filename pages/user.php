<?php
    include_once '../config/init.php';

    if (count($_SESSION) === 0 || $_SESSION['user'] == '') {
        header("Location: LoginPage.php");
        exit;
    }
    
    $smarty->display('../templates/profile.tpl');
?>
