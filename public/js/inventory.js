

function changeToActiveWare(code) {
    var temp = "[id='Warehouse"+code+"']";
    var url;
    if ($(temp).attr("class") == 'armazem active') {
        $(temp).removeClass("active");
    }
    else {
        $(".armazem.active").removeClass("active");
        $(temp).addClass("active");
    }

    // ver se há família ativa
    if ($(".familia.active").attr("id") != undefined) {
        // se houver, redirecionar para warehouse/id/family/id
        // fazer pedido ao node
        var temp = code + "";
        temp.substr(9, code.length);
        url = "http://localhost:3000/warehouse/" + temp + "/family/" + $(".familia.active").attr("id");
        $.get(url, function(data) {
          addProductsWebPage(data);
        });
    }
    else {
        // se não houver, redirecionar para warehouse/id
        url = "http://localhost:3000/warehouse/" + temp;
        $.get(url, function(data) {                
          //console.log(data);
          addProductsWebPage(data);
        });

    }

}

function changeToActiveFam(code) {
    var temp = "[id='Family"+code+"']";
    var url;

    if ($(temp).attr("class") == 'familia active') {
        $(temp).removeClass("active");
    }
    else {
        $(".familia.active").removeClass("active");
        $(temp).addClass("active");
    }    

    // ver se há armazém ativo
    if ($(".armazem.active").attr("id") != undefined) {
        // se houver, redirecionar para warehouse/id/family/id
        var temp = $(".armazem.active").attr("id") + "";
        temp = temp.substr(9, temp.length);
        url = "http://localhost:3000/warehouse/" + temp + "/family/" + code;
        $.get(url, function(data) {                
          addProductsWebPage(data);
        });
        
    }
    else {
        url = "http://localhost:3000/family/" + code;
        $.get(url, function(data) {                
          addProductsWebPage(data);
        });
    }
}

function addProductsWebPage(products) {
    var j = 0;
    $("#products").remove();
    $("#home").append("<div id='products' class='col-xs-10'></div>");
    var temp = "";
    for (var i = 0; i < products.length; i++,j++) {
        if (j == 0) { //acrescentar a row inicial
            temp += "<div class='row'>";
            temp += "<div class='product col-xs-2'>";
            temp += "<div class='clickableProduct'>";
            temp += "<a href='/product/" + products[i].Code + "'>";
            temp += "<img src='/images/product.png' alt='product image' class='row'></a>";
            temp += "<div class='productInfo row'>";
            temp += "<span class='productName col-xs-8'>"+products[i].Description+"</span>";
            var temp1 = products[i].Prices.PVP1 + "";
            temp += "<span class='col-xs-3 col-xs-offset-1'>" + temp1 +"€</span>";

            temp += "</div>";
            temp += "</div>";
            temp += "<button class='row'>Add To Cart</button>";
            temp += "</div>";
        }
        else if (j == 3) { // fechar a row inicial
            temp += "<div class='product col-xs-2 col-xs-offset-1'>";
            temp += "<div class='clickableProduct'";
            temp += "<a href='/product/" + products[i].Code + "'>";
            temp += "<img src='/images/product.png' alt='product image' class='row'></a>";
            temp += "<div class='productInfo row'>";
            temp += "<span class='productName col-xs-8'>"+products[i].Description+"</span>";
            var temp1 = products[i].Prices.PVP1 + "";
            temp += "<span class='col-xs-3 col-xs-offset-1'>" + temp1 +"€</span>";

            temp += "</div>";
            temp += "</div>";
            temp += "<button class='row'>Add To Cart</button>";
            temp += "</div>";
            temp += "</div>"; //fechar a row
            j = -1;
        }
        else { // caso normal
            temp += "<div class='product col-xs-2 col-xs-offset-1'>";
            temp += "<div class='clickableProduct'";
            temp += "<a href='/product/" + products[i].Code + "'>";
            temp += "<img src='/images/product.png' alt='product image' class='row'></a>";
            temp += "<div class='productInfo row'>";
            temp += "<span class='productName col-xs-8'>"+products[i].Description+"</span>";
            var temp1 = products[i].Prices.PVP1 + "";
            temp += "<span class='col-xs-3 col-xs-offset-1'>" + temp1 +"€</span>";

            temp += "</div>";
            temp += "</div>";
            temp += "<button class='row'>Add To Cart</button>";
            temp += "</div>";
        }
    }
    $("#products").append(temp);
}