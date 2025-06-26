import isEqual from 'lodash-es/isEqual'
import { store } from '../../redux/store.js'
import { refreshTable } from '../../redux/crud-slice.js'
class UserForm extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = '/api/admin/users'
    this.unsubscribe = null
    this.formElementData = null
  }

  connectedCallback () {
    this.unsubscribe = store.subscribe(() => {
      const currentState = store.getState()

      if (currentState.crud.formElement && currentState.crud.formElement.endPoint === this.endpoint && !isEqual(this.formElementData, currentState.crud.formElement.data)) {
        this.formElementData = currentState.crud.formElement.data
        this.showElement(this.formElementData)
      }
    })

    this.render()
  }

  loadData () {
    this.data = {
      title: 'General',
      cleanSvg: `<svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
      viewBox="0 0 32 32" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> 
      <style type="text/css"> .st0{fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} </style> 
      <path class="st0" d="M14,17V3c0-1.1,0.9-2,2-2h0c1.1,0,2,0.9,2,2v14"></path> <line class="st0" x1="14" y1="14" x2="18" y2="14"></line> 
      <path class="st0" d="M26,31H6l2.7-12.4c0.2-0.9,1-1.6,2-1.6h10.8c0.9,0,1.8,0.7,2,1.6L26,31z"></path> <line class="st0" x1="9" y1="21" x2="23" y2="21">
      </line> <line class="st0" x1="11" y1="27" x2="11" y2="30"></line> <line class="st0" x1="21" y1="29" x2="21" y2="30"></line> </g></svg>`,
      saveSvg: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17 20.75H7C6.27065 20.75 5.57118 20.4603 5.05546 19.9445C4.53973 19.4288 4.25 18.7293 4.25 18V6C4.25 5.27065 4.53973 4.57118 5.05546 4.05546C5.57118 3.53973 6.27065 3.25 7 3.25H14.5C14.6988 3.25018 14.8895 3.32931 15.03 3.47L19.53 8C19.6707 8.14052 19.7498 8.33115 19.75 8.53V18C19.75 18.7293 19.4603 19.4288 18.9445 19.9445C18.4288 20.4603 17.7293 20.75 17 20.75ZM7 4.75C6.66848 4.75 6.35054 4.8817 6.11612 5.11612C5.8817 5.35054 5.75 5.66848 5.75 6V18C5.75 18.3315 5.8817 18.6495 6.11612 18.8839C6.35054 19.1183 6.66848 19.25 7 19.25H17C17.3315 19.25 17.6495 19.1183 17.8839 18.8839C18.1183 18.6495 18.25 18.3315 18.25 18V8.81L14.19 4.75H7Z" fill="#000000"></path> <path d="M16.75 20H15.25V13.75H8.75V20H7.25V13.5C7.25 13.1685 7.3817 12.8505 7.61612 12.6161C7.85054 12.3817 8.16848 12.25 8.5 12.25H15.5C15.8315 12.25 16.1495 12.3817 16.3839 12.6161C16.6183 12.8505 16.75 13.1685 16.75 13.5V20Z" fill="#000000"></path> <path d="M12.47 8.75H8.53001C8.3606 8.74869 8.19311 8.71403 8.0371 8.64799C7.88109 8.58195 7.73962 8.48582 7.62076 8.36511C7.5019 8.24439 7.40798 8.10144 7.34437 7.94443C7.28075 7.78741 7.24869 7.61941 7.25001 7.45V4H8.75001V7.25H12.25V4H13.75V7.45C13.7513 7.61941 13.7193 7.78741 13.6557 7.94443C13.592 8.10144 13.4981 8.24439 13.3793 8.36511C13.2604 8.48582 13.1189 8.58195 12.9629 8.64799C12.8069 8.71403 12.6394 8.74869 12.47 8.75Z" fill="#000000"></path> </g></svg> ',
      nameFieldTitle: 'Nombre',
      emailFieldTitle: 'Email',
    }
  }

  async render () {
    this.shadow.innerHTML =
      /* html */

        `
      <style>

        *{
          box-sizing: border-box;
        }

        input{
          width: 100%;
          height:2.2rem;
        }

        svg{
          width: 2rem;
          cursor:pointer;
        }

        .form{
          display:flex;
          flex-direction:column;
          gap:0.8rem;
        }        

        .form-bar{
          background-color: red;
          display: flex;
          justify-content: space-between;
        }        
        
        .form-bar-tabs{
          padding:0.6rem;
          background-color: yellow;
        }

        .form-bar-buttons{
          display: flex;
          gap: rem;
          align-items:center;
        }

        .form-bar-clean-svg svg{
          width:1.8rem;
        }

        .fields-section{
          display:flex;
          flex-direction:column;
          gap:0.8rem;
        }  

        .form-fields{
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(20%, 1fr));
          gap:1rem;
        }        

        .form-element{
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

      </style>

      <section class="form">

        <div class="form-bar">
          <div class="form-bar-tabs">
            <span>General<span>
          </div>

          <div class="form-bar-buttons">
            <div class="clean-button">
              <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
              viewBox="0 0 32 32" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> 
              <style type="text/css"> .st0{fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} </style> 
              <path class="st0" d="M14,17V3c0-1.1,0.9-2,2-2h0c1.1,0,2,0.9,2,2v14"></path> <line class="st0" x1="14" y1="14" x2="18" y2="14"></line> 
              <path class="st0" d="M26,31H6l2.7-12.4c0.2-0.9,1-1.6,2-1.6h10.8c0.9,0,1.8,0.7,2,1.6L26,31z"></path> <line class="st0" x1="9" y1="21" x2="23" y2="21">
              </line> <line class="st0" x1="11" y1="27" x2="11" y2="30"></line> <line class="st0" x1="21" y1="29" x2="21" y2="30"></line> </g></svg>
            </div>

            <div class="save-button">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17 20.75H7C6.27065 20.75 5.57118 20.4603 5.05546 19.9445C4.53973 19.4288 4.25 18.7293 4.25 18V6C4.25 5.27065 4.53973 4.57118 5.05546 4.05546C5.57118 3.53973 6.27065 3.25 7 3.25H14.5C14.6988 3.25018 14.8895 3.32931 15.03 3.47L19.53 8C19.6707 8.14052 19.7498 8.33115 19.75 8.53V18C19.75 18.7293 19.4603 19.4288 18.9445 19.9445C18.4288 20.4603 17.7293 20.75 17 20.75ZM7 4.75C6.66848 4.75 6.35054 4.8817 6.11612 5.11612C5.8817 5.35054 5.75 5.66848 5.75 6V18C5.75 18.3315 5.8817 18.6495 6.11612 18.8839C6.35054 19.1183 6.66848 19.25 7 19.25H17C17.3315 19.25 17.6495 19.1183 17.8839 18.8839C18.1183 18.6495 18.25 18.3315 18.25 18V8.81L14.19 4.75H7Z" fill="#000000"></path> <path d="M16.75 20H15.25V13.75H8.75V20H7.25V13.5C7.25 13.1685 7.3817 12.8505 7.61612 12.6161C7.85054 12.3817 8.16848 12.25 8.5 12.25H15.5C15.8315 12.25 16.1495 12.3817 16.3839 12.6161C16.6183 12.8505 16.75 13.1685 16.75 13.5V20Z" fill="#000000"></path> <path d="M12.47 8.75H8.53001C8.3606 8.74869 8.19311 8.71403 8.0371 8.64799C7.88109 8.58195 7.73962 8.48582 7.62076 8.36511C7.5019 8.24439 7.40798 8.10144 7.34437 7.94443C7.28075 7.78741 7.24869 7.61941 7.25001 7.45V4H8.75001V7.25H12.25V4H13.75V7.45C13.7513 7.61941 13.7193 7.78741 13.6557 7.94443C13.592 8.10144 13.4981 8.24439 13.3793 8.36511C13.2604 8.48582 13.1189 8.58195 12.9629 8.64799C12.8069 8.71403 12.6394 8.74869 12.47 8.75Z" fill="#000000"></path> </g></svg>
            </div>
          </div>
        </div>


        <div class="fields-section">
          <form>
          <input type="hidden" name="id">
            <div class="form-fields">
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
            </div>
          </form>  
        </div>
      </section>
    `
    this.renderButtons()
  }

  renderButtons () {
    this.shadow.querySelector('.save-button').addEventListener('click', async event => {
      event.preventDefault()

      const form = this.shadow.querySelector('form')
      const formData = new FormData(form)
      const formDataJson = {}

      for (const [key, value] of formData.entries()) {
        formDataJson[key] = value !== '' ? value : null
      }

      const id = this.shadow.querySelector('[name="id"]').value
      const endpoint = id ? `${this.endpoint}/${id}` : this.endpoint
      const method = id ? 'PUT' : 'POST'
      delete formDataJson.id

      try {
        const response = await fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formDataJson)
        })

        if (!response.ok) {
          throw new Error(`Error al guardar los datos: ${response.statusText}`)
        }

        store.dispatch(refreshTable(this.endpoint))
        this.resetForm()

        document.dispatchEvent(new CustomEvent('notice', {
          detail: {
            message: 'Datos guardados correctamente',
            type: 'success'
          }
        }))
      } catch (error) {
        document.dispatchEvent(new CustomEvent('notice', {
          detail: {
            message: 'No se han podido guardar los datos',
            type: 'error'
          }
        }))
      }
    })

    this.shadow.querySelector('.clean-button').addEventListener('click', async event => {
      this.resetForm()
    })
  }

  showElement (data) {
    Object.entries(data).forEach(([key, value]) => {
      if (this.shadow.querySelector(`[name="${key}"]`)) {
        this.shadow.querySelector(`[name="${key}"]`).value = value
      }
    })
  }

  resetForm () {
    const form = this.shadow.querySelector('form')
    form.reset()
    this.shadow.querySelector('[name="id"]').value = ''
    this.formElementData = null
  }
}

customElements.define('users-form-component', UserForm)
