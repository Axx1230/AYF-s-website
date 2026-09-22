document.querySelector('#add').onclick = () => {
    const newTodoEl = document.querySelector('#new-todo')
    const todosEl = document.querySelector('#todos')

    todosEl.innerHTML += `<li>${newTodoEl.value}</li>`
    newTodoEl.value = ''
}