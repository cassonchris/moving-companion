
function loadData() {

    // select the jQuery objects to work with
    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // get the user input
    var street = $('#street').val();
    var city = $('#city').val();
    var address = street + ', ' + city;
    
    // update the greeting
    $greeting.text('So, you want to live at ' + address + '?');
    
    // load the street view as the background
    var streetviewURL = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address;
    $body.append('<img class="bgimg" src="' + streetviewURL + '">');
    
    // create parameter object for nyt query
    var nytParameters = {
        q : city,
        sort : "newest",
        fl : "web_url,snippet,headline",
        apikey : "8521f06c7ebd4c3693837b75c8f767e4"
    };
    
    // request nyt articles
    $.getJSON("https://api.nytimes.com/svc/search/v2/articlesearch.json", nytParameters, function(data) {
        // update the header to include the city
        $nytHeaderElem.text("New York Times Articles About " + city);
        
        // append each article
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
    
    // set timeout for wikipedia request
    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text("Failed to get Wikipedia resources");
    }, 8000);
    
    // request wikipedia links
    $.ajax("https://en.wikipedia.org/w/api.php",
        {
            dataType : "jsonp",
            data : {
                format : "json",
                action : "opensearch",
                search : city
            },
            success : function(data, textStatus, jqXHR) {
                var articleList = data[1];
                var urlList = data[3];
                
                // append each article
                for (var i = 0; i < articleList.length; i++) {
                    $wikiElem.append(
                            "<li>" +
                                "<a href='" + urlList[i] + "'>" + articleList[i] + "</a>" +
                            "</li>"
                            );
                }
                
                // clear the wikipedia timeout
                clearTimeout(wikiRequestTimeout);
            }
        }
    );

    return false;
};

$('#form-container').submit(loadData);
