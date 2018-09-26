$(document).on("click", ".saveButton", function(event) {

    var id = $(this).attr("data-id");

    $.ajax("/articles/" + id, {
        type: "PUT",
        data: "true"
    }).then(function(response) {

    })

    location.reload();

});

$(document).on("click", ".commentButton", function(event) {

        $(".commentForm").css("display", "block");

});

$(document).on("click", "#submitComment", function(event) {

    event.preventDefault();

    var id = $(".submit").attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + id,
        data: {
          // Value taken from title input
          title: $("#noteTitle").val(),
          // Value taken from note textarea
          note: $("#noteBody").val()
        }
      })
        // With that done
        .then(function(data) {
          // Log the response
          console.log(data);
          // Empty the notes section
        //   $("#notes").empty();
        });
    
      // Also, remove the values entered in the input and textarea for note entry
      $("#noteTitle").val("");
      $("#noteBody").val("");

})