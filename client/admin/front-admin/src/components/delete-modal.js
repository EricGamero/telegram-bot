class DeleteModal extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.render()
    this.setupListeners()
  }

  render () {
    this.shadowRoot.innerHTML = /* html */`
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
            <span>¿Deseas borrar la entrada?</span>
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
  }

  setupListeners () {
    const overlay = this.shadowRoot.querySelector('.overlay')
    const noButton = this.shadowRoot.querySelector('.cancel-button')
    const yesButton = this.shadowRoot.querySelector('.confirm-button')

    noButton.addEventListener('click', () => {
      overlay.classList.remove('active')
    })

    yesButton.addEventListener('click', () => {
      // Aquí irá la lógica para eliminar si se confirma
      overlay.classList.remove('active')
    })
  }
}

customElements.define('delete-modal-component', DeleteModal)
