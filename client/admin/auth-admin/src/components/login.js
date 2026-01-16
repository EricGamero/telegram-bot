class Login extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.data = {}
  }

  connectedCallback () {
    this.checkSignin()
    this.loadData()
    this.render()
  }

  async checkSignin () {
    try {
      const result = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/user/check-signin`, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (result.ok) {
        const data = await result.json()
        window.location.href = data.redirection
      }
    } catch (error) {
      console.log(error)
    }
  }

  loadData () {
    this.data = {
      buttonText: 'Entrar'
    }
  }

  addEvents () {
    const form = this.shadow.querySelector('form')

    form.addEventListener('submit', (e) => {
      e.preventDefault()

      const email = this.shadow.querySelector('#email').value
      const password = this.shadow.querySelector('#password').value

      // ⚠️ Aquí luego conectarás tu auth real
      console.log('Login attempt:', { email, password })
    })
  }

  render () {
    this.shadow.innerHTML =
      /* html */
      `
      <style>
        * {
          box-sizing: border-box;
          font-family: "Science Gothic", sans-serif;
        }

        .login {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
        }

        h2 {
          margin-bottom: 1.5rem;
          font-size: 2rem;
          font-weight: 400;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        input {
          padding: 0.8rem;
          font-size: 1rem;
        }

        button {
          padding: 0.8rem;
          font-size: 1rem;
          cursor: pointer;
        }
      </style>

      <div class="login">
        <form>
          <input 
            id="email"
            type="email"
            placeholder="Email"
            required
          />

          <input 
            id="password"
            type="password"
            placeholder="Contraseña"
            required
          />

          <button type="submit">
            ${this.data.buttonText}
          </button>
        </form>
      </div>
    `
    const form = this.shadow.querySelector('form')

    form.addEventListener('submit', async (event) => {
      event.preventDefault()
      const formData = new FormData(form)
      const formDataJson = Object.fromEntries(formData.entries())

      try {
        const result = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/user/signin`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formDataJson)
        })

        if (result.ok) {
          const data = await result.json()
          window.location.href = data.redirection
        } else {
          const error = await result.json()
          console.log(error.message)
        }
      } catch (error) {
        console.log(error)
      }
    })
  }
}

customElements.define('login-component', Login)
