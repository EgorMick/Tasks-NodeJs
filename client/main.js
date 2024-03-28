window.onload = async function() {
    
    var addButton = document.querySelector('#add-form button');
    var taskInput = document.querySelector('#taskInput');
    var goOnTasks = document.querySelector('#goOnList .tasks');
    var completeTasks = document.querySelector('#completeList .tasks');
    var deleteTasks = document.querySelector('#deleteList .tasks');

    // МЕТОД ДОБАВЛЕНИЯ ЗАДАЧИ
    function handleAddTask() {
        var taskText = taskInput.value;
    
        if (taskText.trim() !== '') {
            var taskElement = document.createElement('div');
            taskElement.classList.add('taskGoOn');
            taskElement.textContent = taskText;
    
            taskElement.addEventListener('click', function() {
                taskElement.classList.toggle('selected'); // ВЫДЕЛЯЕМ ЗАДАЧУ
            });
    
            goOnTasks.appendChild(taskElement);
            taskInput.value = '';
    
            // СОХРАНЯЕМ ЗАДАЧУ В БДД
            saveTaskToDB(taskText);
        }
    }
    // ДОБАВЛЕНИЕ ЗАДАЧИ ПО КЛИКУ ПО КНОПКЕ
    addButton.addEventListener('click', handleAddTask);
    
    // ВЫПОЛНЕНИЕ ЗАДАЧИ ПО НАЖАТИЮ
    document.addEventListener('keydown', function(event) {
        if (event.keyCode === 13) { // НАЖАТИЕ ПО ENTER
            handleAddTask();    
        }
    });

    // ФУНКЦИЯ СОХРАНЕНИЯ ЗАДАЧИ В БД 
    function saveTaskToDB(taskText) {
        var data = { description: taskText, status: 'В процессе' };
    
        fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json()) 
    }

    // ДОБАВЛЕНИЕ ЗАДАЧ В СООТВЕТСТВУЮЩИЕ РАЗДЕЛЫ
    document.querySelector('.buttonLoad').addEventListener('click', async function() {
        
            const response = await fetch('http://localhost:3000/tasks');
            const tasks = await response.json();
            tasks.forEach(function(task) {
                var taskElement = document.createElement('div');
                taskElement.classList.add('taskGoOn');
                taskElement.textContent = task.description;
                
                taskElement.addEventListener('click', function() {
                    taskElement.classList.toggle('selected');
                });
                
                // ЕСЛИ СТАТУС В ПРОЦЕССЕ
                if (task.status==="В процессе") {
                    goOnTasks.appendChild(taskElement);
                } 
                else if (task.status=== "Готово") {  //ЕСЛИ СТАТУС ГОТОВО
                    taskElement.classList.remove('taskGoOn');
                    taskElement.classList.add('taskComplete');
                    completeTasks.appendChild(taskElement);
                } 
                else if(task.status=== "Корзина"){ // СТАТУС КОРЗИНА
                    taskElement.classList.remove('taskGoOn');
                    taskElement.classList.add('taskDelete');
                    deleteTasks.appendChild(taskElement);
                }
            });
    });

    // ИЗМЕНЕНИЕ СТАТУСА ЗАДАЧИ
    function sendStatusToServer(taskElement, status) {
        var taskName = taskElement.textContent;
        var data = { name: taskName, status: status };
        
        fetch('http://localhost:3000/updateTaskStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
    }

    // ОБРАБОТЧИК СОБЫТИЯ ПРИ НАЖАТИЯ НА КНОПКУ ВЫПОЛНЕННО
    document.querySelector('.buttonSave').addEventListener('click', function() {
        // ВСЕ ВЫДЕЛЕННЫЕ ЗАДАЧИ В СПИСКЕ
        document.querySelectorAll('.taskGoOn.selected').forEach(function(selectedTask) {
            // УДАЛЯЕМ ЗАДАЧУ ИЗ СПИСКА
            goOnTasks.removeChild(selectedTask);
            // УДАЛЯЕМ ВЫДЕЛЕНИЕ
            selectedTask.classList.remove('selected');
            // ДОБАВЛЯЕМ В СПИСОК ГОТОВО
            selectedTask.classList.add('taskComplete');
            completeTasks.appendChild(selectedTask);
            // ОТПРАВКА НОВОГО СТАТУСА НА СЕРВАК
            sendStatusToServer(selectedTask, 'Готово');
        });
    });

    // ОБРАБОТЧИК СОБЫТИЯ ПРИ НАЖАТИЯ НА КНОПКУ УДАЛИТЬ
    document.querySelector('.buttonDelete').addEventListener('click', function() {

        document.querySelectorAll('.taskComplete.selected').forEach(function(selectedTask) {

        completeTasks.removeChild(selectedTask);

        selectedTask.classList.remove('selected');
        selectedTask.classList.add('taskDelete');
        deleteTasks.appendChild(selectedTask);

        sendStatusToServer(selectedTask, 'Корзина');
        });
    });

    // ОБРАБОТЧИК СОБЫТИЯ ПРИ НАЖАТИЯ НА КНОПКУ ОЧИСТИТЬ
      document.querySelector('#cleanBin').addEventListener('click', async function() {
        
          const response = await fetch('http://localhost:3000/tasks', {
            method: 'DELETE'
          });
        deleteTasks.innerHTML = '';
      });
};