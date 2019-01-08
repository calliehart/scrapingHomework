$.getJSON("/articles", function(data){

    for(var i=0; i<data.length; i++) {
        $("#articles").append("<p class='h3' data-id='" + data[i]._id + "'>" + data[i].title + "</p>" + data[i].summary + "<br /><a class='btn btn-info btn-block' href='" + data[i].link + "'>View Site</a><br />");
    }
});

$(document).on("click", "p", function(){
    $("#notes").empty();
    
    let thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    .then(function(data){
        console.log(data);

        $("#notes").append("<h2>" + data.title + "</h2>");

        $("#notes").append("<input id='titleinput' name='title' placeholder='Title' class='form-control'>");

        $("#notes").append("<textarea id='bodyinput' name='body' placeholder='Note...' class='form-control'></textarea><br />");
  
        $("#notes").append("<button class='btn btn-info' data-id='" + data._id + "' id='savenote'>Save Note</button>");

        if (data.note) {
            $("#titleinput").val(data.note.title);
       
            $("#bodyinput").val(data.note.body);
        }
    });
});


$(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      .then(function(data) {
       
        console.log(data);
    
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });