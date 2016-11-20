function addressBox() {
    $('#addressBox').show();
    $('#shipmentBox').hide();
    $('#paymentBox').hide();
    $('#confirmationBox').hide();
}

function shipmentBox() {
    $('#shipmentBox').show();
    $('#paymentBox').hide();
    $('#confirmationBox').hide();
    $('#addressBox').hide();
}

function paymentBox() {
    $('#paymentBox').show();
    $('#confirmationBox').hide();
    $('#shipmentBox').hide();
    $('#addressBox').hide();
}

function confirmationBox() {
    $('#confirmationBox').show();
    $('#paymentBox').hide();
    $('#shipmentBox').hide();
    $('#addressBox').hide();
}
