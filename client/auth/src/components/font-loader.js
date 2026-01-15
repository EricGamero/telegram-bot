class FontLoader extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })

    const font = document.createElement('link')
    font.href = 'https://fonts.googleapis.com/css2?family=BBH+Bartle&family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"'
    font.rel = 'stylesheet'
    document.head.appendChild(font)
  }
}

customElements.define('font-loader-component', FontLoader)
