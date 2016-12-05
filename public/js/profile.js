$("#editClientNameButton").click(function () {
    $("#editClientName").toggle();
});

$("#editFiscalNameButton").click(function () {
    $("#editFiscalName").toggle();
});

$("#editEmailButton").click(function () {
    $("#editEmail").toggle();
});

$("#editPasswordButton").click(function () {
    $("#editPassword").toggle();
});

$("#editCountryButton").click(function () {
    $("#editCountry").toggle();
});

$("#editAddressButton").click(function () {
    $("#editAddress").toggle();
});

$("#editAddress2Button").click(function () {
    $("#editAddress2").toggle();
});

$("#editDistrictButton").click(function () {
    $("#editDistrict").toggle();
});

$("#editLocalButton").click(function () {
    $("#editLocal").toggle();
});

$("#editPostalCodeButton").click(function () {
    $("#editPostalCode").toggle();
});

$("#editPhoneButton").click(function () {
    $("#editPhone").toggle();
});

$("#editPhone2Button").click(function () {
    $("#editPhone2").toggle();
});

$("#editTaxpayNumberButton").click(function () {
    $("#editTaxpayNumber").toggle();
});

$("#editExpeditionWayButton").click(function () {
    $("#editExpeditionWay").toggle();
});

$("#editPaymentWayButton").click(function () {
    $("#editPaymentWay").toggle();
});

$("#editPaymentTypeButton").click(function () {
    $("#editPaymentType").toggle();
});

$("#editClientTypeButton").click(function () {
    $("#editClientType").toggle();
});

function editProfile() {
    var temp = {};
    temp.nameClient = $("#nameClient").val();
    temp.fiscalName = $("#fiscalName").val();
    temp.clientType = $("#clientType").val();
    temp.email = $("#email").val();
    temp.password = $("#password").val();
    temp.password2 = $("#newPassword").val();
    temp.country = $("#country").val();
    temp.address = $("#address").val();
    temp.address2 = $("#address2").val();
    temp.district = $("#district").val();
    temp.local = $("#local").val();
    temp.zipCode = $("#postalCode").val();
    temp.paymentType = $("#paymentType").val();
    temp.paymentWay = $("#paymentWay").val();
    temp.expeditionWay = $("#expeditionWay").val();
    temp.phone = $("#phone").val();
    temp.phone2 = $("#phone2").val();
    temp.taxpay = $("#taxpayNumber").val();
}