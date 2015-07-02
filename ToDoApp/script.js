var obj = []

$(document).one('ready', function () {
  if(localStorage["task"]) {
    var task_arr = JSON.parse(localStorage["task"]);

    for(var i = 0; i < task_arr.length; i++) {
      $('.taskList').append('<li class="taskItem">' + task_arr[i] + '</li>');
    }
  }
});

$(document).ready(function(){
  $('ul.taskList').sortable({
    update: updateStorage
  });
  //localStorage.clear()

  $('input#submit').click(function(){
      var newTask = $('input[name=task]').val();
      $('input[name=task]').val("");

      if(newTask.trim()) {
        $('.taskList').append('<li class="taskItem">' + newTask + '</li>');
        obj.push(newTask);
        localStorage["task"] = JSON.stringify(obj);
      }
      return false;
  });

  $(document).on('dblclick', '.taskItem', function(){
      $(this).remove();
      updateStorage();
  });
});

var updateStorage = function() {
  console.log('update storage');
  obj = [];
  $("li").each(function() { obj.push($(this).text()) });
  localStorage["task"] = JSON.stringify(obj);
};
