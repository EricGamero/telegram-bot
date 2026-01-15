class Logo extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.data = []
  }

  async connectedCallback () {
    this.loadData()
    this.render()
  }

  loadData () {
    this.data = { title: 'Iniciar sesión' }
  }

  render () {
    this.shadow.innerHTML =
      /* html */

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
          padding:1rem 0 1rem 0;
          font-family: "BBH Bartle", sans-serif;
          font-weight: 400;
          font-style: normal;
        }

      </style>

      <div class="title">
        <p>${this.data.title}</p>
      </div>
    `
  }
}

customElements.define('login-logo-component', Logo)
