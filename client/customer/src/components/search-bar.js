class SearchBar extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.timeout = null
  }

  connectedCallback () {
    this.render()
  }

  render () {
    this.shadow.innerHTML = /* html */`
      <style>
        .search-container {
        position: relative;
        width: 320px;
        font-family: sans-serif;
        margin-top: 20px;
        margin-left: 8px;
      }

      input {
        width: 100%;
        padding: 0.6rem 2.5rem 0.6rem 2rem;
        border: none;               /* quitamos borde general */
        border-bottom: 2px solid #004080; /* línea inferior */
        border-radius: 25px 25px 25px 25px; /* opcional, menos redondeo si quieres */
        outline: none;
        font-size: 1rem;
        box-shadow: none;           /* quitamos sombra general */
        transition: all 0.2s ease;
      }

      input:focus {
        border-bottom-color: #002060;
        box-shadow: 0 2px 4px rgba(0,0,0,0.15); /* ligera sombra para foco */
      }

      .search-container svg {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        width: 16px;
        height: 16px;
        fill: #004080;
        pointer-events: none;
      }

      ul {
        position: absolute;
        top: 105%;
        left: 0;
        right: 0;
        margin: 0;
        padding: 0;
        list-style: none;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        max-height: 200px;
        overflow-y: auto;
        z-index: 10;
      }

        li {
          padding: 0.5rem 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        li:hover { background: #d0e4ff; }
        .no-results { padding: 0.5rem 1rem; color: #666; }
      </style>

      <div class="search-container">
        <svg viewBox="0 0 24 24">
          <path d="M10 2a8 8 0 015.29 13.71l4 4a1 1 0 01-1.42 1.42l-4-4A8 8 0 1110 2zm0 2a6 6 0 100 12 6 6 0 000-12z"/>
        </svg>
        <input type="text" placeholder="Busca productos..." />
        <ul id="results"></ul>
      </div>
    `

    this.input = this.shadow.querySelector('input')
    this.ul = this.shadow.getElementById('results')

    this.input.addEventListener('input', (e) => this.onInput(e))
    // opcional: cerrar desplegable al perder foco (pero permitir click en items)
    this.input.addEventListener('blur', () => setTimeout(() => this.renderResults([]), 150))
  }

  onInput (e) {
    clearTimeout(this.timeout)
    const value = e.target.value.trim()

    // mínimo 5 caracteres según enunciado
    if (value.length < 5) {
      this.renderResults([])
      return
    }

    // debounce: 1 segundo tras dejar de escribir
    this.timeout = setTimeout(async () => {
      // Disparar un evento que indica que se va a realizar la búsqueda
      this.dispatchEvent(new CustomEvent('search-fired', { detail: { query: value } }))

      const results = await this.searchBackend(value)
      this.renderResults(results)
    }, 1000)
  }

  async searchBackend (query) {
    try {
      const res = await fetch('/api/customer/products/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })
      if (!res.ok) return []
      const data = await res.json()
      // devolver máximo 3 sugerencias con nombre (prioriza metadata.name)
      return (data.results || []).slice(0, 3).map(p => ({ name: p.metadata?.name || p.text, id: p.id }))
    } catch (err) {
      console.error('Error fetch search:', err)
      return []
    }
  }

  renderResults (results) {
    const ul = this.ul
    ul.innerHTML = ''

    if (!results || results.length === 0) {
      // mostramos nada o un mensaje discreto
      // ul.innerHTML = `<li class="no-results">No hay sugerencias</li>`
      return
    }

    results.forEach(r => {
      const li = document.createElement('li')
      li.textContent = r.name
      li.addEventListener('click', () => {
        this.input.value = r.name
        ul.innerHTML = ''
        // también puedes disparar un evento de selección si quieres:
        this.dispatchEvent(new CustomEvent('product-selected', { detail: r }))
      })
      ul.appendChild(li)
    })
  }
}

customElements.define('search-bar-component', SearchBar)
