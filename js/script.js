
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var $img = $('.bgimg');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");
    $img.remove();

    // load streetview
    var streetviewURL = "http://maps.googleapis.com/maps/api/streetview?";

    var $street = $("#street");
    var $city = $("#city");
    var address = $street.val() + ', ' + $city.val();

    $greeting.text('So, you want to live at ' + address + '?');
    var p = {
        "location": address,
        "size": "640x480",
        "sensor": false
    };

    var  bgImg = streetviewURL;

    for (var key in p) {
        bgImg += key + "=" + p[key] + "&";
    }

    $body.append('<img class="bgimg" src="'+ bgImg+'">');

    //load New York Times Article API
    var response_format = ".json";
    var nytart_fl = [
            "headline",
            "snippet",
            "keywords",
            "web_url"
    ]; 
    var sort = "newest";
    var nyt_source = "The New York Times";
    var api_key = "a064a541e3631cfee2e539a7c693bf7b:5:71831437";
    var nyt_artURL = "http://api.nytimes.com/svc/search/v2/articlesearch";
    var nyt_artSearch = [
        "q=" + $street.val(),
        "fq=" + [   'source:("' + nyt_source + '")',
                    'glocations:("' + $city.val() + '")'
                ].join(" AND "),
        "fl=" + nytart_fl.join(","),
        "sort=" + sort 
    ];

    var nyt_artrequest = nyt_artURL + response_format + 
        "?" + nyt_artSearch.join("&") + "&api-key=" + api_key;
        console.log(nyt_artrequest);

    $.getJSON(nyt_artrequest, function(data){
        console.log(data);

        var items = [];
        var docs = data.response.docs;
        if (docs.length != 0) {
            $.each( docs, function( key, val ) {
                var k = $.map(val.keywords, function (obj) {
                                return obj.value;
                            }).join(" ");

                items.push( "<dt class='article' id='headline_" + key + "'> <a id='link_" + key + "' href='" + val.web_url + "'> " + val.headline.main + " </a> </dt>" + 
                            "<dd id='dt_"+ key + "'>"+ val.snippet + "<br/>" +  
                            "<span id='keywords_" + key + "' class='keywords'>" + k + 
                            "</span>" + 
                            "</dd>"
                );

                $nytHeaderElem.text("New York Times Articles about " + address);
                $nytElem.append(items.join( "" ));
            });
        }else{
            $nytElem.append("<span>Sorry, we couldn't find anything about <b>" + address + "</b></span>");
        }

    }).fail(function (e) {
        // body...
        $nytElem.append("<span>Sorry, the search service is unvailable.There can be many reasons for that happened.<br/>" + 
        "Please check if your internet connection is one of them.</span>");
    });

    return false;
};

$('#form-container').submit(loadData);
