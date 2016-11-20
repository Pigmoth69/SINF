{include file='../templates/common/topbar.tpl'}
	<div class="container">
		<div class="row">
			<h1>Shopping Cart</h1>
		</div>
		<div class="row">
			<div class="col-xs-8">
				<div class="row cartRow">
					<div class="col-xs-3">
						<img class="productLogo" src="../res/product.png" alt="product image">
					</div>
					<div class="col-xs-5">
						<a href="http://google.pt"><h2 class="productName">Product 2</h2></a>
					</div>
					<div class="col-xs-2">
						<span class="productPrice">9.99€</span>
					</div>
					<div class="col-xs-2">
						<button class="removeFromCart">Remove</button>
					</div>
				</div>
				<div class="row cartRow">
					<div class="col-xs-3">
						<img class="productLogo" src="../res/product.png" alt="product image">
					</div>
					<div class="col-xs-5">
						<a href="http://google.pt"><h2 class="productName">Product 2</h2></a>
					</div>
					<div class="col-xs-2">
						<span class="productPrice">9.99€</span>
					</div>
					<div class="col-xs-2">
						<button class="removeFromCart">Remove</button>
					</div>
				</div>
			</div>
			<div class="col-xs-3 col-xs-offset-1 cartSummaryBox">
				<p id="cartSummaryTitle">Cart Summary</p>
				<p id="totalSummary">Total: <span id="cartValue">19.98€</span></p>
				<button id="checkoutButton" onclick="document.location='../pages/payment.php'">Proceed to checkout</button>
			</div>
		</div>
	</div>
    {include file='common/footer.tpl'}
