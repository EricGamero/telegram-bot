class PageComponent extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.basePath = this.getAttribute('base-path') || ''
  }

  connectedCallback () {
    this.render()
    window.onpopstate = () => this.handleRouteChange()
  }

  handleRouteChange () {
    this.render()
  }

  async render () {
    const isAuthenticated = await this.checkSignin()

    if (isAuthenticated) {
      const path = window.location.pathname
      this.getTemplate(path)
    }
  }

  async checkSignin () {
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/auth/user/check-signin`

      const result = await fetch(url, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (result.status === 401) {
        let data
        try {
          data = await result.json()
        } catch (e) {
          data = { redirection: '/admin/login' }
        }

        window.location.href = data.redirection || '/admin/login'
        return false
      }

      // If status is not 200 (and not 401 handled above), treat as error/unauthorized to be safe
      if (!result.ok) {
        window.location.href = '/admin/login'
        return false
      }

      return true
    } catch (error) {
      console.error('Auth check failed:', error)
      window.location.href = '/admin/login'
      return false
    }
  }

  async getTemplate (path) {
    const routes = {
      '/admin/usuarios': 'users.html',
      '/admin/eventos': 'events.html',
      '/admin/categorias-de-eventos': 'event-categories.html',
      '/admin/promotores': 'promoters.html',
      '/admin/faqs': 'faqs.html',
      '/admin/titulos-de-funciones': 'feature-titles.html',
      '/admin/cartas': 'cards.html',
      '/admin/heroes': 'heroes.html',
      '/admin/formularios-de-subscripcion': 'subscription-forms.html',
      '/admin/clientes': 'customers.html',
      '/admin/idiomas': 'languages.html',

    }

    const filename = routes[path] || '404.html'

    await this.loadPage(filename)
  }

  async loadPage (filename) {
    const response = await fetch(`${this.basePath}/pages/${filename}`)
    const html = await response.text()

    document.startViewTransition(() => {
      this.shadowRoot.innerHTML = html
      document.documentElement.scrollTop = 0
    })
  }
}

customElements.define('page-component', PageComponent)
