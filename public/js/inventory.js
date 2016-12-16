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
    temp += '<div class="single-product-area">';
    temp += '<div class="zigzag-bottom">';
    temp += '</div><div class="container">';


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
        }

        temp += "<div class='col-md-3 col-sm-6'>";
        temp += "<div style='width:265px;height:285px;' class='single-shop-product'><div class='product-upper'>";
        temp += "<a href='/product/" + products[i].Code + "'>";
        temp += "<img src='/images/" + products[i].Imagem + "' alt='product image'>";
        temp += "</a></div>";
        temp += "<h2><a href='/product/" + products[i].Code + "'>" + products[i].Description + "</a></h2>";
        temp += '<div class="product-carousel-price">';

        if (products[i].Discount > 0) {
            temp += '<ins>' + valor + '€</ins> <del>' + valorSemDescontos + '</del></div>';
            //temp += "<h4 class='row promofield'>Promoção</h4><div class='row'><h5 class='promofield col-xs-7' >" + valor + "€</h5>";
            //temp += "<h4 class='col-xs-5 semdesconto' style='text-decoration: line-through;'>" + valorSemDescontos + "€</h4></div>" //El switches;
        }
        else {
            temp += '<ins>' + valor + '€</ins></div>';
            //temp += "<div class='col-xs-3 col-xs-offset-1'><h3>" + valorSemDescontos + " €</h3></div>";
        }

        temp += "</div>";
        temp += '<div class="product-option-shop">';

        if (products[i].StkActual > 0) {
            temp += "<a class='add_to_cart_button' data-quantity='1' data-product_sku='' data-product_id='70' rel='nofollow' onclick=\"callProduct('" + products[i].Code + "', 1);\">Add to cart</a>";
           //temp += "<button class='row carrinho' onclick=\"callProduct('" + products[i].Code + "');\">Add To Cart</button>";
        }
        else temp += "<a class='add_to_cart_button' data-quantity='1' data-product_sku='' data-product_id='70' rel='nofollow'>NO STOCK</a>";
        temp += "</div>";
        temp += "</div>";


        if (j == products.length - 1) { // fechar a row inicial
            temp += "</div>"; //fechar a row
        }
    }
    $("#products").append(temp); //viva a trolhiçe #oqueimportaequefuncione
}

function calculaValor(pvp, desc, discount, iva) {
    var res = 0;
    iva = iva + 0;

    var desc = (1 - desc * 0.01);
    var disc = (1 - discount * 0.01);
    var iVA = (1 + iva * 0.01);
    if (discount > 0) {
        res = Math.round(pvp * desc * disc * iVA * 100) / 100;
    }
    else {
        console.log(desc);
        if (typeof desc == 'NaN')
            res = Math.round(pvp * desc * iVA * 100) / 100;
        else res = Math.round(pvp * iVA * 100) / 100;
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
    var url = "http://localhost:3000/search/" + $("#search").val();
    var url_db = "http://localhost:3000/database/products";
    console.log(window.location.href);

    if (window.location.href != 'http://localhost:3000/')
        window.location.href = 'http://localhost:3000/searchOnOtherPage/' + $("#search").val();
    else {
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

function removeProduct(idP) {
    window.location.href = "/removeProductFromCart/" + idP + "/" + $('#' + idP).find(":selected").text();
}