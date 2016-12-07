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
        if (j == 0) { //acrescentar a row inicial
            temp += "<div class='row'>";
            temp += "<div class='product col-xs-2'>";
            temp += "<div class='clickableProduct'>";
            temp += "<a href='/product/" + products[i].Code + "'>";
            temp += "<img src='/images/";
            temp += products[i].Imagem;
            temp += "' alt='product image' class='row'></a>";
            temp += "<div class='productInfo row'>";
            temp += "<div>";
            temp += "<span style='height:60px; overflow:hidden;' class='productName col-xs-8'>" + products[i].Description + "</span>";
            temp += "</div>";
            if (products[i].Discount > 0) { // tem desconto
                switch (products[i].typeUser) {
                    case 1:
                        temp += "<div class='col-xs-3'><h4>PROMOÇÃO: " + Math.round((products[i].Prices.PVP1 * (1 - products[i].disc * 0.01) * (1 - products[i].Discount * 0.01) * (1 - products[i].IVA * 0.01) * 100))/100 + "€</h4></div>";
                        break;
                    case 2:
                        temp += "<div class='col-xs-3'><h4>PROMOÇÃO: " + Math.round((products[i].Prices.PVP2 * (1 - products[i].disc * 0.01) * (1 - products[i].Discount * 0.01) * (1 - products[i].IVA * 0.01) * 100))/100 + "€</h4></div>";
                        break;
                    case 3:
                        temp += "<div class='col-xs-3'><h4>PROMOÇÃO: " + Math.round((products[i].Prices.PVP3 * (1 - products[i].disc * 0.01) * (1 - products[i].Discount * 0.01) * (1 - products[i].IVA * 0.01) * 100))/100 + "€</h4></div>";
                        break;
                    case 4:
                        temp += "<div class='col-xs-3'><h4>PROMOÇÃO: " + Math.round((products[i].Prices.PVP4 * (1 - products[i].disc * 0.01) * (1 - products[i].Discount * 0.01) * (1 - products[i].IVA * 0.01) * 100))/100 + "€</h4></div>";
                        break;
                    case 5:
                        temp += "<div class='col-xs-3'><h4>PROMOÇÃO: " + Math.round((products[i].Prices.PVP5 * (1 - products[i].disc * 0.01) * (1 - products[i].Discount * 0.01) * (1 - products[i].IVA * 0.01) * 100))/100 + "€</h4></div>";
                        break;
                    case 6:
                        temp += "<div class='col-xs-3'><h4>PROMOÇÃO: " + Math.round((products[i].Prices.PVP6 * (1 - products[i].disc * 0.01) * (1 - products[i].Discount * 0.01) * (1 - products[i].IVA * 0.01) * 100))/100 + "€</h4></div>";
                        break;
                    default:
                        temp += "<div class='col-xs-3'><h4>PROMOÇÃO: " + Math.round((products[i].Prices.PVP1 * (1 - products[i].disc * 0.01) * (1 - products[i].Discount * 0.01) * (1 - products[i].IVA * 0.01) * 100))/100 + "€</h4></div>";
                        break;
                }
            }
            else {
                switch (products[i].typeUser) {
                    case 1:
                        temp += "<div class='col-xs-3 col-xs-offset-1'><h3>" + Math.round((products[i].Prices.PVP1 * (1 - products[i].disc * 0.01) * (1 - products[i].IVA * 0.01))*100) / 100 + "€</h3></div>";
                        break;
                    case 2:
                        temp += "<div class='col-xs-3 col-xs-offset-1'><h3>" + Math.round((products[i].Prices.PVP2 * (1 - products[i].disc * 0.01) * (1 - products[i].IVA * 0.01))*100) / 100 + "€</h3></div>";
                        break;
                    case 3:
                        temp += "<div class='col-xs-3 col-xs-offset-1'><h3>" + Math.round((products[i].Prices.PVP3 * (1 - products[i].disc * 0.01) * (1 - products[i].IVA * 0.01)) * 100) / 100 + "€</h3></div>";
                        break;
                    case 4:
                        temp += "<div class='col-xs-3 col-xs-offset-1'><h3>" + Math.round((products[i].Prices.PVP4 * (1 - products[i].disc * 0.01) * (1 - products[i].IVA * 0.01)) * 100)/100 + "€</h3></div>";
                        break;
                    case 5:
                        temp += "<div class='col-xs-3 col-xs-offset-1'><h3>" + Math.round((products[i].Prices.PVP5 * (1 - products[i].disc * 0.01) * (1 - products[i].IVA * 0.01)) * 100)/100 + "€</h3></div>";
                        break;
                    case 6:
                        temp += "<div class='col-xs-3 col-xs-offset-1'><h3>" + Math.round((products[i].Prices.PVP6 * (1 - products[i].disc * 0.01) * (1 - products[i].IVA * 0.01)) * 100)/100 + "€</h3></div>";
                        break;
                    default:
                        temp += "<div class='col-xs-3 col-xs-offset-1'><h3>" + Math.round((products[i].Prices.PVP1 * (1 - products[i].disc * 0.01) * (1 - products[i].IVA * 0.01)) * 100)/100 + "€</h3></div>";
                        break;
                }
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
            if (products[i].Discount > 0) { // tem desconto
                switch (products[i].typeUser) {
                    case 1:
                        temp += "<div class='col-xs-3'><h4>PROMOÇÃO: " + Math.round((products[i].Prices.PVP1 * (1 - products[i].disc * 0.01) * (1 - products[i].Discount * 0.01) * (1 - products[i].IVA * 0.01) * 100))/100 + "€</h4></div>";
                        break;
                    case 2:
                        temp += "<div class='col-xs-3'><h4>PROMOÇÃO: " + Math.round((products[i].Prices.PVP2 * (1 - products[i].disc * 0.01) * (1 - products[i].Discount * 0.01) * (1 - products[i].IVA * 0.01) * 100))/100 + "€</h4></div>";
                        break;
                    case 3:
                        temp += "<div class='col-xs-3'><h4>PROMOÇÃO: " + Math.round((products[i].Prices.PVP3 * (1 - products[i].disc * 0.01) * (1 - products[i].Discount * 0.01) * (1 - products[i].IVA * 0.01) * 100))/100 + "€</h4></div>";
                        break;
                    case 4:
                        temp += "<div class='col-xs-3'><h4>PROMOÇÃO: " + Math.round((products[i].Prices.PVP4 * (1 - products[i].disc * 0.01) * (1 - products[i].Discount * 0.01) * (1 - products[i].IVA * 0.01) * 100))/100 + "€</h4></div>";
                        break;
                    case 5:
                        temp += "<div class='col-xs-3'><h4>PROMOÇÃO: " + Math.round((products[i].Prices.PVP5 * (1 - products[i].disc * 0.01) * (1 - products[i].Discount * 0.01) * (1 - products[i].IVA * 0.01) * 100))/100 + "€</h4></div>";
                        break;
                    case 6:
                        temp += "<div class='col-xs-3'><h4>PROMOÇÃO: " + Math.round((products[i].Prices.PVP6 * (1 - products[i].disc * 0.01) * (1 - products[i].Discount * 0.01) * (1 - products[i].IVA * 0.01) * 100))/100 + "€</h4></div>";
                        break;
                    default:
                        temp += "<div class='col-xs-3'><h4>PROMOÇÃO: " + Math.round((products[i].Prices.PVP1 * (1 - products[i].disc * 0.01) * (1 - products[i].Discount * 0.01) * (1 - products[i].IVA * 0.01) * 100))/100 + "€</h4></div>";
                        break;
                }
            }
            else {
                switch (products[i].typeUser) {
                    case 1:
                        temp += "<div class='col-xs-3 col-xs-offset-1'><h3>" + Math.round((products[i].Prices.PVP1 * (1 - products[i].disc * 0.01) * (1 - products[i].IVA * 0.01))*100) / 100 + "€</h3></div>";
                        break;
                    case 2:
                        temp += "<div class='col-xs-3 col-xs-offset-1'><h3>" + Math.round((products[i].Prices.PVP2 * (1 - products[i].disc * 0.01) * (1 - products[i].IVA * 0.01))*100) / 100 + "€</h3></div>";
                        break;
                    case 3:
                        temp += "<div class='col-xs-3 col-xs-offset-1'><h3>" + Math.round((products[i].Prices.PVP3 * (1 - products[i].disc * 0.01) * (1 - products[i].IVA * 0.01)) * 100) / 100 + "€</h3></div>";
                        break;
                    case 4:
                        temp += "<div class='col-xs-3 col-xs-offset-1'><h3>" + Math.round((products[i].Prices.PVP4 * (1 - products[i].disc * 0.01) * (1 - products[i].IVA * 0.01)) * 100)/100 + "€</h3></div>";
                        break;
                    case 5:
                        temp += "<div class='col-xs-3 col-xs-offset-1'><h3>" + Math.round((products[i].Prices.PVP5 * (1 - products[i].disc * 0.01) * (1 - products[i].IVA * 0.01)) * 100)/100 + "€</h3></div>";
                        break;
                    case 6:
                        temp += "<div class='col-xs-3 col-xs-offset-1'><h3>" + Math.round((products[i].Prices.PVP6 * (1 - products[i].disc * 0.01) * (1 - products[i].IVA * 0.01)) * 100)/100 + "€</h3></div>";
                        break;
                    default:
                        temp += "<div class='col-xs-3 col-xs-offset-1'><h3>" + Math.round((products[i].Prices.PVP1 * (1 - products[i].disc * 0.01) * (1 - products[i].IVA * 0.01)) * 100)/100 + "€</h3></div>";
                        break;
                }
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
        else { // caso normal
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
            console.log(products[i].disc);
            console.log(products[i].Discount);
            if (products[i].Discount > 0) { // tem desconto
                switch (products[i].typeUser) {
                    case 1:
                        temp += "<div class='col-xs-3'><h4>PROMOÇÃO: " + Math.round((products[i].Prices.PVP1 * (1 - products[i].disc * 0.01) * (1 - products[i].Discount * 0.01) * (1 - products[i].IVA * 0.01) * 100))/100 + "€</h4></div>";
                        break;
                    case 2:
                        temp += "<div class='col-xs-3'><h4>PROMOÇÃO: " + Math.round((products[i].Prices.PVP2 * (1 - products[i].disc * 0.01) * (1 - products[i].Discount * 0.01) * (1 - products[i].IVA * 0.01) * 100))/100 + "€</h4></div>";
                        break;
                    case 3:
                        temp += "<div class='col-xs-3'><h4>PROMOÇÃO: " + Math.round((products[i].Prices.PVP3 * (1 - products[i].disc * 0.01) * (1 - products[i].Discount * 0.01) * (1 - products[i].IVA * 0.01) * 100))/100 + "€</h4></div>";
                        break;
                    case 4:
                        temp += "<div class='col-xs-3'><h4>PROMOÇÃO: " + Math.round((products[i].Prices.PVP4 * (1 - products[i].disc * 0.01) * (1 - products[i].Discount * 0.01) * (1 - products[i].IVA * 0.01) * 100))/100 + "€</h4></div>";
                        break;
                    case 5:
                        temp += "<div class='col-xs-3'><h4>PROMOÇÃO: " + Math.round((products[i].Prices.PVP5 * (1 - products[i].disc * 0.01) * (1 - products[i].Discount * 0.01) * (1 - products[i].IVA * 0.01) * 100))/100 + "€</h4></div>";
                        break;
                    case 6:
                        temp += "<div class='col-xs-3'><h4>PROMOÇÃO: " + Math.round((products[i].Prices.PVP6 * (1 - products[i].disc * 0.01) * (1 - products[i].Discount * 0.01) * (1 - products[i].IVA * 0.01) * 100))/100 + "€</h4></div>";
                        break;
                    default:
                        temp += "<div class='col-xs-3'><h4>PROMOÇÃO: " + Math.round((products[i].Prices.PVP1 * (1 - products[i].disc * 0.01) * (1 - products[i].Discount * 0.01) * (1 - products[i].IVA * 0.01) * 100))/100 + "€</h4></div>";
                        break;
                }
            }
            else {
                switch (products[i].typeUser) {
                    case 1:
                        temp += "<div class='col-xs-3 col-xs-offset-1'><h3>" + Math.round((products[i].Prices.PVP1 * (1 - products[i].disc * 0.01) * (1 - products[i].IVA * 0.01))*100) / 100 + "€</h3></div>";
                        break;
                    case 2:
                        temp += "<div class='col-xs-3 col-xs-offset-1'><h3>" + Math.round((products[i].Prices.PVP2 * (1 - products[i].disc * 0.01) * (1 - products[i].IVA * 0.01))*100) / 100 + "€</h3></div>";
                        break;
                    case 3:
                        temp += "<div class='col-xs-3 col-xs-offset-1'><h3>" + Math.round((products[i].Prices.PVP3 * (1 - products[i].disc * 0.01) * (1 - products[i].IVA * 0.01)) * 100) / 100 + "€</h3></div>";
                        break;
                    case 4:
                        temp += "<div class='col-xs-3 col-xs-offset-1'><h3>" + Math.round((products[i].Prices.PVP4 * (1 - products[i].disc * 0.01) * (1 - products[i].IVA * 0.01)) * 100)/100 + "€</h3></div>";
                        break;
                    case 5:
                        temp += "<div class='col-xs-3 col-xs-offset-1'><h3>" + Math.round((products[i].Prices.PVP5 * (1 - products[i].disc * 0.01) * (1 - products[i].IVA * 0.01)) * 100)/100 + "€</h3></div>";
                        break;
                    case 6:
                        temp += "<div class='col-xs-3 col-xs-offset-1'><h3>" + Math.round((products[i].Prices.PVP6 * (1 - products[i].disc * 0.01) * (1 - products[i].IVA * 0.01)) * 100)/100 + "€</h3></div>";
                        break;
                    default:
                        temp += "<div class='col-xs-3 col-xs-offset-1'><h3>" + Math.round((products[i].Prices.PVP1 * (1 - products[i].disc * 0.01) * (1 - products[i].IVA * 0.01)) * 100)/100 + "€</h3></div>";
                        break;
                }
            }

            temp += "</div>";
            temp += "</div>";
            if (products[i].StkActual > 0)
                temp += "<button class='row carrinho' onclick=\"callProduct('" + products[i].Code + "');\">Add To Cart</button>";
            else temp += "<span class='row'>No Stock</span>";
            temp += "</div>";
        }
    }
    $("#products").append(temp);
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
    window.location.href = "/removeProductFromCart/" + idP + "/" + $('#'+idP).find(":selected").text();
}