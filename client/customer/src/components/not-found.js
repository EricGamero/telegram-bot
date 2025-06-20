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

      svg{
        width: 90%;
        height: 90%;
        display: block;
        text-align:center;
      }

      .not-found {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        gap: 1rem;
        background-color: #dc2727;
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
    
      .image svg{
        justify-content:center;
        align-items:center;
      }

 
      

      </style>
      

      <section class="not-found">
        <div class="image">
          <svg fill="#000000" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>sad-face-line</title> <path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm0,30A14,14,0,1,1,32,18,14,14,0,0,1,18,32Z" class="clr-i-outline clr-i-outline-path-1"></path><circle cx="25.16" cy="14.28" r="1.8" class="clr-i-outline clr-i-outline-path-2"></circle><circle cx="11.41" cy="14.28" r="1.8" class="clr-i-outline clr-i-outline-path-3"></circle><path d="M18.16,20a9,9,0,0,0-7.33,3.78,1,1,0,1,0,1.63,1.16,7,7,0,0,1,11.31-.13,1,1,0,0,0,1.6-1.2A9,9,0,0,0,18.16,20Z" class="clr-i-outline clr-i-outline-path-4"></path> <rect x="0" y="0" width="36" height="36" fill-opacity="0"></rect> </g></svg>        </div>
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
