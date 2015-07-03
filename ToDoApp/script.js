var obj = []

$(document).ready(function(){
  $('ul.taskList').sortable({
    update: updateStorage
  });
  //localStorage.clear()
  if(localStorage["task"]) {
    dumpStorage();
  }

  $('input#submit').click(function(){
      var newTask = $('input[name=task]').val();
      $('input[name=task]').val("");
      newTask = removeTags(newTask);
      console.log(newTask);

      if(newTask.trim()) {
        obj = JSON.parse(localStorage["task"]);
        obj.push(newTask);
        localStorage["task"] = JSON.stringify(obj);
        dumpStorage();
      }
      return false;
  });

  $(document).on('dblclick', '.taskItem', function(){
      $(this).remove();
      updateStorage();
  });
});


var removeTags = function(string) {
  //console.log(string)
  return string.replace(/<[^>]*>/g, ' ')
               .replace(/\s{2,}/g, ' ')
               .trim();
}

var dumpStorage = function() {
  console.log('dump storage');
  $("ul").empty();
  var task_arr = JSON.parse(localStorage["task"]);
  for(var i = 0; i < task_arr.length; i++) {
    $('.taskList').append('<li class="taskItem">' + task_arr[i] + '</li>');
  }
}

var updateStorage = function() {
  obj = [];
  $("li").each(function() { obj.push($(this).text()) });
  localStorage["task"] = JSON.stringify(obj);
};
