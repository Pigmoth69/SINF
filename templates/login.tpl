{include file='../templates/common/topbar.tpl'}

<head>
	<link rel="stylesheet" type="text/css" href="../css/login.css">
</head>

	<div class="container-fluid">
		<div class="row">
			<div id="login" class="formBox col-xs-4 col-md-4 col-xs-offset-1">
				<h1>Login</h1>
				<form id="loginForm" action="">
					<p>Username:</p>
					<input id="usernameInput" type="text" placeholder="Username">
					<br><br>
					<p>Password: <a href="http://google.pt">Forgot your password?</a></p>
					<input id="passwordInput" type="password" placeholder="Password">
					<br>
					<br>
					<button>Login</button>
					<br>
				</form>
			</div>
			<div id="Register" class="formBox col-xs-4 col-md-4 col-xs-offset-2">
				<h1>Register</h1>
				<form id="registerForm" action="">
					<p>Username:</p>
					<input id="usernameInputR" type="text" placeholder="Username">
					<br><br>
					<p>Password:</p>
					<input id="passwordInputR" type="password" placeholder="Password">
					<br><br>
					<p>Password again:</p>
					<input id="passwordInputR2" type="password" placeholder="Password">
					<br><br>
					<input type="checkbox" name="terms" value="terms">I agree with terms and conditions<br>
					<button>Register</button>
					<br>
				</form>
			</div>
		</div>
	</div>
    {include file='common/footer.tpl'}
