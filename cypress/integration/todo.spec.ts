const TodoPage = require('../pages/todo')



describe('ToDos', () => {

  const todoPage = new TodoPage('https://www.todomvc.com/examples/react/#')

  beforeEach(() => {
    // Go to ToDoMVC React Page
    todoPage.visit()
  })

  afterEach(() => {
    // Compare Snapshots for Visual Regression, if Turned On
    todoPage.compareSnapshot(Cypress.currentTest.title)
  })



  it('Can add a single todo', () => {
    // Add a Todo
    const todo = 'a sample todo'
    todoPage.addToDo(todo)

    // Check that Todo is Added
    todoPage.getToDos().should('have.length', 1).should('have.text', todo)

    // Check that Number of Items Left is Correct
    todoPage.getToDoCount().should('have.text', '1 item left')
  })


  it("Can add multiple todos", () => {
    // Add Multiple Todos
    const todos = [ 'todo #1', 'todo #2', 'todo #3' ]
    todos.forEach((todo) => {
      todoPage.addToDo(todo)
    })

    // Check that All Todos are Added
    todoPage.getToDos().should('have.length', 3)
    todos.forEach((todo) => {
      todoPage.getToDo(todo).should('have.length', 1)
    })

    // Check that Number of Items Left is Correct
    todoPage.getToDoCount().should('have.text', `${todos.length} items left`)
  })


  it("Can remove a todo", () => {
    // Add a Todo
    const todo = 'a sample todo'
    todoPage.addToDo(todo)

    // Remove Todo
    todoPage.removeToDo(todo)

    // Check that Todo is Removed
    todoPage.getToDos().should('have.length', 0)
  })


  it("Can edit a todo", () => {
    // Add a Todo
    const todo = 'todo X'
    todoPage.addToDo(todo)

    // Edit Todo
    const newTodo = 'todo Y'
    todoPage.editToDo(todo, newTodo)

    // Check that Todo is Updated
    todoPage.getToDos().should('have.length', 1).should('have.text', newTodo)
  })


  it("Can mark a todo as completed or active", () => {
    // Add a Todo
    const todo = 'a sample todo'
    todoPage.addToDo(todo)

    // Check that Todo is Active by Default
    todoPage.getToDo(todo).should('not.have.attr', 'class', 'completed')

    // Mark Todo as Completed
    todoPage.markAsCompleted(todo, true)

    // Check that Todo is Marked as Completed
    todoPage.getToDo(todo).should('have.attr', 'class', 'completed')

    // Mark Todo as Active
    todoPage.markAsCompleted(todo, false)

    // Check that Todo is Marked as Active
    todoPage.getToDo(todo).should('not.have.attr', 'class', 'completed')
  })


  it("Can mark all todos as completed or active", () => {
    // Add Multiple Todos
    const todos = [ 'todo #1', 'todo #2', 'todo #3' ]
    todos.forEach((todo) => {
      todoPage.addToDo(todo)
    })

    // Check that All Todos are Active by Default
    todos.forEach((todo) => {
      todoPage.getToDo(todo).should('not.have.attr', 'class', 'completed')
    })

    // Mark All Todos as Completed
    todoPage.toggleAllToDos()

    // Check that All Todos are Marked as Completed
    todos.forEach((todo) => {
      todoPage.getToDo(todo).should('have.attr', 'class', 'completed')
    })

    // Mark All Todos as Active
    todoPage.toggleAllToDos()

    // Check that All Todos are Marked as Active
    todos.forEach((todo) => {
      todoPage.getToDo(todo).should('not.have.attr', 'class', 'completed')
    })
  })


  it("Todo input has a placeholder value of 'What needs to be done'", () => {
    // Check Todo Input Placeholder Text
    const inputTodo = cy.get(todoPage.inputNewTodo)
    inputTodo.should('have.text', '')
    inputTodo.should('have.attr', 'placeholder', 'What needs to be done?')
  })


  it("Can view completed or active todos", () => {
    // Add Multiple Todos
    const todos = [ 'todo #1', 'todo #2', 'todo #3' ]
    todos.forEach((todo) => {
      todoPage.addToDo(todo)
    })

    // Mark a Single Todo as Completed
    const randomTodo = todos[Math.floor(Math.random() * todos.length)]
    todoPage.markAsCompleted(randomTodo, true)

    // View Only Completed Todos and Check that Only One Todo is Visible
    todoPage.viewCompletedToDos(true)
    todoPage.getToDos().should('have.length', 1).should('have.text', randomTodo)

    // View Only Active Todos and Check that the Other Todos are Visible
    todoPage.viewCompletedToDos(false)
    todoPage.getToDos().should('have.length', 2).should('not.have.text', randomTodo)
  })


  it("Adding a todo from the completed page adds the todo but won't display from there", () => {
    // Add Multiple Todos
    const todos = [ 'todo #1', 'todo #2', 'todo #3' ]
    todos.forEach((todo) => {
      todoPage.addToDo(todo)
    })

    // View Only Completed Todos
    todoPage.viewCompletedToDos(true)

    // Add a Todo
    const todo = 'an active todo'
    todoPage.addToDo(todo)

    // Check that Todo is Not Displayed in the Page
    todoPage.getToDos().should('have.length', 0)

    // Check that Number of Items Left is Correct
    todoPage.getToDoCount().should('have.text', `${todos.length + 1} items left`)

    // View Only Active Todos and Check that the Todo is There
    todoPage.viewCompletedToDos(false)
    todoPage.getToDo(todo).should('have.length', 1)
  })


  it('Run a performance audit via Lighthouse with custom thresholds', () => {
    const thresholds = {
      'performance': 60,
      'accessibility': 60,
      'seo': 60,
      'pwa': 0,
      'best-practices': 60,
      'first-contentful-paint': 2000,
      'largest-contentful-paint': 5000,
      'cumulative-layout-shift': 0.1,
      'total-blocking-time': 500,
    }

    const config = {
      formFactor: "desktop",
      screenEmulation: {
        width: 1350,
        height: 940,
        deviceScaleRatio: 1,
        mobile: false,
        disable: false,
      },
      throttling: {
        rttMs: 40,
        throughputKbps: 11024,
        cpuSlowdownMultiplier: 1,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0,
      },
    }

    cy.lighthouse(thresholds, config)
  })



})
