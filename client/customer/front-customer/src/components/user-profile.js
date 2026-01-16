class UserProfileComponent extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.user = { name: '', email: '' }
  }

  connectedCallback () {
    this.loadProfile()
  }

  async loadProfile () {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/customer/profile`, {
        credentials: 'include' // importante para enviar cookies de sesión
      })

      if (res.ok) {
        this.user = await res.json()
        this.render()
      } else {
        const err = await res.json()
        console.log('No autorizado', err)
        window.location.href = err.redirection || '/login'
      }
    } catch (err) {
      console.log('Error al cargar perfil', err)
    }
  }

  render () {
    const name = this.user.name || 'Usuario'
    const email = this.user.email || ''

    this.shadow.innerHTML =
    /* html */ `
      <style>
        * {
          box-sizing: border-box;
          font-family: Arial, sans-serif;
        }

        .container {
          max-width: 420px;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          color: #fff;
        }

        .card {
          background: rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(8px);
          border-radius: 12px;
          padding: 1rem 1.2rem;
        }

        .title {
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 0.6rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.2);
          padding-bottom: 0.3rem;
        }

        /* PERFIL */
        .name {
          font-size: 1.1rem;
          font-weight: 600;
        }

        .email {
          font-size: 0.9rem;
          opacity: 0.85;
          margin-top: 0.2rem;
        }

        /* LISTAS */
        .row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          margin-top: 0.4rem;
        }

        .muted {
          opacity: 0.8;
        }

        .price {
          font-weight: 600;
        }
      </style>

      <div class="container">

        <!-- PERFIL -->
        <div class="card">
          <div class="title">Cuenta</div>
          <div class="name">${name}</div>
          <div class="email">${email}</div>
        </div>

        <!-- FACTURAS -->
        <div class="card">
          <div class="title">Facturas recientes</div>

          <div class="row">
            <span>Factura #1021 · 10/09/2025</span>
            <span class="price">29,99 €</span>
          </div>

          <div class="row">
            <span>Factura #1013 · 10/08/2025</span>
            <span class="price">29,99 €</span>
          </div>

          <div class="row">
            <span>Factura #1004 · 10/07/2025</span>
            <span class="price">19,99 €</span>
          </div>
        </div>

        <!-- BOTS -->
        <div class="card">
          <div class="title">Bots suscritos</div>

          <div class="row">
            <span>📈 Trading Bot Pro</span>
            <span class="price">15 €/mes</span>
          </div>
          <div class="row muted">
            <span>Renueva: 01/10/2025</span>
          </div>

          <div class="row">
            <span>🤖 Telegram AutoReply</span>
            <span class="price">9 €/mes</span>
          </div>
          <div class="row muted">
            <span>Renueva: 15/10/2025</span>
          </div>

          <div class="row">
            <span>🧠 AI Content Generator</span>
            <span class="price">19 €/mes</span>
          </div>
          <div class="row muted">
            <span>Renueva: 22/10/2025</span>
          </div>
        </div>

      </div>
    `
  }
}

customElements.define('user-profile-component', UserProfileComponent)
