import { store } from '../../redux/store.js'
import { setFilterQuery } from '../../redux/crud-slice.js'

class PromoterFilter extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = '/api/admin/promoters'
    document.addEventListener('showPromoterFilter', this.showPromoterFilter.bind(this))
  }

  async connectedCallback () {
    this.render()
  }

  showPromoterFilter (event) {
    if (event.detail.endpoint === this.endpoint) {
      this.shadow.querySelector('.overlay').classList.add('active')
    }
  }

  render () {
    this.shadowRoot.innerHTML =
      /* html */`
      <style>
        
        * {
          box-sizing: border-box;
        }

        .overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s, visibility 0.3s;
        }

        .overlay.active{
          opacity:1;
          visibility:visible;
        }


        .modal {
          background: rgba(255, 255, 255, 0.88); /* panel claro semitransparente */
          backdrop-filter: blur(12px);
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
          padding: 2rem 3rem;
          max-width: 460px;
          width: 90%;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .modal-text {
          font-size: 1.6rem;
          font-weight: 600;
          margin: 0 0 .5rem;
          color: #111827;
        }

        .modal-buttons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        button {
          padding: 0.7rem;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
        }
        
        .modal input {
          width: 100%;
          padding: .65rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.9);
          outline: none;
          transition: border-color .2s ease;
        }
        .confirm-button {
          background-color: white;
          color: red;
          font-weight: bold;
        }

        .cancel-button {
          background-color: white;
          color: rgb(9, 255, 0);
        }

        .form-element-input{
          border-radius:2rem
        }
      </style>

      <div class="overlay">
        <div class="modal">
          <div class="modal-text">
            <span>Introduce los valores por los que quieres filtrar</span>
          </div> 
          <div class="filter-form">
            <form>
              <div class="form-element">
                <div class="form-element-label">
                  <label>Nombre</label>
                </div>
                <div class="form-element-input">
                  <input type="text" name="name">
                </div>  
              </div>
              <div class="form-element">
                <div class="form-element-label">
                  <label>Email</label>
                </div>
                <div class="form-element-input">
                  <input type="text" name="email">
                </div>  
              </div> 
            </form>
          </div>
          <div class="modal-buttons">
            <div class="confirm-modal-button">
              <button class="confirm-button">Aplicar</button>
            </div>
            <div class="cancel-modal-button">
            <button class="cancel-button">Cancelar</button>
            </div>      
          </div>
        </div>
      </div>    
    `

    this.renderButtons()
  }

  renderButtons () {
    const confirmButton = this.shadow.querySelector('.confirm-button')
    const cancelButton = this.shadow.querySelector('.cancel-button')
    const overlay = this.shadow.querySelector('.overlay')

    confirmButton.addEventListener('click', (e) => {
      e.preventDefault()

      const form = this.shadow.querySelector('form')
      const formData = new FormData(form)
      const formDataJson = {}

      for (const [key, value] of formData.entries()) {
        formDataJson[key] = value !== '' ? value : null
      }

      const query = Object.entries(formDataJson).map(([key, value]) => `${key}=${value}`).join('&')

      const filterQuery = {
        endPoint: this.endpoint,
        query
      }

      store.dispatch(setFilterQuery(filterQuery))

      overlay.classList.remove('active')
    })

    cancelButton.addEventListener('click', (e) => {
      e.preventDefault()

      const form = this.shadow.querySelector('form')
      form.reset()

      const formData = new FormData(form)
      const formDataJson = {}

      for (const [key, value] of formData.entries()) {
        formDataJson[key] = value !== '' ? value : null
      }

      const query = Object.entries(formDataJson).map(([key, value]) => `${key}=${value}`).join('&')

      const filterQuery = {
        endPoint: this.endpoint,
        query
      }

      store.dispatch(setFilterQuery(filterQuery))

      overlay.classList.remove('active')
    })
  }
}

customElements.define('promoters-filter-component', PromoterFilter)
