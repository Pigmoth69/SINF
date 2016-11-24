

function changeToActiveWare(code) {
    var temp = "[id='Warehouse" + code + "']";
    var temp1 = code + "";
    temp1.substr(9, code.length);

    var wasActive = false;
    var url;

    if ($(temp).attr("class") == 'armazem active') {
        $(temp).removeClass("active");
        wasActive = true;
    }
    else {
        $(".armazem.active").removeClass("active");
        $(temp).addClass("active");
    }

    // ver se há família ativa
    if ($(".familia.active").attr("id") != undefined) {
        var temp2 = $(".familia.active").attr("id");
        temp2 = temp2.substr(6, temp2.length);
        if (wasActive) { //quer chamar só a família    
            url = "http://localhost:3000/family/" + temp2;
            console.log(url);
            $.blockUI();
            $.get(url, function (data) {
                addProductsWebPage(data);
                $.unblockUI();
            });
        }
        else { // quer chamar a família e o warehouse que acabou de ativar
            url = "http://localhost:3000/warehouse/" + temp1 + "/family/" + temp2;
            console.log(url);
            $.blockUI();
            $.get(url, function (data) {
                addProductsWebPage(data);
                $.unblockUI();
            });
        }
    }
    else { // quer chamar o warehouse só
        url = "http://localhost:3000/warehouse/" + temp1;
        console.log(url);
        $.blockUI();
        $.get(url, function (data) {
            addProductsWebPage(data);
            $.unblockUI();
        });
    }
}

function changeToActiveFam(code) {
    var temp = "[id='Family" + code + "']";
    var temp1 = $(".armazem.active").attr("id") + "";
    temp1 = temp1.substr(9, temp1.length);

    var temp2 = code.substr(5, code.length);

    

    var wasActive = false;
    var url;

    if ($(temp).attr("class") == 'familia active') {
        $(temp).removeClass("active");
        wasActive = true;
    }
    else {
        $(".familia.active").removeClass("active");
        $(temp).addClass("active");
    }

    // ver se há armazém ativo
    if ($(".armazem.active").attr("id") != undefined) {
        if (wasActive) { // quer chamar só o warehouse
            url = "http://localhost:3000/warehouse/" + temp1;
            console.log(url);
            $.blockUI();
            $.get(url, function (data) {
                addProductsWebPage(data);
                $.unblockUI();
            });
        }
        else { // quer chamar warehouse e família
            url = "http://localhost:3000/warehouse/" + temp1 + "/family/" + code;
            console.log(url);
            $.blockUI();
            $.get(url, function (data) {
                addProductsWebPage(data);
                $.unblockUI();
            });
        }
    }
    else { // quer chamar só a família
        url = "http://localhost:3000/family/" + code;
        console.log(url);
        $.blockUI();
        $.get(url, function (data) {
            addProductsWebPage(data);
            $.unblockUI();
        });
    }
}

function addProductsWebPage(products) {
    var j = 0;
    $("#products").remove();
    $("#home").append("<div id='products' class='col-xs-10'></div>");
    var temp = "";
    for (var i = 0; i < products.length; i++ , j++) {
        if (j == 0) { //acrescentar a row inicial
            temp += "<div class='row'>";
            temp += "<div class='product col-xs-2'>";
            temp += "<div class='clickableProduct'>";
            temp += "<a href='/product/" + products[i].Code + "'>";
            temp += "<img src='/images/product.png' alt='product image' class='row'></a>";
            temp += "<div class='productInfo row'>";
            temp += "<div>";
            temp += "<span style='height:60px; overflow:hidden;' class='productName col-xs-8'>" + products[i].Description + "</span>";
            temp += "</div>";
            var temp1 = products[i].Prices.PVP1 + "";
            if (products[i].Discount > 0) { // tem desconto 
                temp += "<div class='col-xs-3'><h4>PROMOÇÃO: " + (products[i].Prices.PVP1 * products[i].Discount) + "€</h4></div>";
            }
            else temp += "<div class='col-xs-3 col-xs-offset-1'><h3>" + temp1 + "€</h3></div>";

            temp += "</div>";
            temp += "</div>";
            temp += "<button class='row'>Add To Cart</button>";
            temp += "</div>";
        }
        else if (j == 3) { // fechar a row inicial
            temp += "<div class='product col-xs-2 col-xs-offset-1'>";
            temp += "<div class='clickableProduct'>";
            temp += "<a href='/product/" + products[i].Code + "'>";
            temp += "<img src='/images/product.png' alt='product image' class='row'></a>";
            temp += "<div class='productInfo row'>";
            temp += "<div>";
            temp += "<span style='height:60px; overflow:hidden;' class='productName col-xs-8'>" + products[i].Description + "</span>";
            temp += "</div>";
            var temp1 = products[i].Prices.PVP1 + "";
            if (products[i].Discount > 0) { // tem desconto 
                temp += "<div class='col-xs-3'><h4>PROMOÇÃO: " + (products[i].Prices.PVP1 * products[i].Discount) + "€</h4></div>";
            }
            else temp += "<div class='col-xs-3 col-xs-offset-1'><h3>" + temp1 + "€</h3></div>";

            temp += "</div>";
            temp += "</div>";
            temp += "<button class='row'>Add To Cart</button>";
            temp += "</div>";
            temp += "</div>"; //fechar a row
            temp += "<br>";
            temp += "<br>";
            j = -1;
        }
        else { // caso normal
            temp += "<div class='product col-xs-2 col-xs-offset-1'>";
            temp += "<div class='clickableProduct'>";
            temp += "<a href='/product/" + products[i].Code + "'>";
            temp += "<img src='/images/product.png' alt='product image' class='row'></a>";
            temp += "<div class='productInfo row'>";
            temp += "<div>"
            temp += "<span style='height:60px; overflow:hidden;'; class='productName col-xs-8'>" + products[i].Description + "</span>";
            temp += "</div>";
            var temp1 = products[i].Prices.PVP1 + "";
            if (products[i].Discount > 0) { // tem desconto 
                temp += "<div class='col-xs-3'><h4>PROMOÇÃO: " + (products[i].Prices.PVP1 * products[i].Discount) + "€</h4></div>";
            }
            else temp += "<div class='col-xs-3 col-xs-offset-1'><h3>" + temp1 + "€</h3></div>";

            temp += "</div>";
            temp += "</div>";
            temp += "<button class='row'>Add To Cart</button>";
            temp += "</div>";
        }
    }
    $("#products").append(temp);
}