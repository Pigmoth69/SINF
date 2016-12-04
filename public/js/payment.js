function addressBox() {
    $('#addressBox').show();
    $('#shipmentBox').hide();
    $('#paymentBox').hide();
    $('#confirmationBox').hide();
}

function shipmentBox() {
    var isValid = verifyAddress();

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
    var isValid = verifyPayment();

    if(isValid){
        $('#confirmationBox').show();
        $('#paymentBox').hide();
        $('#shipmentBox').hide();
        $('#addressBox').hide();
    }
    else{
        alert("fill all payment fields before proceeding!");
    }
}

function verifyAddress(){
    var isValid = true;
    $('#addressBox input[type="text"]').each(function(){
        if ($(this).val() === ''){
            isValid = false;
        }
    });
    if( $('#country').val() === '') {
        isValid = false; 
    }
    return isValid;
}

function verifyShipment(){
    var isValid = false;
    var checks = document.getElementsByName("ship");
    for(var i = 0; i < checks.length; i++){
        if (checks[i].checked){
            isValid = true;
            //alert(checks[i].value);
            $('#shipmentOptionConfirm').text("Shipment: " + checks[i].value + ": " );
        }
    }
    return isValid;
}

function verifyPayment(){
    var isValid = true;
    $('#paymentBox input').each(function(){
        if ($(this).val() === ''){
            isValid = false;
        }
    });
    return isValid;
}
