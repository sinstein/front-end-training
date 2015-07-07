$(document).ready(function(){
  $("input[name=urlToTest]").addClass("hide_elem");
  $(".ajaxButton").click(function(event){
    console.log("inside click");

    //getJson method
    $.getJSON( "http://www.browserstack.com/list-of-browsers-and-platforms.json?product=live" ,
    function( data ) {
      var desktopBrowsers = data["desktop"]

      var os = $('<select id="os"/>');
      var browserNames = $('<select id="bNames"/>');
      var browserVersions = $('<select id="bVersion"/>');

      $.each( desktopBrowsers, function( key, val ) {
        $('<option />', {value: val["os_display_name"], text: val["os_display_name"], class: val["os"] }).appendTo(os);
      });
      os.appendTo("body");

      $("#os").change(function(){
        var value = $('#os :selected').text();
        var osFamily = $('#os :selected').attr("class");
        var browserList = [];

        browserNames.empty();
        $.each(desktopBrowsers, function(key,val) {
          if(value == val["os_display_name"]) {
            browserList = createSortableList(this["browsers"]);
            console.log(browserList);
            var length = browserList.length
            for (var i = 0; i < length; i++) {
              $('<option />', {value: browserList[i]["name"], text: browserList[i]["name"]}).appendTo(browserNames);
            }
            browserNames.appendTo("body");

            $("#bNames").change(function(){
              var value = $('#bNames :selected').text();
              var length = browserList.length;

              browserVersions.empty();
              for (var i = 0; i < length; i++) {
                if(browserList[i]["name"] == value) {
                  var length2 = browserList[i]["versions"].length;
                  browserList[i]["versions"].sort();
                  console.log(browserList[i]["versions"]);
                  for(var j = 0; j < length2; j++) {
                    $('<option />', { value: browserList[i]["versions"][j], text: browserList[i]["versions"][j] }).appendTo(browserVersions);
                  }
                  break;
                }
              }
              browserVersions.appendTo("body");

              $()

            });
            return false;
          }
        });
      });

    }).done(function(){
      console.log("Done getting");

    }).fail(function(){
      console.log("Failed :");
    });
  });
});

var getVersions = function(listOfBrowsers, chosenBrowser) {

}

var createSortableList = function(compatibleBrowsers) {
  var browserList = [];
  $.each(compatibleBrowsers, function(key, val) {
    browserIndex = contains(browserList,val["browser"])

    if(browserIndex >= 0) {
      var temp =  browserList[browserIndex]["versions"]
      temp.push(val["browser_version"]);
      browserList[browserIndex]["versions"] = temp;
    }
    else {
      var temp = {};
      temp["name"] = val["browser"];
      temp["versions"] = [val["browser_version"]];
      browserList.push(temp);
    }
  });
  return browserList
}


var contains = function(array_name, value) {
  var length = array_name.length;
  for (var index = 0; index < length; index++) {
    if(array_name[index]["name"] == value){
      return index;
    }
  }
  return -1;
}
