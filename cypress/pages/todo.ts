export {}

const Page = require('./_page')

class Todo extends Page {

  buttonRemove = "//button[@class='destroy']"
  header = "//h1[.='todos']"
  inputNewTodo = "input.new-todo"
  linkAll = "//a[.='All']"
  linkActive = "//a[.='Active']"
  linkCompleted = "//a[.='Completed']"
  listTodos = "//ul[@class='todo-list']//li"
  spanTodoCount = "span.todo-count"
  toggleAll = "//label[@for='toggle-all']"
  toggleComplete = "//input[@class='toggle']"


  constructor(public url: string) {
    super(url)
  }



  /**
   * Go to Todo MVC React page.
   *
   * @function visit
  */
  visit() {
    cy.visit(this.url)
    cy.xpath(this.header).should('have.length', 1)
  }


  /**
   * Get todos list.
   *
   * @function getToDos
  */
  getToDos() {
    return cy.xpath(this.listTodos)
  }


  /**
   * Get todo.
   *
   * @function getToDo
   * @param {String} todo
  */
  getToDo(todo) {
    return cy.xpath(`//li[.='${todo}']`)
  }


  /**
   * Get todo count.
   *
   * @function getToDoCount
  */
  getToDoCount() {
    return cy.get(this.spanTodoCount)
  }


  /**
   * Add a todo.
   *
   * @function addToDo
   * @param {String} todo
  */
  addToDo(todo: string) {
    cy.get(this.inputNewTodo).type(`${todo}{enter}`)
  }


  /**
   * Remove a todo.
   *
   * @function removeToDo
   * @param {String} todo
  */
  removeToDo(todo: string) {
    cy.xpath(`//li[.='${todo}']${this.buttonRemove}`).click({ force: true })
  }


  /**
   * Edit a todo.
   *
   * @function editToDo
   * @param {String} todo
   * @param {String} newTodo
  */
  editToDo(todo: string, newTodo: string) {
    cy.xpath(`//li[.='${todo}']`).dblclick()
    cy.get('li input.edit').clear()
    cy.get('li input.edit').type(`${newTodo}{enter}`)
  }


  /**
   * Mark a todo as completed or active.
   *
   * @function markAsCompleted
   * @param {String} todo
   * @param {Boolean} complete
  */
  markAsCompleted(todo: string, complete: boolean = true) {
    const toggle = cy.xpath(`//li[.='${todo}']${this.toggleComplete}`)
    complete ? toggle.check() : toggle.uncheck()
  }


  /**
   * Mark all todos as completed or active.
   *
   * @function toggleAllToDos
  */
  toggleAllToDos() {
    cy.xpath(this.toggleAll).click()
  }


  /**
   * View completed or active todos.
   *
   * @function viewCompletedToDos
   * @param {Boolean} complete
  */
  viewCompletedToDos(complete: boolean = true) {
    const linkButton = complete ? this.linkCompleted : this.linkActive
    cy.xpath(linkButton).click()
  }

}

module.exports = Todo
