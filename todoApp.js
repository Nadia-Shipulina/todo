(function () {
  let tasksArray = [],
    newListName = '';
  //создаем заголовок
  function createAppTitle(title) {
    let appTitle = document.createElement('h2'); // переменная создает элемент н2
    appTitle.innerHTML = title; //передаем содержимое заголовка в аргумент title
    return appTitle;
  }

  //создаем форму для ввода дел
  function createTodoItemForm() {
    let form = document.createElement('form'); //переменная создает элемент форм
    let input = document.createElement('input');//переменная создает инпут
    let buttonWrapper = document.createElement('div');//переменная создает див, куда помещена кнопка
    let button = document.createElement('button');//переменная создает кнопку

    form.classList.add('input-group', 'mb-3'); //добавляем стили
    input.classList.add('form-control'); //добавляем стили
    input.placeholder = 'Введите название нового дела' //добавляем плейсхолдер
    buttonWrapper.classList.add('input-group-append'); //добавляем стили
    button.classList.add('btn', 'btn-primary'); //добавляем стили
    button.textContent = 'Добавить дело' //изменяем текст на кнопке
    button.setAttribute('disabled', true);

    input.addEventListener('input', function () {
      if (!input.value) {
        button.setAttribute('disabled', true);
      } else {
        button.removeAttribute('disabled');
      }
    })

    buttonWrapper.append(button); //помещаем кнопку в див
    form.append(input);//помещаем инпут в форму
    form.append(buttonWrapper);//помещаем див в форму
    //возвращаем значения переменных,чтобы можно было ипользовать
    return {
      form, input, button
    };
  }
  //создаем список дел
  function createTodoList() {
    let list = document.createElement('ul'); //переменная создает список
    list.classList.add('list-group');//добавляем стили
    //возвращаем значения переменных,чтобы можно было ипользовать
    return list;
  }

  //создать объек, который будет в себе содержать свойства имени и информацию о выполнение?
  //создаем одну строку дела и помещеаем его в аргумент имя
  function createTodoIteam(obj) {
    let item = document.createElement('li'); //создаем строку списка
    let buttonGroup = document.createElement('div'); //создаем див
    let doneButton = document.createElement('button'); //создаем кнопку
    let deleteButton = document.createElement('button');//создаем кнопку
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center'); //добалвяем стили
    item.textContent = obj.name; //помещаем имя, id , done дела в строку списка


    buttonGroup.classList.add('btn-group', 'btn-group-sm'); //добалвяем стили
    doneButton.classList.add('btn', 'btn-success'); //добалвяем стили
    doneButton.textContent = 'Готово'; //изменяем текст на кнопке
    deleteButton.classList.add('btn', 'btn-danger'); //добалвяем стили
    deleteButton.textContent = 'Удалить'; //изменяем текст на кнопке

    if (obj.done == true) item.classList.add('list-group-item-success')
    doneButton.addEventListener('click', function () {
      item.classList.toggle('list-group-item-success')
      for (const listItem of tasksArray) {
        if (listItem.id == obj.id)
          listItem.done = !listItem.done
      }
      saveList(tasksArray, newListName)
    });
    //вешаем на клик по кнопке в строке дела добовляем проверкуб если проверка пройдена удаляем стиль
    deleteButton.addEventListener('click', function () {
      if (confirm('Вы уверены?')) {
        item.remove();
        for (let i = 0; i < tasksArray.length; i++) {
          if (tasksArray[i].id == obj.id)
            tasksArray.splice(i, 1)
        }
        saveList(tasksArray, newListName)
      }
    });

    buttonGroup.append(doneButton); //помещаем кнопку в группу кнопок
    buttonGroup.append(deleteButton); //помещаем кнопку в группу кнопок
    item.append(buttonGroup); //помещаем группу кнопок в строку списка

    //возвращаем значения переменных,чтобы можно было ипользовать
    return {
      item, doneButton, deleteButton
    };
  }
  function generatorId(arr) {
    let max = 0;
    for (const item of arr) {
      if (item.id > max) max = item.id
    }
    return max + 1
  }
  function saveList(arr, listName) {
    localStorage.setItem(listName, JSON.stringify(arr));
  }
  //создаем функцию, которая будет создовать список дел с аргументами контейнер и заголовок
  function createTodoApp(container, title = 'Список дел', listName) {

    let todoAppTitle = createAppTitle(title); //используем функцию создания заголовка, чтобы создать заголовок приложения столько раз сколько будет нужно
    let todoItemForm = createTodoItemForm(); //используем функцию создания формы, чтобы создать форму приложения столько раз сколько будет нужно
    let todoList = createTodoList(); //используем функцию создания списка, чтобы создать список приложения столько раз сколько будет нужно
    //помещаем все в контейнер столько раз сколько нужно
    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    newListName = listName;
    //создаем обработчик собтий по клику на кнопку, которая находится в формеб сбрасываем настроики по умолчанию. если инпут не пустой, возвращаем его содержимое
    let localData = localStorage.getItem(newListName)
    if (localData !== null && localData !== '') {
      tasksArray = JSON.parse(localData)
    }

    for (const itemList of tasksArray) {
      let todoItem = createTodoIteam(itemList);
      todoList.append(todoItem.item);
    }

    todoItemForm.form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!todoItemForm.input.value) {
        return;
      }
      let newItem = {
        name: todoItemForm.input.value,
        done: false,
        id: generatorId(tasksArray),
      };
      console.log(tasksArray)

      //создаем строку с делом введенным в инпут и присвеваем создание в переменную
      let todoItem = createTodoIteam(newItem);
      //вешаем на клик по кнопке в строке дела стили
      tasksArray.push(newItem)
      saveList(tasksArray, newListName)

      todoList.append(todoItem.item); //помещаем созданное дело в список дел
      todoItemForm.input.value = ''; //ощищаем инпут
      todoItemForm.button.disabled = true;
    });
  }
  window.createTodoApp = createTodoApp; //вызываем ыункцию создания приложения столкьо сколько нужно
})();


