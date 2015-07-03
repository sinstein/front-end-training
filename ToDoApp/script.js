var obj = []
var rendered_list = []

$(document).ready(function(){
  //localStorage.clear()
  if(localStorage["task"]) {
    obj = JSON.parse(localStorage["task"])
    //console.log(obj)
    dumpStorage();
  }

  $('ul.taskList').sortable({
    create: function(event, ui) {
      rendered_list = renderedList();
    },
    start: function(event, ui) {
      alertOnChange();
    },
    update: function(event, ui) {
      rendered_list = renderedList();
      updateStorage();
    }
  });

  $('input#submit').click(function(event){
      var newTask = $('input[name=task]').val();
      $('input[name=task]').val("");
      newTask = removeTags(newTask);
      //console.log(newTask);

      if(newTask.trim()) {
        obj = JSON.parse(localStorage["task"]);
        obj.push(newTask);
        localStorage["task"] = JSON.stringify(obj);
        dumpStorage();
      }
      event.preventDefault();
  });

  $(document).on('dblclick', '.taskItem', function(){
    alertOnChange();
    $(this).wrap("<strike>");
    $(this).animate({ opacity: 0.1 }, 150, function(){
      $(this).remove();
      updateStorage();
      obj = JSON.parse(localStorage["task"])
      rendered_list = renderedList();
    });
  });
});


var removeTags = function(string) {
  //console.log(string)
  return string.replace(/<[^>]*>/g, ' ')
               .replace(/\s{2,}/g, ' ')
               .trim();
}

var dumpStorage = function() {
  //console.log('dump storage');
  $("ul").empty();
  rendered_list = [];
  var task_arr = JSON.parse(localStorage["task"]);
  for(var i = 0; i < task_arr.length; i++) {
    //console.log($('<li/>', {'class': 'taskList'}).append(task_arr[i]).text());
    $('.taskList').append('<li class="taskItem">' + task_arr[i] + '</li>');
    rendered_list.push(task_arr[i]);
  }
}

var updateStorage = function() {
  obj = [];
  $("li").each(function() { obj.push($(this).text()) });
  localStorage["task"] = JSON.stringify(obj);
};

var renderedList = function() {
  new_list = []
  $("li").each(function() { new_list.push($(this).text()) });
  return new_list
}

var alertOnChange = function() {
  obj = JSON.parse(localStorage["task"])
  if (!obj.equals(rendered_list)) {
    alert("List has been modified!")
    //refreshing page to restart javscript
    location.reload();
    //dumpStorage();
  }
}

Array.prototype.equals = function (array) {
    if (!array) {
        return false;
    }
    if (this.length != array.length) {
        return false;
    }
    for (var i = 0, l = this.length; i < l; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            return false;
        }
    }
    return true;
}
