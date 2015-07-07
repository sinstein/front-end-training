$(".errors").hide();

$(document).ready(function(){
  $("#urlForm").hide();
  $.getJSON( "http://www.browserstack.com/list-of-browsers-and-platforms.json?product=live" ,
  function( data ) {
    var desktopBrowsers = data["desktop"];

    var os = $('<select required id="os" class="dropDownList"/>');
    var browserNames = $('<select required id="bNames" class="dropDownList"/>');
    var browserVersions = $('<select required id="bVersion" class="dropDownList"/>');

    $('<option />').appendTo(os);
    $.each( desktopBrowsers, function( key, val ) {
      $('<option />', {value: val["os_version"], text: val["os_display_name"], class: val["os"] }).appendTo(os);
    });
    os.insertBefore("#urlForm");

    $("#os").change(function(){
      var value = $('#os :selected').text();
      var osVersion = $('#os :selected').attr("value");
      var osFamily = $('#os :selected').attr("class");
      var browserList = [];

      browserNames.empty();
      browserVersions.empty();
      $.each(desktopBrowsers, function(key,val) {
        if(value == val["os_display_name"]) {
          browserList = createSortableList(this["browsers"]).sort();
          var length = browserList.length
          for (var i = 0; i < length; i++) {
            $('<option />', {value: browserList[i]["name"], text: browserList[i]["name"]}).appendTo(browserNames);
          }
          browserNames.insertAfter("#os");

          $("#bNames").change(function(){
            var value = $('#bNames :selected').text();
            var length = browserList.length;

            browserVersions.empty();
            for (var i = 0; i < length; i++) {
              if(browserList[i]["name"] == value) {
                var length2 = browserList[i]["versions"].length;
                browserList[i]["versions"].sort();
                //console.log(browserList[i]["versions"]);
                for(var j = 0; j < length2; j++) {
                  $('<option />', { value: browserList[i]["versions"][j], text: browserList[i]["versions"][j] }).appendTo(browserVersions);
                }
                break;
              }
            }
            browserVersions.insertAfter("#bNames");
            $("#urlForm").show();

            chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
               // since only one tab should be active and in the current window at once
               // the return variable should only have one entry
               var activeTabUrl = arrayOfTabs[0].url;
               console.log(activeTabUrl);
               $('input[name=urlToTest]').val(activeTabUrl);
            });

            $('input#submit').click(function(event){
              var newTask = $('input[name=urlToTest]').val();
              $('input[name=urlToTest]').val("");
              validRequestCheck(osFamily, osVersion, $('#bNames :selected').text(), $('#bNames :selected').text(), newTask.trim());
              event.preventDefault();
            });
          });
          return false;
        }
      });
    });
  }).done(function(){
      console.log("Done getting");
      $(".loading").remove();
    }).fail(function(){
      console.log("Failed :");
    });
});


var validRequestCheck = function(os, os_version, browser, browser_version, url) {
    if(os && os_version && browser && browser_version && url) {
      var test_address = "https://www.browserstack.com/start#"
                          + "&os=" + os
                          + "&os_version=" + os_version
                          + "&browser=" + browser
                          + "&browser_version=" + browser_version
                          + "&scale_to_fit=true"
                          + "&start=true"
                          + "&url=" + url;
      window.open(test_address);
    }
    else {
      $(".errors").show();
      setTimeout(function() { $(".errors").hide(); }, 3000);
    }
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
