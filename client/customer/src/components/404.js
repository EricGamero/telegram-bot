class NotFound extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.data = []
  }

  async connectedCallback () {
    await this.loadData()
    await this.render()
  }

  loadData () {
    this.data = {}
  }

  async render () {
    this.shadow.innerHTML =
    /* html */
      `
      <style>

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      .not-found {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        gap: 1rem;
      }

      .error-number span {
        font-size: 10rem;
      }

      .error-description span {
        font-size: 4rem;
        color: #333;
      }

      .home-link {
        display: inline-block;
        padding: 0.5rem 1rem;
        background: #333;
        color: white;
        text-decoration: none;
        border-radius: 5px;
      }



 
      

      </style>

      <section class="not-found">
        <div class="error-number">
          <span> 404 </span>
        </div>
        <div class="error-description">
          <span>Page not found</span>
        </div>
      
        <div class="error-redirection">
          <a href="/" class="home-link">Volver al inicio</a>
        </div>
      </section>  
      `
  }
}

customElements.define('not-found-component', NotFound)
