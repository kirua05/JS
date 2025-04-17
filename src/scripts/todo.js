import Alpine from "alpinejs"
import Main from "./main"

window.Alpine = Alpine
Alpine.data("Main", Main)
Alpine.store("TODO", {
  todos: [],
})

Alpine.start()
