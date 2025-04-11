class Logo extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.data = [];
  }

  async connectedCallback() {
    this.loadData();
    this.render();
  }

  loadData() {
    this.data = { title: "Pedidos"}
  }

  render() {
    this.shadow.innerHTML =
     /*html*/ 
        
        `
      <style>

        * {
          margin: 0;
        } 

        h1, h2, h3, h4, h5, h6, p, a, ul, li, button {
          margin: 0;
          font-size: 2.5rem;
        }

        .title{
          padding:1rem 0 1.4rem 0;
        }

      </style>

      <div class="title">
        <p>${this.data.title}</p>
      </div>
    `;
  }
}

customElements.define("logo-component", Logo);
