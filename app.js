let section = document.querySelector('section');
let add = document.querySelector('form button');
add.addEventListener('click', (e) => {
  // prevent form form being submitted
  e.preventDefault();

  // get the input values
  let form = e.target.parentElement;
  let todoText = form.children[0].value;
  let todoMonth = form.children[1].value;
  let todoDate = form.children[2].value;

  if (todoText === '') {
    alert('please enter some text.');
    return; // stop this callback function
  }

  // create a todo item
  let todo = document.createElement('div');
  todo.classList.add('todo');
  let text = document.createElement('p');
  text.classList.add('todo-text');
  text.innerText = todoText;
  let time = document.createElement('p');
  time.classList.add('todo-time');
  time.innerText = todoMonth + '/' + todoDate;

  todo.appendChild(text);
  todo.appendChild(time);

  // create green check and red trash can
  let completeButton = document.createElement('button');
  completeButton.classList.add('complete');
  completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
  completeButton.addEventListener('click', (e) => {
    let todoItem = e.target.parentElement;
    todoItem.classList.toggle('done');
  });

  let trashButton = document.createElement('button');
  trashButton.classList.add('trash');
  trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

  trashButton.addEventListener('click', (e) => {
    let todoItem = e.target.parentElement;

    todoItem.addEventListener('animationend', () => {
      // remove from HTML
      todoItem.remove();
      // remove from localStorage
      let text = todoItem.children[0].innerText;
      let myListArray = JSON.parse(localStorage.getItem('list'));
      myListArray.forEach((item, index) => {
        if (item.todoText === text) {
          myListArray.splice(index, 1);
          // 更新local storage
          localStorage.setItem('list', JSON.stringify(myListArray));
        }
      });
    });

    todoItem.style.animation = 'scaleDown 0.3s forwards';
  });

  todo.appendChild(completeButton);
  todo.appendChild(trashButton);

  // todo出現時的animation
  todo.style.animation = 'scaleUp 0.3s forwards';

  // creat an object
  let myTodo = {
    todoText: todoText,
    todoMonth: todoMonth,
    todoDate: todoDate,
  };

  // store data into an array of objects
  let myList = localStorage.getItem('list');
  if (myList === null) {
    // list尚未存入->存入一個[]&塞入第一筆資料
    localStorage.setItem('list', JSON.stringify([myTodo]));
  } else {
    // list已存在->提取array&塞入一筆資料
    let myListArray = JSON.parse(myList);
    myListArray.push(myTodo);
    localStorage.setItem('list', JSON.stringify(myListArray));
  }

  // clear the text input
  form.children[0].value = '';
  form.children[1].value = '';
  form.children[2].value = '';

  section.appendChild(todo);
});

// 進入網頁自動load Data
loadData();
function loadData() {
  let myList = localStorage.getItem('list');
  if (myList !== null) {
    let myListArray = JSON.parse(myList);
    myListArray.forEach((item) => {
      // create a todo
      let todo = document.createElement('div');
      todo.classList.add('todo');
      let text = document.createElement('p');
      text.classList.add('todo-text');
      text.innerText = item.todoText;
      let time = document.createElement('p');
      time.classList.add('todo-time');
      time.innerText = item.todoMonth + '/' + item.todoDate;

      todo.appendChild(text);
      todo.appendChild(time);

      // create green check and red trash can
      let completeButton = document.createElement('button');
      completeButton.classList.add('complete');
      completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
      completeButton.addEventListener('click', (e) => {
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle('done');
      });

      let trashButton = document.createElement('button');
      trashButton.classList.add('trash');
      trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

      trashButton.addEventListener('click', (e) => {
        let todoItem = e.target.parentElement;

        todoItem.addEventListener('animationend', () => {
          // remove from HTML
          todoItem.remove();

          // remove from localStorage
          let text = todoItem.children[0].innerText;
          let myListArray = JSON.parse(localStorage.getItem('list'));
          myListArray.forEach((item, index) => {
            if (item.todoText === text) {
              myListArray.splice(index, 1);
              // 更新local storage
              localStorage.setItem('list', JSON.stringify(myListArray));
            }
          });
        });

        todoItem.style.animation = 'scaleDown 0.3s forwards';
      });

      todo.appendChild(completeButton);
      todo.appendChild(trashButton);
      section.appendChild(todo);
    });
  }
}

// Merge Sort
function mergeTime(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
      result.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].todoMonth) === Number(arr2[j].todoMonth)) {
      if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
        result.push(arr2[j]);
        j++;
      } else {
        result.push(arr1[i]);
        i++;
      }
    }
  }
  // 沒有比較到的element
  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }

  return result;
}

function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    // 找出arr中間點
    let middle = Math.floor(arr.length / 2);
    let right = arr.slice(0, middle);
    let left = arr.slice(middle, arr.length);

    return mergeTime(mergeSort(right), mergeSort(left));
    // 遞迴演算法，會一直跑mergeSort直到arr被return
  }
}

// Sort by Time
let sortButton = document.querySelector('div.sort button');
sortButton.addEventListener('click', () => {
  // sort data
  let sortedArray = mergeSort(JSON.parse(localStorage.getItem('list')));
  localStorage.setItem('list', JSON.stringify(sortedArray));

  // remove data
  let len = section.children.length;
  for (let i = 0; i < len; i++) {
    section.children[0].remove();
    // 0會一直被替補再刪除直至長度len為0
  }

  // load data
  loadData();
});
