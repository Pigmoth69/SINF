$(document).ready(function () {
    $(function () {
        $("#ordersTable").tablesorter();
    });
});


function ordering(type) {
    var colorActive = 'rgb(255, 0, 0)';
    var colorInactive = 'rgb(0, 0, 0)';

    if (type == 0) {

        var up = $('#upData');
        var down = $('#downData');
        
        var upColor = up.css('color');        
        var downColor = down.css('color');
        if (upColor == colorActive) {
            selectArrow(1);
        }
        else {
            selectArrow(0);
        }
    } else if (type == 1) {
        var up = $('#upNum');
        var down = $('#downNum');
        var upColor = up.css('color');        
        var downColor = down.css('color');

        if (upColor == colorActive) {
            selectArrow(3);
        }
        else {
            selectArrow(2);
        }
    } else {
        var up = $('#upTotal');
        var down = $('#downTotal');
        var upColor = up.css('color');        
        var downColor = down.css('color');
        if (upColor == colorActive) {
            selectArrow(5);
        }
        else {
            selectArrow(4);
        }
    }
}

function selectArrow(id){
    //alert("cenas" + id);
    var colorActive = 'rgb(255, 0, 0)';
    var colorInactive = 'rgb(0, 0, 0)';
    var arrow = [
        $('#upData'), 
        $('#downData'),
        $('#upNum'),
        $('#downNum'),
        $('#upTotal'),
        $('#downTotal')
    ];
    
    for (var i = 0; i < arrow.length; i++){
        if(id == i){
            arrow[i].css('color', colorActive);
        }
        else
            arrow[i].css('color', colorInactive);
    }
}

function changePage(newPage) {


    $(".active").removeClass();



    $('#pag' + newPage).addClass("active");
} 