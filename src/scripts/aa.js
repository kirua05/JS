const newArr = removeNum(7)
console.log(newArr) // [2, 3, 8, 7, 9, 6]



function removeTodo(data, id) {
  const index = data.findIndex((todo) => todo.id === id)
  if (index !== -1) {
    data.splice(index, 1)
  }
}

const todos = [
  { id: 123, content: "cc" },
  { id: 456, content: "dd" },
  { id: 789, content: "ee" },

]

removeTodo(todos, 456)
console.log(todos);
