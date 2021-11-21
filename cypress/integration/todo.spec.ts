const snapshot = { capture: 'fullPage', errorThreshold: 0.1 }



describe('ToDos', () => {

  // Page Elements
  const buttonRemove = "//button[@class='destroy']"
  const header = "//h1[.='todos']"
  const inputNewTodo = "input.new-todo"
  const linkActive = "//a[.='Active']"
  const linkCompleted = "//a[.='Completed']"
  const listTodos = "//ul[@class='todo-list']//li"
  const spanTodoCount = "span.todo-count"
  const toggleAll = "//label[@for='toggle-all']"
  const toggleComplete = "//input[@class='toggle']"



  beforeEach(() => {
    // Go to ToDoMVC React Page
    cy.visit('https://www.todomvc.com/examples/react/#')
    cy.xpath(header).should('have.length', 1)
  })



  it('Can add a single todo', () => {
    // Add a Todo
    const todo = 'a sample todo'
    cy.get(inputNewTodo).type(`${todo}{enter}`)

    // Check that Todo is Added
    cy.xpath(listTodos).should('have.length', 1).should('have.text', todo)

    // Check that Number of Items Left is Correct
    cy.get(spanTodoCount).should('have.text', '1 item left')

    if (Cypress.env('visual')) cy.compareSnapshot('add-a-single-to-do', snapshot)
  })


  it("Can add multiple todos", () => {
    // Add Multiple Todos
    const todos = [ 'todo #1', 'todo #2', 'todo #3' ]
    todos.forEach((todo) => {
      cy.get(inputNewTodo).type(`${todo}{enter}`)
    })

    // Check that All Todos are Added
    cy.xpath(listTodos).should('have.length', 3)
    todos.forEach((todo) => {
      cy.xpath(`//li[.='${todo}']`).should('have.length', 1).should('have.text', todo)
    })

    // Check that Number of Items Left is Correct
    cy.get(spanTodoCount).should('have.text', `${todos.length} items left`)

    if (Cypress.env('visual')) cy.compareSnapshot('add-multiple-to-do', snapshot)
  })


  it("Can remove a todo", () => {
    // Add a Todo
    const todo = 'a sample todo'
    cy.get(inputNewTodo).type(`${todo}{enter}`)

    // Remove Todo
    cy.xpath(`//li[.='${todo}']${buttonRemove}`).click({ force: true })

    // Check that Todo is Removed
    cy.xpath(listTodos).should('have.length', 0)

    if (Cypress.env('visual')) cy.compareSnapshot('remove-a-to-do', snapshot)
  })


  it("Can edit a todo", () => {
    // Add a Todo
    const todo = 'todo X'
    cy.get(inputNewTodo).type(`${todo}{enter}`)

    // Edit Todo
    const newTodo = 'todo Y'
    cy.xpath(`//li[.='${todo}']`).dblclick()
    cy.get('li input.edit').clear()
    cy.get('li input.edit').type(`${newTodo}{enter}`)

    // Check that Todo is Updated
    cy.xpath(listTodos).should('have.length', 1).should('have.text', newTodo)

    if (Cypress.env('visual')) cy.compareSnapshot('edit-a-to-do', snapshot)
  })


  it("Can mark a todo as completed or active", () => {
    // Add a Todo
    const todo = 'a sample todo'
    cy.get(inputNewTodo).type(`${todo}{enter}`)

    // Check that Todo is Active by Default
    cy.xpath(`//li[.='${todo}']`).should('not.have.attr', 'class', 'completed')

    // Mark Todo as Completed
    cy.xpath(`//li[.='${todo}']${toggleComplete}`).check()

    // Check that Todo is Marked as Completed
    cy.xpath(`//li[.='${todo}']`).should('have.attr', 'class', 'completed')

    if (Cypress.env('visual')) cy.compareSnapshot('mark-a-to-do-as-completed', snapshot)

    // Mark Todo as Active
    cy.xpath(`//li[.='${todo}']${toggleComplete}`).uncheck()

    // Check that Todo is Marked as Active
    cy.xpath(`//li[.='${todo}']`).should('not.have.attr', 'class', 'completed')

    if (Cypress.env('visual')) cy.compareSnapshot('mark-a-to-do-as-active', snapshot)
  })


  it("Can mark all todos as completed or active", () => {
    // Add Multiple Todos
    const todos = [ 'todo #1', 'todo #2', 'todo #3' ]
    todos.forEach((todo) => {
      cy.get(inputNewTodo).type(`${todo}{enter}`)
    })

    // Check that All Todos are Active by Default
    todos.forEach((todo) => {
      cy.xpath(`//li[.='${todo}']`).should('not.have.attr', 'class', 'completed')
    })

    // Mark All Todos as Completed
    cy.xpath(toggleAll).click()

    // Check that All Todos are Marked as Completed
    todos.forEach((todo) => {
      cy.xpath(`//li[.='${todo}']`).should('have.attr', 'class', 'completed')
    })

    if (Cypress.env('visual')) cy.compareSnapshot('mark-all-to-dos-as-completed', snapshot)

    // Mark All Todos as Active
    cy.xpath(toggleAll).click()

    // Check that All Todos are Marked as Active
    todos.forEach((todo) => {
      cy.xpath(`//li[.='${todo}']`).should('not.have.attr', 'class', 'completed')
    })

    if (Cypress.env('visual')) cy.compareSnapshot('mark-all-to-dos-as-active', snapshot)
  })


  it("Todo input has a placeholder value of 'What needs to be done?'", () => {
    // Check Todo Input Placeholder Text
    cy.get(inputNewTodo).should('have.text', '')
    cy.get(inputNewTodo).should('have.attr', 'placeholder', 'What needs to be done?')

    if (Cypress.env('visual')) cy.compareSnapshot('placeholder-todo', snapshot)
  })


  it("Can view completed or active todos", () => {
    // Add Multiple Todos
    const todos = [ 'todo #1', 'todo #2', 'todo #3' ]
    todos.forEach((todo) => {
      cy.get(inputNewTodo).type(`${todo}{enter}`)
    })

    // Mark a Single Todo as Completed
    const randomTodo = todos[Math.floor(Math.random() * todos.length)]
    cy.xpath(`//li[.='${randomTodo}']${toggleComplete}`).check()

    // View Only Completed Todos and Check that Only One Todo is Visible
    cy.xpath(linkCompleted).click()
    cy.xpath(listTodos).should('have.length', 1).should('have.text', randomTodo)

    if (Cypress.env('visual')) cy.compareSnapshot('view-only-completed', snapshot)

    // View Only Active Todos and Check that the Other Todos are Visible
    cy.xpath(linkActive).click()
    cy.xpath(listTodos).should('have.length', 2).should('not.have.text', randomTodo)

    if (Cypress.env('visual')) cy.compareSnapshot('view-only-active', snapshot)
  })


  it("Adding a todo from the /completed page adds the todo but won't display from there", () => {
    // Add Multiple Todos
    const todos = [ 'todo #1', 'todo #2', 'todo #3' ]
    todos.forEach((todo) => {
      cy.get(inputNewTodo).type(`${todo}{enter}`)
    })

    // View Only Completed Todos
    cy.xpath(linkCompleted).click()

    // Add a Todo
    const todo = 'an active todo'
    cy.get(inputNewTodo).type(`${todo}{enter}`)

    // Check that Todo is Not Displayed in the Page
    cy.xpath(listTodos).should('have.length', 0)

    // Check that Number of Items Left is Correct
    cy.get(spanTodoCount).should('have.text', `${todos.length + 1} items left`)

    // View Only Active Todos and Check that the Todo is There
    cy.xpath(linkActive).click()
    cy.xpath(`//li[.='${todo}']`).should('have.length', 1)

    if (Cypress.env('visual')) cy.compareSnapshot('add-a-to-do-from-completed', snapshot)
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
