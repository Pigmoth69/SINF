<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" type="text/css" href="../css/topbar.css">
	<link rel="stylesheet" type="text/css" href="../bootstrap-3.3.7-dist/css/bootstrap.min.css">
    <!-- Optional Bootstrap theme -->
    <link rel="stylesheet" href="../bootstrap-3.3.7-dist/css/bootstrap-theme.min.css">
</head>

<body>
	<nav id="topbar" class="container-fluid">
		<div class="row">
			<div id="storeLogo" onclick="document.location='../pages/homePage.php'" class="col-xs-2 col-md-2">
				<img src="../res/logo.png" alt="Store Logo">
			</div>
			<div id="searchBar" class="col-xs-5 col-md-5 col-xs-offset-1">
				<form id="searchBox" action="">
				    <input id="search" type="text" placeholder="Search">
				</form>
			</div>
			<div id="userImage" onclick="document.location='../pages/user.php'" class="col-xs-1 col-md-1 col-xs-offset-1">
				<img src="../res/user.png" alt="user icon">
			</div>
			<div id="shopCartIcon" onclick="document.location='../pages/cartPage.php'"class="col-xs-1 col-md-1">
				<img src="../res/cartIcon.png" alt="cart icon">
			</div>
		</div>
	</nav>
