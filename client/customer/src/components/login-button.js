class LoginButtonComponent extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.render()
    this.addEventListeners()
  }

  render () {
    this.shadow.innerHTML =
    /* html */ `
      <style>
        button {
          position: relative;
          margin-left: 90rem;
          margin-top: 1px;
          padding: 14px 28px;
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          background: linear-gradient(135deg, #ff7e5f, #feb47b);
          box-shadow: 0 6px 15px rgba(255, 126, 95, 0.5);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(255, 126, 95, 0.7);
        }

        button:active {
          transform: translateY(0);
          box-shadow: 0 4px 10px rgba(255, 126, 95, 0.4);
        }
      </style>

      <button id="loginBtn">
        Iniciar sesión
      </button>
    `
  }

  addEventListeners () {
    const button = this.shadow.querySelector('#loginBtn')

    button.addEventListener('click', () => {
      // Redirección frontend
      window.location.href = '/cuenta/login'
    })
  }
}

customElements.define('login-button-component', LoginButtonComponent)
