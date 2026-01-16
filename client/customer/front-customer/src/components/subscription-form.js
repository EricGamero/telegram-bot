class SubscriptionForm extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.data = {}
  }

  async connectedCallback () {
    await this.loadData()
    await this.render()
  }

  async loadData () {
    try {
      const response = await fetch(`/api/customer/subscription-forms/${this.getAttribute('name')}`)

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`)
      }

      this.data = await response.json()
    } catch (error) {
      console.error('Error loading data:', error)
      this.data = []
    }
  }

  render () {
    this.shadow.innerHTML =
    /* html */`
    <style>

      *{
        box-sizing: border-box;
      }

      button{
        background-color: transparent;
        border: none;
        cursor: pointer;
        outline: none;
        padding: 0;
      }


      h1, h2, h3, h4, h5, h6, p, a, span, li, label, input, button{
        font-family: "Nunito Sans", serif;
        font-optical-sizing: auto;
      }



      .subscription-form{
        align-items: center;
        background-color: hsl(198, 100%, 85%);
        display: grid;
        gap: 2rem;
        grid-template-columns: 1fr;
        min-height: 100vh;
        padding: 3rem 1rem;

        @media (min-width: 768px) {
          padding: 3rem 10%;
        }

        @media (min-width: 1280px) {
          grid-template-columns: 1fr 1fr;
          padding: 3rem 10%;
        }
      }

      .explanation {
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 2rem;

        @media (min-width: 1280px) {
          align-items: flex-start;
        }
      }

      .explanation-title h3 {
        font-size: 2rem;
        font-weight: 800;
        text-align: center;

        @media (min-width: 768px) {
          font-size: 3rem;
        }

        @media (min-width: 1280px) {
          font-size: 3rem;
          line-height: 3rem;
          text-align: left;
        }
      }

      .explanation-info p{
        color: hsl(0, 0%, 50%);
        font-size: 1.2rem;
        font-weight: 600;
        line-height: 2rem;
        text-align: center;

        @media (min-width: 768px) {
          font-size: 2rem;
        }

        @media (min-width: 1280px) {
          text-align: left;
        }
      }

      .explanation-featured{
        background-color: rgba(0, 0, 0, 0.5); 
        backdrop-filter: blur(10px);
        padding: 1rem;
        width: max-content;
      }

      .explanation-featured span{
        color: hsl(0, 0%, 100%);
        font-size: 1.2rem;
        font-weight: 600;

        @media (min-width: 768px) {
          font-size: 2rem;
        }
      }

      .form-container {
        background-color: white;
        border-radius: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 2rem;
        width: 100%;
      }

      .info-area {
        display: flex;
      }

      .info-area-text {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .info-area-title h4 {
        font-size: 1.8rem;
        font-weight: 800;

        @media (min-width: 768px) {
          font-size: 2rem;
        }
      }

      .info-area-subtitle span {
        color: hsl(0, 0%, 50%);
        font-size: 1rem;
        font-weight: 600;

        @media (min-width: 768px) {
          font-size: 1.5rem;
        }
      }

      .info-area-icon svg {
        animation: top-bottom 2s infinite;
        width: 5rem;
        fill: hsl(0, 0%, 70%);
        text-align: center;
      }

      @keyframes top-bottom {
        0%, 100%, 20%, 50%, 80% {
          -webkit-transform: translateY(0);
          -ms-transform: translateY(0);
          transform: translateY(0);
        }

        40% {
          -webkit-transform: translateY(-8px);
          -ms-transform: translateY(-8px);
          transform: translateY(-8px);
        }
        60% {
          -webkit-transform: translateY(-4px);
          -ms-transform: translateY(-4px);
          transform: translateY(-4px);
        }
      }

      .form form{
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
      }

      .form-element-input input {
        border: 2px solid rgb(192, 192, 192);
        border-radius: 1.5rem;
        font-size: 1rem;
        outline: none;
        padding: 1rem;
        width: 100%;

        @media (min-width: 768px) {
          font-size: 1.5rem;
        }
      }

      .form-element-input input:hover {
        border-color: hsl(200, 77%, 52%);
      }

      .form-element-button button{
        background-color: hsl(200, 77%, 52%);
        border-radius: 1rem;
        color: hsl(0, 0%, 100%);
        font-size: 1.2rem;
        font-weight: 600;
        padding: 1rem;
        width: 100%;

        @media (min-width: 768px) {
          font-size: 1.5rem;
        }
      }
      .form-element-button button:hover{
         background-color: hsl(200, 77%, 42%);
      }
      .validation-errors ul{
          list-style: disc inside;
          color: #EF8A8A;
          margin: 0.5rem 0 0;
          padding: 0;
          font-size: 0.875rem;
          list-style:none;
          position: relative;
          font-size:1.2rem;
        }
        .validation-errors.error {
          border: 2px solid red;
          padding: .5rem;
          
        }

        .close-button {
          display: flex;              /* quita hueco de la línea base */
          align-items: center;
          justify-content: center;
          position: absolute;
          width: 2rem;
          height: 2rem;
          right:1.6rem;
          top:10rem;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .close-button svg {
          width: 1.2rem;
          height: 1.2rem;
          pointer-events: none
        }

      .validation-errors .close-validation-errors{
        cursor: pointer;
        position: absolute;
        right: 0.5rem;
        top: 0.5rem;
      }

      .close-validation-errors svg{
        fill: hsla(0, 52%, 32%, 1.00);
        height: 2rem;
        width: 2rem;
      }
    </style>


  
    
    <section class="subscription-form">
    <div class="explanation">
      <div class="explanation-title">
        <h3>${this.data.title}</h3>
      </div>
      <div class="explanation-info">
        <p>${this.data.info}</p>
      </div>
      <div class="explanation-featured">
        <span>${this.data.featured}</span>
      </div>
    </div>
    <div class="form-container">
      <div class="info-area">
        <div class="info-area-text">
          <div class="info-area-title">
            <h4>${this.data.start}</h4>
          </div>
          <div class="info-area-subtitle">
            <span>${this.data.instructions}</span>
          </div>
        </div>
        <div class="info-area-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>hand-pointing-down</title><path d="M9.9,21V11L6.7,12.69L6.5,12.72C6.19,12.72 5.93,12.6 5.74,12.4L5,11.63L9.9,7.43C10.16,7.16 10.5,7 10.9,7H17.4C18.17,7 18.9,7.7 18.9,8.5V12.86C18.9,13.47 18.55,14 18.05,14.2L13.11,16.4L11.9,16.53V21A1,1 0 0,1 10.9,22A1,1 0 0,1 9.9,21M18.9,5H10.9V2H18.9V5Z" /></svg>
        </div>
      </div>

      <div class="form">
        <div class="validation-errors">
          <ul></ul>
        </div>
        <form>
          <div class="form-element">
            <div class="form-element-input">
              <input type="text" name="name" placeholder="Nombre">
            </div>
          </div>
          <div class="form-element">
            <div class="form-element-input">
              <input type="text" name="email" placeholder="Dirección de correo">
            </div>
          </div>
          <div class="save-button">
            <button>${this.data.buttonText}</button>
          </div>
        </form>
      </div>
    </div>
  </section>
  `
    this.addEventListeners()
  }

  addEventListeners () {
    const form = this.shadow.querySelector('form')
    const input = this.shadow.querySelector('input')

    // click on the save button (delegated)
    this.shadow.querySelector('.form').addEventListener('click', async event => {
      if (!event.target.closest('.save-button')) return

      event.preventDefault()

      const formEl = form || this.shadow.querySelector('form')
      const formData = new FormData(formEl)
      const formDataJson = {}

      for (const [key, value] of formData.entries()) {
        formDataJson[key] = value !== '' ? value : null
      }

      try {
        const response = await fetch('/api/customer/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formDataJson)
        })

        if (!response.ok) throw response

        store.dispatch(showFormElement({
          endPoint: '/api/customer/customers',
          data: null
        }))

        store.dispatch(refreshTable('/api/customer/customers'))
        this.resetForm?.()

        document.dispatchEvent(new CustomEvent('notice', {
          detail: {
            message: 'Datos guardados correctamente',
            type: 'success'
          }
        }))
      } catch (error) {
        if (error.status === 422) {
          const data = await error.json()
          this.showValidationErrors(data.message)

          document.dispatchEvent(new CustomEvent('notice', {
            detail: {
              message: 'Los datos enviados no son válidos, corríjalo.',
              type: 'error'
            }
          }))
        }

        if (error.status === 500) {
          document.dispatchEvent(new CustomEvent('notice', {
            detail: {
              message: 'No se han podido guardar los datos',
              type: 'error'
            }
          }))
        }
      }
    })

    // al escribir, quitamos borde rojo y si no quedan errores visibles, ocultamos panel
    if (input) {
      input.addEventListener('input', () => {
        const container = input.closest('.form-element-input')
        if (container) container.classList.remove('error')

        const ul = this.shadow.querySelector('.validation-errors ul')
        if (ul && ul.children.length <= 1) this.closeValidationErrors()
      })
    }

    // submit del formulario (por si se usa Enter)
    if (form) {
      form.addEventListener('submit', async (event) => {
        event.preventDefault()

        const email = (input ? input.value : '').trim()

        try {
          const response = await fetch('/api/customer/customers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
          })

          if (!response.ok) {
            // si es error 422 (validación), lo mostramos
            if (response.status === 422) {
              const data = await response.json()
              this.showValidationErrors(data.message)
              return
            }
            throw new Error('Error en la suscripción')
          }

          const result = await response.json()
          console.log('Suscripción correcta:', result)
          form.reset()
          this.closeValidationErrors()
        } catch (error) {
          console.log('Error al enviar la suscripción:', error)
        }
      })
    }

    // botón cerrar errores
    this.shadow.addEventListener('click', (event) => {
      if (event.target.closest('.close-validation-errors')) {
        this.closeValidationErrors()
      }
    })
  }

  // === AÑADIDO ===
  showValidationErrors (errors) {
    // Normaliza el formato: acepta string o array
    const messages = Array.isArray(errors)
      ? errors
      : [{ message: String(errors || 'Ha ocurrido un error'), path: 'email' }]

    const errorsContainer = this.shadow.querySelector('.validation-errors')
    const errorsList = errorsContainer.querySelector('ul')

    // 1) limpia estado anterior
    errorsList.innerHTML = ''
    this.shadow.querySelectorAll('.form-element-input.error')
      .forEach(el => el.classList.remove('error'))

    // 2) vuelca mensajes
    messages.forEach(err => {
      const li = document.createElement('li')
      li.textContent = err.message || 'Error'
      errorsList.appendChild(li)

      // si indica el campo, marca el contenedor
      if (err.path) {
        const input = this.shadow.querySelector(`[name="${err.path}"]`)
        if (input) input.closest('.form-element-input').classList.add('error')
      }
    })

    // 3) muestra el panel
    errorsContainer.setAttribute('role', 'alert')
    errorsContainer.setAttribute('aria-live', 'polite')
    errorsContainer.classList.add('active')
  }

  closeValidationErrors () {
    const errorsContainer = this.shadow.querySelector('.validation-errors')
    const errorsList = errorsContainer.querySelector('ul')

    errorsList.innerHTML = ''
    errorsContainer.classList.remove('active')

    this.shadow.querySelectorAll('.form-element-input.error')
      .forEach(el => el.classList.remove('error'))
  }
}

customElements.define('subscription-form-component', SubscriptionForm)
