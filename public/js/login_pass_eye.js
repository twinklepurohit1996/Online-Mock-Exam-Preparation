//User Login Password Input Eye
function togglePassword()
{
    $(".eye").toggleClass("fa-eye").toggleClass("fa-eye-slash");
    var input = $(".eye").parent().find("input");
     if(input.attr("type")=="password")
     {
         input.attr("type","text");
     }
     else
     {
         input.attr("type","password");
     }
}
