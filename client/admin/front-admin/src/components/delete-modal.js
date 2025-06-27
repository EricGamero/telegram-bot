import { store } from '../redux/store.js'
import { refreshTable, showFormElement } from '../redux/crud-slice.js'

class DeleteModal extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = ''
    this.tableEndpoint = ''
    document.addEventListener('showDeleteModal', this.showDeleteModal.bind(this))
  }

  async connectedCallback () {
    this.render()
  }

  showDeleteModal (event) {
    const { endpoint, elementId } = event.detail
    this.tableEndpoint = endpoint
    this.endpoint = `${endpoint}/${elementId}`
    const overlay = this.shadowRoot.querySelector('.overlay')
    overlay.classList.add('active')
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
          background-color: red;
          color: white;
          padding: 2rem;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: 400px;
          text-align: center;
          z-index: 1000;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);  
        }

        .modal-text {
          font-size: 1.8rem;
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

        .confirm-button {
          background-color: white;
          color: red;
          font-weight: bold;
        }

        .cancel-button {
          background-color: white;
          color: rgb(9, 255, 0);
        }
      </style>

      <div class="overlay">
        <div class="modal">
          <div class="modal-text">
            <span>¿Deseas borrar el elemento?</span>
          </div> 
          <div class="modal-buttons">
            <div class="confirm-modal-button">
              <button class="confirm-button">Sí</button>
            </div>
            <div class="cancel-modal-button">
            <button class="cancel-button">No</button>
            </div>      
          </div>
        </div>
      </div>    
    `

    this.renderButtons()
  }

  renderButtons () {
    const aceptedButton = this.shadow.querySelector('.confirm-button')
    const deniedButton = this.shadow.querySelector('.cancel-button')

    aceptedButton.addEventListener('click', async () => {
      try {
        const response = await fetch(this.endpoint, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Error al eliminar el elemento')
        }

        document.dispatchEvent(new CustomEvent('notice', {
          detail: {
            message: 'Elemento eliminado correctamente',
            type: 'success'
          }
        }))

        store.dispatch(refreshTable(this.tableEndpoint))
        store.dispatch(showFormElement({
          endPoint: this.tableEndpoint,
          data: null
        }))

        this.shadow.querySelector('.overlay').classList.remove('active')
      } catch (error) {
        document.dispatchEvent(new CustomEvent('notice', {
          detail: {
            message: 'No se han podido eleminar el dato',
            type: 'error'
          }
        }))

        this.shadow.querySelector('.overlay').classList.remove('active')
      }
    })

    deniedButton.addEventListener('click', event => {
      this.shadow.querySelector('.overlay').classList.remove('active')
    })
  }
}

customElements.define('delete-modal-component', DeleteModal)
