$(".option_errors").hide();
$(".url_errors").hide();

$(document).ready(function(){
  $("#urlForm").hide();
  /*
  Fetch data from BrowserStack RESP API (http://www.browserstack.com/list-of-browsers-and-platforms.json?product=live)
  Concerned with only Desktop Browsers
  */
  $.getJSON( "http://www.browserstack.com/list-of-browsers-and-platforms.json?product=live" ,
  function( data ) {
    var desktopBrowsers = data["desktop"];

    var os = $('<select required id="os" class="dropDownList"/>');
    var browserNames = $('<select required id="bNames" class="dropDownList"/>');
    var browserVersions = $('<select required id="bVersion" class="dropDownList"/>');

    /*
    Preparing list of available Desktop OS
    */
    $('<option/>', { disabled: "disabled" , text: "Select OS" }).appendTo(os);
    $.each( desktopBrowsers, function( key, val ) {
      $('<option />', {value: val["os_version"], text: val["os_display_name"], class: val["os"] }).appendTo(os);
    });
    os.insertBefore("#urlForm");

    $("#os").change(function(){
      var value = $('#os :selected').text();
      var osVersion = $('#os :selected').attr("value");
      var osFamily = $('#os :selected').attr("class");
      var browserList = [];

      browserVersions.empty();
      /*
      Preparing list of compatible browsers
      */
      browserNames.empty();
      $('<option/>', { disabled: "disabled" , text: "Select Browser" }).appendTo(browserNames);
      $.each(desktopBrowsers, function(key,val) {
        if(value == val["os_display_name"]) {
          browserList = createSortableList(this["browsers"]);
          var length = browserList.length
          for (var i = 0; i < length; i++) {
            $('<option />', {value: browserList[i]["name"], text: browserList[i]["name"]}).appendTo(browserNames);
          }
          browserNames.insertAfter("#os");

          var browserName = $('#bNames :selected').text();
          var length = browserList.length;

          /*
          Preparing list of browser versions
          If the OS is changed midway, browser versions must be updated
          */
          browserVersions.empty();
          $('<option/>', { disabled: "disabled" , text: "Select Version" }).appendTo(browserVersions);
          for (var i = 0; i < length; i++) {
            if(browserList[i]["name"] == browserName) {
              var length2 = browserList[i]["versions"].length;
              browserList[i]["versions"].sort().reverse();
              //console.log(browserList[i]["versions"]);
              for(var j = 0; j < length2; j++) {
                $('<option />', { value: browserList[i]["versions"][j], text: browserList[i]["versions"][j] }).appendTo(browserVersions);
              }
              break;
            }
          }
          browserVersions.insertAfter("#bNames");

          /*
          Changing browser selection must trigger update of versions
          */
          $("#bNames").change(function(){
            var browserName = $('#bNames :selected').text();
            var length = browserList.length;

            browserVersions.empty();
            $('<option/>', { disabled: "disabled" , text: "Select Version" }).appendTo(browserVersions);
            for (var i = 0; i < length; i++) {
              if(browserList[i]["name"] == browserName) {
                var length2 = browserList[i]["versions"].length;
                browserList[i]["versions"].sort().reverse();
                //console.log(browserList[i]["versions"]);
                for(var j = 0; j < length2; j++) {
                  $('<option />', { value: browserList[i]["versions"][j], text: browserList[i]["versions"][j] }).appendTo(browserVersions);
                }
                break;
              }
            }
            browserVersions.insertAfter("#bNames");
          });

          $("#urlForm").show();

          /*
          Get the url of current tab
          */
          chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
             var activeTabUrl = arrayOfTabs[0].url;
             console.log(activeTabUrl);
             $('input[name=urlToTest]').val(activeTabUrl);
          });

          /*
          Handling user submit/click
          */
          $('input#submit').click(function(event){
            var newTask = $('input[name=urlToTest]').val();
            $('input[name=urlToTest]').val("");
            validRequestCheck(osFamily, osVersion, $('#bNames :selected').text(), $('#bVersion :selected').text(), newTask.trim());
            event.preventDefault();
          });
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


/*
Runs BrowserStack LIVE session if a valid request is made
Checks for url validity if all options are selected
*/
var validRequestCheck = function(os, os_version, browser, browser_version, url) {

    if(os && os_version && browser && browser_version && url) {
      if(isUrlValid(url)) {
        var test_address = "https://www.browserstack.com/start#"
                            + "&os=" + os
                            + "&os_version=" + os_version
                            + "&browser=" + browser
                            + "&browser_version=" + browser_version
                            + "&scale_to_fit=true"
                            + "&start=true"
                            + "&url=" + url;
        window.open(test_address, '', 'fullscreen = yes');
      }
    }
    else {
      $(".option_errors").show();
      setTimeout(function() { $(".option_errors").hide(); }, 3000);
    }
}

/*
Creates list of browsers for chosen OS
Sorted to display same order everytime
*/
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
  return browserList.sort().reverse()
}

var isUrlValid = function(url) {
    if(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(url)) {
      return true
    }
    else {
      $(".url_errors").show();
      setTimeout(function() { $(".url_errors").hide(); }, 3000);
    }
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
