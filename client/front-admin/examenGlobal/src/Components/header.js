class Header extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    await this.render();
  }

  async render() {
    this.shadow.innerHTML = 
    /*html*/

      `
    <style>

      header{
        display:flex;
        align-items:center;
        justify-content:space-between
      }
        
    </style>

    <header>
      <slot></slot>
    </header>
     
      `;
  }
}

customElements.define("header-component", Header);
