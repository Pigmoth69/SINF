{include file='../templates/common/topbar.tpl'}

<head>
	<link rel="stylesheet" type="text/css" href="../css/payment.css">
</head>

	<ul class="breadcrumb" id="checkoutBreadcrumb">
		<li><a href="#">Login</a></li>
		<li><a href="#">Address</a></li>
		<li><a href="#">Shipment</a></li>
		<li><a href="#">Payment</a></li>
		<li><a href="#">Confirmation</a></li>
	</ul>

	<div id="paymentBox" clas="container">
		<form id="creditCardForm">
			<div class="row">
				<div class="col-xs-12">
					<p>Credit Card Name: </p>
					<input type="text" placeholder="Name" name="creditCardName">
				</div>
			</div>
			<br>
			<div class="row">
				<div class="col-xs-12">
					<p>Credit Card Number: </p>
					<input type="text" placeholder="Number" name="creditCardNumber">
				</div>
			</div>
			<br>
			<div class="row">
				<div class="col-xs-4">
					<span>CVC: </span>
				</div>
				<div class="col-xs-6 col-xs-offset-2">
					<span>Expiration Date: </span>
				</div>
			</div>
			<br>
			<div class="row">
				<div class="col-xs-4">
					<input  type="text" placeholder="CVC" name="CVC">
				</div>
				<div class="col-xs-6 col-xs-offset-2">
					<input type="month" placeholder="MM/YY" name="expirationMonth">
				</div>
			</div>
			<br>
			<div class="row">
				<div class="col-xs-4 col-xs-offset-4">
					<button>Payment</button>
				</div>
			</div>
		</form>
	</div>
    {include file='common/footer.tpl'}
