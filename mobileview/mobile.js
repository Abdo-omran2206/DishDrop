let toggle = $("#toggle");

toggle.click(function (e) { 
    e.preventDefault();
    $(".nav").slideToggle("slow");
});
