{include file='../templates/common/topbar.tpl'}

<head>
	<link rel="stylesheet" type="text/css" href="../css/profile.css">
</head>

<div class="container">
	<div class="row">
		<div id="userPhoto" class="col-xs-3">
			<img src="../res/user.png" alt="user photo">
		</div>
		<div id="userInfo" class="col-xs-8 col-xs-offset-1">
			<div class="row completeRow">
				<p>Name:</p>
				<div class="row">
					<div class="col-xs-9">User01829</div>
					<div class="col-xs-3"><button>Edit</button></div>
				</div>
			</div>
			<div class="row completeRow">
				<p>Email:</p>
				<div class="row">
					<div class="col-xs-9">User01829@gmail.com</div>
					<div class="col-xs-3"><button>Edit</button></div>
				</div>
			</div>
			<div class="row completeRow">
				<p>Password:</p>
				<div class="row">
					<div class="col-xs-9">********</div>
					<div class="col-xs-3"><button>Edit</button></div>
				</div>
			</div>
			<div class="row completeRow">
				<p>Address:</p>
				<div class="row">
					<div class="col-xs-9">Rua Dr. Roberto Frias, 4200-465 Porto</div>
					<div class="col-xs-3"><button>Edit</button></div>
				</div>
			</div>
		</div>
        <div class="col-xs-3">
		</div>
        <div class=" col-xs-8 col-xs-offset-1 ">
            <br>
            <br>
            <button onclick="window.location.href='orderPage.php'">See Your Orders</button>
        </div>
	</div>
</div>
{include file='common/footer.tpl'}