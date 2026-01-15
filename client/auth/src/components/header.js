class Header extends HTMLElement {
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

      header{
      display:flex;
      justify-content:center;
     
      }
        
    </style>

    <header>
      <slot></slot>
    </header>
     
      `
  }
}

customElements.define('header-component', Header)
