class FilterModal extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    document.addEventListener('showFilterModal', this.showFilterModal.bind(this))
  }

  async connectedCallback () {
    this.render()
  }

  showFilterModal () {
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
            <span>Indica los datos de los campos por los cuales quieres filtrar</span>
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
    const deniedButton = this.shadow.querySelector('.cancel-button')
    deniedButton.addEventListener('click', () => {
      this.shadow.querySelector('.overlay').classList.remove('active')
    })

    const acceptedButton = this.shadow.querySelector('.confirm-button')
    acceptedButton.addEventListener('click', () => {
      // Aquí haz lo que necesites con el filtro (si aplicas algo en el futuro)
      this.shadow.querySelector('.overlay').classList.remove('active')
    })
  }
}

customElements.define('filter-modal-component', FilterModal)
