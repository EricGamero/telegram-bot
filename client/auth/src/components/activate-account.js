class ActivateAccountComponent extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  async connectedCallback () {
    await this.render()
    this.addEventListeners()
  }

  async render () {
    // Captura token del query string
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token') || ''

    this.shadow.innerHTML =
    /* html */
    `
      <style>
        form {
          display: flex;
          flex-direction: column;
          max-width: 400px;
          padding: 1.5rem;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          background-color: rgba(255, 126, 95, 0.6);
          background-image: repeating-linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.15), /* aumenta la opacidad de las líneas */
            rgba(255, 255, 255, 0.15) 2px, /* línea de 2px */
            transparent 2px,
            transparent 6px /* espacio entre líneas */
          );
          font-family: Arial, sans-serif;
          backdrop-filter: blur(8px);
        }
        label {
          margin-top: 1rem;
          margin-bottom: 0.25rem;
          font-weight: 600;
        }
        input {
          padding: 0.5rem;
          border-radius: 5px;
          border: 1px solid #ccc;
          font-size: 1rem;
        }
        button {
          margin-top: 1.5rem;
          padding: 12px 24px;
          background-color: rgba(255, 0, 0, 0.4);
          color: #fff;
          font-weight: 600;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.2s;
        }
        button:hover {
          background: linear-gradient(135deg, #ff7e5f, #feb47b);
          box-shadow: 0 8px 20px rgba(255,126,95,0.6);
          transform: translateY(-2px);
        }
        #message {
          margin-top: 1rem;
          font-size: 0.9rem;
          color: red;
        }
      </style>

      <form id="activateForm">
        <input type="hidden" id="token" value="${token}" />
        <label>Contraseña</label>
        <input type="password" id="password" required placeholder="Escriba su contraseña" name="password" />
        <label>Confirmar contraseña</label>
        <input type="password" id="confirmPassword" required placeholder="Confirme su contraseña" name="repeatPassword" />
        <button type="submit">Activar cuenta</button>
        <div id="message"></div>
      </form>
    `
  }

  addEventListeners () {
    const form = this.shadow.querySelector('#activateForm')
    if (!form) return

    form.addEventListener('submit', async (event) => {
      event.preventDefault()

      const password = this.shadow.querySelector('input[name="password"]').value
      const repeatPassword = this.shadow.querySelector('input[name="repeatPassword"]').value
      const messageEl = this.shadow.querySelector('#message')
      const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/

      if (!password || !repeatPassword) {
        messageEl.textContent = 'Los campos no pueden estar vacios'
        return
      }

      if (password !== repeatPassword) {
        messageEl.textContent = 'Las contraseñas no coinciden'
        return
      }

      if (!regex.test(password)) {
        messageEl.textContent = 'La contraseña no cumple con los requisitos mínimos'
        return
      }

      const tokenInput = this.shadow.querySelector('#token')
      const token = tokenInput ? tokenInput.value : new URLSearchParams(window.location.search).get('token')

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/activate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token, password })
        })

        if (response.ok) {
          messageEl.textContent = 'Cuenta activada correctamente'
          form.reset()
        } else {
          const data = await response.json()
          messageEl.textContent = data.message || 'Error al activar la cuenta'
        }
      } catch (err) {
        messageEl.textContent = 'Error de red'
      }
    })
  }
}

customElements.define('activate-account-component', ActivateAccountComponent)
