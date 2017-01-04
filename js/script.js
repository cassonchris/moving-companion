
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var street = $('#street').val();
    var city = $('#city').val();
    var address = street + ', ' + city;
    
    $greeting.text('So, you want to live at ' + address + '?');
    
    var streetviewURL = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address;
    $body.append('<img class="bgimg" src="' + streetviewURL + '">');
    
    var nytParameters = {
        "q" : city,
        "sort" : "newest",
        "fl" : "web_url,snippet,headline",
        "api-key" : "8521f06c7ebd4c3693837b75c8f767e4"
    };
    
    $.getJSON("https://api.nytimes.com/svc/search/v2/articlesearch.json", nytParameters, function(data) {
        $nytHeaderElem.text("New York Times Articles About " + city);
        
        $.each(data.response.docs, function(key, doc) {
            $nytElem.append(
                    "<li class='article'>" + 
                        "<a href='" + doc.web_url + "'>" + doc.headline.main + "</a>" + 
                        "<p>" + doc.snippet + "</p>" + 
                    "</li>"
                    );
        });
    }).fail(function() {
        $nytHeaderElem.text("New York Times Articles Could Not Be Loaded");
    });

    return false;
};

$('#form-container').submit(loadData);
