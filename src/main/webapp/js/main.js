// Default JavaScript/jQuery Page Functionality

$(function(){

    // Allow UI ToolTips
    $( document ).tooltip();
  
    // jQuery DOM +/- Toggle
    $(document).on("click", "#newStudent", function(){
        $("#newStudentForm").slideToggle();
        if($("#newStudentSign").hasClass("glyphicon-minus")) {
            $("#newStudentSign").removeClass("glyphicon-minus");
            $("#newStudentSign").addClass("glyphicon-plus")
        } else {
            $("#newStudentSign").removeClass("glyphicon-plus");
            $("#newStudentSign").addClass("glyphicon-minus")
        }
    });  
  
});
