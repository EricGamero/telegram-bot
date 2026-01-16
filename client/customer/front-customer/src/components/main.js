class Main extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  async connectedCallback () {
    await this.render()
  }

  async render () {
    this.shadow.innerHTML =
    /* html */

      `
    <style>

      main{

      }
        
    </style>

    <main>
      <slot></slot>
    </main>
     
      `
  }
}

customElements.define('main-component', Main)
