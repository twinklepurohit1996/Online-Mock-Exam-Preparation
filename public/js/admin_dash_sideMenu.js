//Dashboard Side Bar menu
function fun()
{
    $("#btn").toggleClass('fa fa-bars').toggleClass('fa fa-times');
    $(".outter").toggleClass('ss').toggleClass('bb');
    $("#btn").toggleClass('btn1').toggleClass('btn2'); 
    $(".color").css("color","black").css("font-weight", "bold").css("line-height", "60px");
    $(".home").toggleClass('active');  
}

