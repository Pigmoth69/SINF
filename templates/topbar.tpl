<nav id="topbar">
	<div id="storeLogo">
		<img src="/res/logo.png" alt="Store Logo">
	</div>
	<div id="searchBar">
		<!-- Search bar aqui -->
	</div>
	{if $USERNAME == NULL}
		<div id="loginButton">
			<!-- Alterar caminho para login aqui -->
			<a href="/pages/auth/login.php">Login</a>
		</div>
	{else}
		<div id="userImage">
			<img src="/res/user.png" alt="user icon">
		</div>
	{/if}
	<div id="shopCartIcon">
		<img src="/res/cartIcon.png" alt="cart icon">
	</div>
</nav>