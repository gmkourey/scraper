var articles;

$.ajax({url: "/view", success: function(result) {

    for(var i = 0; i < result.length; i++) {
        var newDiv = $("<div class='article'>")
        
        var newHeadline = $("<h2 class='headline'>" + result[i].title + "</h2>");

        $(newDiv).append(newHeadline);

        var newImage = $("<img class='image' src='" + result[i].imageLink + "' />");

        $(newDiv).append(newImage);

        var newDesc = $("<h4 class='description'>" + result[i].desc + "</h4>")

        $(newDiv).append(newDesc);

        var newLink = $("<a class='btn btn-primary' target='_blank' href='" + result[i].link + "'>Link to Article</a>")

        $(newDiv).append(newLink);

        $(".articleContainer").append(newDiv);
    }

}
})