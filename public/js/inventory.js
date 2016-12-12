function changeToActiveWare(code) {
    var temp = "[id='Warehouse" + code + "']";
    var temp1 = code + "";
    temp1.substr(9, code.length);

    var wasActive = false;
    var url;
    var url_db = "http://localhost:3000/database/products";


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
            console.log("1: " + url);
            $.blockUI();
            $.get(url, function (data) {
                $.get(url_db, function (data1) {
                    if (data1 == 'fuck')
                        addProductsWebPage(data, null);
                    else addProductsWebPage(data, data1);
                    $.unblockUI();
                });
            });
        }
        else { // quer chamar a família e o warehouse que acabou de ativar
            url = "http://localhost:3000/warehouse/" + temp1 + "/family/" + temp2;
            console.log("2: " + url);
            $.blockUI();
            $.get(url, function (data) {
                console.log(data);
                $.get(url_db, function (data1) {
                    if (data1 == 'fuck')
                        addProductsWebPage(data, null);
                    else addProductsWebPage(data, data1);
                    $.unblockUI();
                });
            });
        }
    }
    else { // quer chamar o warehouse só
        url = "http://localhost:3000/warehouse/" + temp1;
        console.log("3: " + url);
        $.blockUI();
        $.get(url, function (data) {
            $.get(url_db, function (data1) {
                if (data1 == 'fuck')
                    addProductsWebPage(data, null);
                else addProductsWebPage(data, data1);
                $.unblockUI();
            });
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
    var url_db = "http://localhost:3000/database/products";

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
            console.log("4: " + url);
            $.blockUI();
            $.get(url, function (data) {
                $.get(url_db, function (data1) {
                    if (data1 == 'fuck')
                        addProductsWebPage(data, null);
                    else addProductsWebPage(data, data1);
                    $.unblockUI();
                });
            });
        }
        else { // quer chamar warehouse e família
            url = "http://localhost:3000/warehouse/" + temp1 + "/family/" + code;
            console.log("5: " + url);
            $.blockUI();
            $.get(url, function (data) {
                $.get(url_db, function (data1) {
                    if (data1 == 'fuck')
                        addProductsWebPage(data, null);
                    else addProductsWebPage(data, data1);
                    $.unblockUI();
                });
            });
        }
    }
    else { // quer chamar só a família
        url = "http://localhost:3000/family/" + code;
        console.log("6: " + url);
        $.blockUI();
        $.get(url, function (data) {
            $.get(url_db, function (data1) {
                if (data1 == 'fuck')
                    addProductsWebPage(data, null);
                else addProductsWebPage(data, data1);
                $.unblockUI();
            });
        });
    }
}

function addProductsWebPage(products, imgs) {
    var j = 0;
    $("#products").remove();
    $("#home").append("<div id='products' class='col-xs-10'></div>");
    var temp = "";

    products = addImagesToProducts(products, imgs);
    for (var i = 0; i < products.length; i++ , j++) {

        var pvpsQueTavamNumSwitchDoKengas = [
            products[i].Prices.PVP1,
            products[i].Prices.PVP1,
            products[i].Prices.PVP2,
            products[i].Prices.PVP3,
            products[i].Prices.PVP4,
            products[i].Prices.PVP5,
            products[i].Prices.PVP6
        ];

        var utype = products[i].typeUser || 1;
        utype = parseInt(utype);
        console.log("desconto? " + products[i].Discount);
        var valor = calculaValor(pvpsQueTavamNumSwitchDoKengas[utype], products[i].disc, products[i].Discount, products[i].IVA);
        var valorSemDescontos = calculaValor(pvpsQueTavamNumSwitchDoKengas[utype], 0, 0, products[i].IVA);

        console.log("tipo de user = " + utype + " --- " + utype);
        console.log("PVP = " + pvpsQueTavamNumSwitchDoKengas[utype]);
        console.log("com Desconto = " + valor + " <---> Sem desconto = " + valorSemDescontos);

        if (j == 0) { //acrescentar a row inicial
            temp += "<div class='row'>";
            temp += "<div class='product col-xs-2'>";
            temp += "<div class='clickableProduct'>";
            temp += "<a href='/product/" + products[i].Code + "'>";
            temp += "<img src='/images/" + products[i].Imagem + "' alt='product image' class='row'>";
            temp += "</a>";
            temp += "<div class='productInfo row'>";
            temp += "<div>";
            temp += "<span style='height:60px; overflow:hidden;' class='productName col-xs-8'>" + products[i].Description + "</span>";
            temp += "</div>"; // tem desconto

            if (products[i].Discount > 0) {
                temp += "<div class='col-xs-3'><h5>PROMO: " + valor + "€</h5></div>";
                temp += "<div class='col-xs-3'><h5 style='text-decoration: line-through;'>" + valorSemDescontos + "€</h5></div>" //El switches;
            }
            else {
                temp += "<div class='col-xs-3 col-xs-offset-1'><h3>" + valorSemDescontos + " €</h3></div>";
            }

            temp += "</div>";
            temp += "</div>";
            if (products[i].StkActual > 0)
                temp += "<button class='row carrinho' onclick=\"callProduct('" + products[i].Code + "');\">Add To Cart</button>";
            else temp += "<span class='row'>No Stock</span>";
            temp += "</div>";
        }
        else if (j == 3) { // fechar a row inicial
            temp += "<div class='product col-xs-2 col-xs-offset-1'>";
            temp += "<div class='clickableProduct'>";
            temp += "<a href='/product/" + products[i].Code + "'>";
            temp += "<img src='/images/";
            temp += products[i].Imagem;
            temp += "' alt='product image' class='row'></a>";
            temp += "<div class='productInfo row'>";
            temp += "<div>";
            temp += "<span style='height:60px; overflow:hidden;' class='productName col-xs-8'>" + products[i].Description + "</span>";
            temp += "</div>";
            var temp1 = products[i].Prices.PVP1 + "";

            if (products[i].Discount > 0) {
                temp += "<div class='col-xs-3'><h5>PROMO: " + valor + "€</h5></div>";
                temp += "<div class='col-xs-3'><h5 style='text-decoration: line-through;'>" + valorSemDescontos + "€</h5></div>" //El switches;
            }
            else {
                temp += "<div class='col-xs-3 col-xs-offset-1'><h3>" + valorSemDescontos + " €</h3></div>";
            }

            temp += "</div>";
            temp += "</div>";
            if (products[i].StkActual > 0)
                temp += "<button class='row carrinho' onclick=\"callProduct('" + products[i].Code + "');\">Add To Cart</button>";
            else temp += "<span class='row'>No Stock</span>";
            temp += "</div>";
            temp += "</div>"; //fechar a row
            temp += "<br>";
            temp += "<br>";
            j = -1;
        }
        else { // caso normal //i'msohigh
            temp += "<div class='product col-xs-2 col-xs-offset-1'>";
            temp += "<div class='clickableProduct'>";
            temp += "<a href='/product/" + products[i].Code + "'>";
            temp += "<img src='/images/";
            temp += products[i].Imagem;
            temp += "' alt='product image' class='row'></a>";
            temp += "<div class='productInfo row'>";
            temp += "<div>"
            temp += "<span style='height:60px; overflow:hidden;'; class='productName col-xs-8'>" + products[i].Description + "</span>";
            temp += "</div>";
            var temp1 = products[i].Prices.PVP1 + "";

            if (products[i].Discount > 0) {
                temp += "<div class='col-xs-3'><h5>PROMO: " + valor + "€</h5></div>";
                temp += "<div class='col-xs-3'><h5 style='text-decoration: line-through;'>" + valorSemDescontos + "€</h5></div>" //El switches;
            }
            else {
                temp += "<div class='col-xs-3 col-xs-offset-1'><h3>" + valorSemDescontos + " €</h3></div>";
            }

            temp += "</div>";
            temp += "</div>";
            if (products[i].StkActual > 0)
                temp += "<button class='row carrinho' onclick=\"callProduct('" + products[i].Code + "');\">Add To Cart</button>";
            else temp += "<span class='row'>No Stock</span>";
            temp += "</div>";
        }
    }
    $("#products").append(temp); //viva a trolhiçe #oqueimportaequefuncione
}

function calculaValor(pvp, desc, discount, iva) {
    var res = 0;

    var desc = (1 - desc * 0.01);
    var disc = (1 - discount * 0.01);
    var iVA = (1 + iva * 0.01);
    if (discount > 0) {
        res = Math.round(pvp * desc * disc * iVA * 100) / 100;
    }
    else {
        res = Math.round(pvp * desc * iVA * 100) / 100;
    }
    return res;
}

function addImagesToProducts(products, images) {
    var temp = products;
    if (images != null) {
        for (var i = 0; i < temp.length; i++) {
            for (var j = 0; j < images.length; j++) {
                if (temp[i].Code == images[j].idProdutoPrimavera) {
                    temp[i].Imagem = images[j].imagem;
                    j = images.length;
                }
            }
        }
    }
    else {
        for (var i = 0; i < temp.length; i++) {
            temp[i].Imagem = 'product.png';
        }
    }
    return temp;
}

function searchProduct() {
    url = "http://localhost:3000/search/" + $("#search").val();
    console.log(url);

    $.blockUI();
    $.get(url, function (data) {
        addProductsWebPage(data);
        $.unblockUI();
    });
}

function callProduct(idP) {
    window.location.href = "/addProductToCart/" + idP;
}

function removeProduct(idP) {
    window.location.href = "/removeProductFromCart/" + idP + "/" + $('#' + idP).find(":selected").text();
}