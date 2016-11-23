function changeToActiveWare(code) {
    var temp = "[id='Warehouse"+code+"']";
    if ($(temp).attr("class") == 'armazem active') {
        $(temp).removeClass("active");
    }
    else {
        $(".armazem.active").removeClass("active");
        $(temp).addClass("active");
    }

    // ver se há família ativa
    // se houver, redirecionar para warehouse/id/family/id
    // se não houver, redirecionar para warehouse/id
}

function changeToActiveFam(code) {
    var temp = "[id='Family"+code+"']";
    
    if ($(temp).attr("class") == 'familia active') {
        $(temp).removeClass("active");
    }
    else {
        $(".familia.active").removeClass("active");
        $(temp).addClass("active");
    }    

    // ver se há armazém ativo
    // se houver, redirecionar para warehouse/id/family/id
    // se não houver, redirecionar para family/id
}