// Seleção 
const todoForm = document.querySelector('#todo-form')
const todoInput = document.querySelector('#todo-input')
const todoList = document.querySelector('#todo-list')
const editForm = document.querySelector('#edit-form')
const editInput = document.querySelector('#edit-input')
const cancelEditBtn = document.querySelector('#cancel-edit-btn')
const toolbar = document.querySelector('#toolbar')
const searchInput = document.querySelector('#search-input')
const eraseBtn = document.querySelector('#erase-button')
const filterBtn = document.querySelector('#filter-select')

let oldInputValue

// Funções
const saveTodo = (text, done=0, save=1) => {
  // Criação da div
  const divTodo = document.createElement('div')
  divTodo.classList.add('todo')
  
  // Criação do título
  const titleTodo = document.createElement('h3')
  titleTodo.textContent = `${text}`
  
  // Criação do botão de finalizar Todos
  const buttonComplete = document.createElement('button')
  buttonComplete.classList.add('finish-todo')
  buttonComplete.innerHTML = '<i class="fa-solid fa-check"></i>'
  
  // Criação do botão para editar Todos
  const buttonEdit = document.createElement('button')
  buttonEdit.classList.add('edit-todo')
  buttonEdit.innerHTML = '<i class="fa-solid fa-pen"></i>'
  
  
  // Criação do botão para remover Todos
  const buttonRemove = document.createElement('button')
  buttonRemove.classList.add('remove-todo')
  buttonRemove.innerHTML = '<i class="fa-solid fa-xmark"></i>'
  
  // Adicionar todos itens à divTodo
  divTodo.appendChild(titleTodo)
  divTodo.appendChild(buttonComplete)
  divTodo.appendChild(buttonEdit)
  divTodo.appendChild(buttonRemove)
  
  // Utilizando dados da LS
  if (done) {
    divTodo.classList.add('done')
  }
  
  if (save) {
    saveTodoLS({text, done})
  }
  
  // Adicionar divTodo à div todoList
  todoList.appendChild(divTodo)
  
  // Limpar input + Focar input
  todoInput.value = ''
  todoInput.focus()
}

const toggleForms = () => {
  todoForm.classList.toggle('hide')
  editForm.classList.toggle('hide')
  todoList.classList.toggle('hide')
}

const updateTodo = (text) => {
  const todos = document.querySelectorAll(".todo")
  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3")
    if (todoTitle.textContent === oldInputValue) {
      todoTitle.textContent = text
      
      updateTodoNameLS(oldInputValue, text)
    }
  })
}

const getSearchTodos = (text) => {
  const todos = document.querySelectorAll(".todo")
  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3").textContent.toLowerCase()
    const lowerText = text.toLowerCase()
    
    todo.style.display = 'flex'
    
    if (!todoTitle.includes(lowerText)) {
      todo.style.display = 'none'
    }
  })
}

const filterTodos = (filter) => {
  const todos = document.querySelectorAll(".todo")
  switch (filter) {
    case 'all':
      todos.forEach((todo) => {
        todo.style.display = 'flex'
      });
      break;
    case 'done':
      todos.forEach((todo) => {
        if (!todo.classList.contains('done')) {
          todo.style.display = 'none'
        }
      });
      break;
    case 'todo':
      todos.forEach((todo) => {
        if (todo.classList.contains('done')) {
          todo.style.display = 'none'
        }
      });
      break;
  }
}



// Eventos
todoForm.addEventListener("submit", (e) => {
  e.preventDefault()
  
  const todo = todoInput.value
  if (todo) {
    saveTodo(todo)
  }
})

document.addEventListener("click", (e) => {
  const targetEl = e.target
  const parentEl = targetEl.closest('div')
  let todoTitle;
  
  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").textContent
  }
  
  if (targetEl.classList.contains('finish-todo')) {
    parentEl.classList.toggle('done')
    updateTodoStatusLS(todoTitle)
  }
  
  if (targetEl.classList.contains('edit-todo')) {
    toggleForms()
    
    editInput.value = todoTitle
    oldInputValue = todoTitle
  }
  
  if (targetEl.classList.contains('remove-todo')) {
    parentEl.remove()
    removeTodoLS(todoTitle)
  }
})

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault()
  toggleForms()
})

editForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const editInputValue = editInput.value
  
  if (editInputValue) {
    updateTodo(editInputValue)
  }
  
  toggleForms()
})

searchInput.addEventListener("keyup", (e) => {
  e.preventDefault()
  const search = e.target.value
  getSearchTodos(search)
})

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault()
  searchInput.value = ''
  searchInput.dispatchEvent(new Event('keyup'))
})

filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value
  
  filterTodos(filterValue)
})

// Local Storage
const getTodosLS = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || []
  return todos
}

const removeTodoLS = (text) => {
  const todos = getTodosLS()
  const filteredTodos = todos.filter((todo) => todo.text !== text)
  localStorage.setItem('todos', JSON.stringify(filteredTodos))
}

const loadTodos = () =>{
  const todos = getTodosLS()
  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, 0)
  });
}

const saveTodoLS = (todo) => {
  // Todos os Todos da LS
  const todos = getTodosLS()
  
  // Adicionar novo Todo no array
  todos.push(todo)
  
  // Salvar tudo na Ls
  localStorage.setItem('todos', JSON.stringify(todos))
}

const updateTodoStatusLS = (text) => {
  // Todos os Todos da LS
  const todos = getTodosLS()
  
  // Mapear o Todoo
  todos.map((todo) => {
    todo.text === text ? todo.done = !todo.done : null
  })
  
  // Salvar tudo na Ls
  localStorage.setItem('todos', JSON.stringify(todos))
}

const updateTodoNameLS = (oldName, newName) => {
    // Todos os Todos da LS
  const todos = getTodosLS()
  
  // Pegar o Todoo
  todos.map((todo) => {
    todo.text === oldName ? todo.text = newName : null
  })
  
  // Salvar tudo na Ls
  localStorage.setItem('todos', JSON.stringify(todos))
}

loadTodos()
