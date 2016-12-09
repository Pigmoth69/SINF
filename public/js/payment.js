var addressChosen;
var shipmentChosen;
var result = {};

function addressBox() {
    $('#addressBox').show();
    $('#shipmentBox').hide();
    $('#paymentBox').hide();
    $('#confirmationBox').hide();
}

function shipmentBox() {
    var isValid = true;//verifyAddress();

    if(isValid){
        $('#shipmentBox').show();
        $('#paymentBox').hide();
        $('#confirmationBox').hide();
        $('#addressBox').hide();
    }
    else{ 
        alert("Fill all address fields before proceeding!");
    }
}

function paymentBox() {
    var isValid = verifyAddress();
    var isValid = verifyShipment();

    if (isValid){
        $('#paymentBox').show();
        $('#confirmationBox').hide();
        $('#shipmentBox').hide();
        $('#addressBox').hide();
    }
    else
        alert("choose a shipment option");
}

function confirmationBox() {
    var isValid = verifyAddress();
    isValid = verifyShipment();

    if(isValid){
        $('#confirmationBox').show();
        $('#paymentBox').hide();
        $('#shipmentBox').hide();
        $('#addressBox').hide();
    }
    else{
        alert("fill all fields before proceeding!");
    }
}
 
function confirmPayment(){
    //console.log("********************confirmaPayment");
    result.Client = {};
    result.Client.Address = addressChosen;
    result.Client.ExpeditionWay = shipmentChosen;

    $.post("http://localhost:3000/payment/confirm", result, function (data1) {
        console.log(data1);
        if (data1 == 'success') {
            console.log("wow");
            //window.location.href = "/";
        }
        else {
            console.log("not wow");
            //window.location.href = "/erro";
        }
    }, 'json');
}

function verifyAddress(){
    var isValid = false;
    var checks = document.getElementsByName("address");
    for(var i = 0; i < checks.length; i++){
        if (checks[i].checked){
            isValid = true;
            addressChosen = checks[i].value;
        }
    } 
    return isValid;
}

function verifyShipment(){
    var isValid = true;
    if($('#shipmentOption').val() === ""){
        isValid = false;
    }
    /*for(var i = 0; i < checks.length; i++){
        if (checks[i].checked){ 
            isValid = true;
            shipmentChosen = checks[i].value;
            //$('#shipmentOptionConfirm').text("Shipment: " + checks[i].value);
        }
    }*/
    return isValid;
}

function verifyPayment(){
    var isValid = true;
    /*$('#paymentBox input').each(function(){
        if ($(this).val() === ''){
            isValid = false;
        }
    });*/
    return isValid;
}
