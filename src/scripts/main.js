import axios from "axios"
import Swal from "sweetalert2"
import { debounce } from "throttle-debounce"

const TOKEN_NAME = "user_token"

function removeTodo(data, id) {
  const index = data.findIndex((todo) => todo.id === id)
  if (index !== -1) {
    data.splice(index, 1)
  }
}

const toggleTodoFunc = debounce(500, (id) => {
  const token = localStorage.getItem(TOKEN_NAME)
  const url = `https://todoo.5xcamp.us/todos/${id}/toggle`
  const config = { headers: { Authorization: token } }
  try {
    axios.patch(url, null, config)
  } catch (err) {
    console.log(err);
  }
})

const Main = () => ({
  showSection: "loginSection",
  email: "",
  nickname: "",
  password: "",
  isLogin: false,
  todos: [],
  task: "",
  todoText: "",
  init() {
    const token = localStorage.getItem(TOKEN_NAME)
    if (token) {
      this.isLogin = true
      this.showTaskInput()
      this.getTodos()
    }
  },
  clearText() {
    this.email = ""
    this.nickname = ""
    this.password = ""
  },
  showLogin() {
    this.showSection = "loginSection"
  },
  showSignUp() {
    this.showSection = "signUpSection"
  },
  showTaskInput() {
    this.showSection = "taskSection"
  },
  editTodo(id) {
    const todo = this.todos.find((todo) => todo.id == id)

    if (todo) {
      this.todoText = todo.content
      this.$refs.modal.dataset.id = id
      this.$refs.modal.showModal()
    }
  },
  toggleTodo(id) {
    toggleTodoFunc(id)
    // const token = localStorage.getItem(TOKEN_NAME)

    // if (token) {
    //   const url = `https://todoo.5xcamp.us/todos/${id}/toggle`
    //   const config = { headers: { Authorization: token } }

    //   try {
    //     const {data} = await axios.patch(url, null, config)
    //     console.log(data)
    //   } catch (err) {
    //     console.log(err)
    //   }
    // }
    // console.log(id)
  },
    
  async updateTodo() {
    const { id } = this.$refs.modal.dataset
    const token = localStorage.getItem(TOKEN_NAME)

      if (id && token) {
        const url = `https://todoo.5xcamp.us/todos/${id}`
        const config = { headers: { Authorization: token } }
        const todoData = {
        todo: {
          content: this.todoText,
        },
      }

      try {
        // 1. 關視窗
        this.$refs.modal.close()
        // 2. 更新資料
        const todo = this.todos.find((todo) => todo.id == id)
        todo.content = this.todoText

        // if (todo) {
        //   todo.content = this.todoText
        // }
        // this.todoText = ""

        await axios.put(url, todoData, config)
      } catch {
        console.log("error")
      }
    }
  },
    
  async deleteTodo(id) {
    if (confirm("確認刪除？")) {
      const token = localStorage.getItem(TOKEN_NAME)

    if (token) {
      const url = `https://todoo.5xcamp.us/todos/${id}`
      const config = { headers: { Authorization: token } }
      //     this.$el.parentNode.parentNode.remove()
      removeTodo(this.todos, id)

      try {
        await axios.delete(url, config)
      } catch {
        Swal.fire({
          title: "錯誤",
          html: "無法刪除資料，請稍候再試",
          icon: "error",
          confirmButtonText: "確認",
          })
        }
      }
    }
  },
  async addTodo() {
    const token = localStorage.getItem(TOKEN_NAME)

    if (token && this.task != "") {
      const url = "https://todoo.5xcamp.us/todos"
      const todoData = {
        todo: {
          content: this.task,
        },
      }
      const config = { headers: { Authorization: token } }

      try {
        const { data } = await axios.post(url, todoData, config)
        this.task = ""
        this.todos.unshift(data)
      } catch (err) {
        // sweet alert
        console.log(err)
      }
    }
  },
  async getTodos() {
    const url = "https://todoo.5xcamp.us/todos"
    const token = localStorage.getItem(TOKEN_NAME)

    if (token) {
      const config = { headers: { Authorization: token } }

      try {
        const { data } = await axios.get(url, config)
        const { todos } = data
        this.todos = todos
      } catch {
        Swal.fire({
          title: "錯誤",
          html: "無法新增資料，請稍候再試",
          icon: "error",
          confirmButtonText: "確認",
        })
      }
    }
  },
  async logout() {
    const url = "https://todoo.5xcamp.us/users/sign_out"
    const token = localStorage.getItem(TOKEN_NAME)

    if (token) {
      try {
        const config = { headers: { Authorization: token } }
        await axios.delete(url, config)
      } catch {}

      this.isLogin = false
      localStorage.removeItem(TOKEN_NAME)
      this.todos = []
      this.showLogin()
    }
  },
  async login() {
    if (this.email != "" && this.password != "") {
      const userData = {
        user: {
          email: this.email,
          password: this.password,
        },
      }

      try {
        const resp = await axios.post("https://todoo.5xcamp.us/users/sign_in", userData)
        const token = resp.headers.authorization

        localStorage.setItem(TOKEN_NAME, token)
        this.clearText()
        this.isLogin = true
        this.showTaskInput()
        this.getTodos()
      } catch (err) {
        Swal.fire({
          title: "錯誤",
          html: "登入失敗",
          icon: "error",
          confirmButtonText: "確認",
        })
      }
    }
  },
  async signUp() {
    if (this.email != "" && this.nickname != "" && this.password != "") {
      const userData = {
        user: {
          email: this.email,
          nickname: this.nickname,
          password: this.password,
        },
      }

      try {
        await axios.post("https://todoo.5xcamp.us/users", userData)
        this.clearText()
        this.showLogin()
      } catch (err) {
        const errText = err.response.data.error.join("<br />")
        Swal.fire({
          title: "系統發生錯誤",
          html: errText,
          icon: "error",
          confirmButtonText: "確認",
        })
      }
    }
  },
})

export default Main
