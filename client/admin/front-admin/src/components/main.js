class Main extends HTMLElement {
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

      main{
        display:grid;
        grid-template-columns: 1fr 2fr;
        gap: 1.8rem;
        
      }
        
    </style>

    <main>
      <slot></slot>
    </main>
     
      `;
  }
}

customElements.define("main-component", Main);
