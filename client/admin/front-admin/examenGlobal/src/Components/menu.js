class Menu extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.data = [];
  }

  async connectedCallback() {
    await this.loadData();
    await this.render();
  }

  loadData () {
    this.data = {
      svg: `<svg fill="#000000" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0">
      </g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> 
      <path d="M0 0h4v4H0V0zm0 6h4v4H0V6zm0 6h4v4H0v-4zM6 0h4v4H6V0zm0 6h4v4H6V6zm0 6h4v4H6v-4zm6-12h4v4h-4V0zm0 6h4v4h-4V6zm0 6h4v4h-4v-4z" fill-rule="evenodd">
      </path> </g></svg>`

    }
  } 

  async render() {
    this.shadow.innerHTML = 
    /*html*/

      `
    <style>

      *{
        margin: 0;
      }

      .menu-svg{
        width: 1.5rem;
        cursor: pointer;
        padding:0 0.5rem 0 0;
      }

    </style>

    <div class="menu-svg">
      ${this.data.svg}
    </div>

      `;
  }
}

customElements.define("menu-component", Menu);
