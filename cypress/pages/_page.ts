export {}

class Page {

  private snapshot = { capture: 'fullPage', errorThreshold: 0.15 }

  constructor(public url: string) {
    this.url = url
  }



  /**
   * Compare snapshots. For visual regression purposes.
   *
   * @function compareSnapshot
   * @param {String} filename
  */
  compareSnapshot(filename) {
    if (Cypress.env('visual')) {
      filename = filename.toLowerCase().replace(/\'/g, '').replace(/ /g, '-')
      cy.compareSnapshot(filename, this.snapshot)
    }
  }

}

module.exports = Page
