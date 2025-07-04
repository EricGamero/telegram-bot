import isEqual from 'lodash-es/isEqual'
import { store } from '../../redux/store.js'
import { refreshTable, showFormElement } from '../../redux/crud-slice.js'

class PromoterForm extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = '/api/admin/promoters'
    this.unsubscribe = null
    this.formElementData = null
  }

  connectedCallback () {
    this.unsubscribe = store.subscribe(() => {
      const currentState = store.getState()

      if (currentState.crud.formElement.data && currentState.crud.formElement.endPoint === this.endpoint && !isEqual(this.formElementData, currentState.crud.formElement.data)) {
        this.formElementData = currentState.crud.formElement.data
        this.showElement(this.formElementData)
      }

      if (!currentState.crud.formElement.data && currentState.crud.formElement.endPoint === this.endpoint) {
        this.resetForm()
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
          
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.9);

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
          display:flex;
          gap:2rem
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

        .form-element{
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-element-input.error{
          border: 1px solid red;
          background-color: #fee2e2; 
        }

        .tab {
          padding: 0.5rem 1rem;
          cursor: pointer;
          background-color: white;       
          color: black;                  
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
          border-radius: 4px 4px 0 0;
        }

        .tab.active {
          background-color: #8b5cf6;       
          color: white;                    
          border-bottom-color: #8b5cf6;
          font-weight: bold;
        }

  
        .tab-content {
          display: none;
        }

        .tab-content.active {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(20%, 1fr));
          gap:1rem;
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

      </style>

      <section class="form">

        <div class="form-bar">
          <div class="form-bar-tabs">
            <div class="tab active" data-tab="general">
              <span>General</span>
            </div> 
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
          <div class="validation-errors">
            <ul></ul>
          </div>
          <form>
            <input type="hidden" name="id">
            <div class="tab-content active" data-tab="general">
              <div class="form-element">
                <div class="form-element-label">
                  <label for="name">Nombre</label>
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
            <div class="tab-content" data-tab="images">
              <div class="form-fields">
                <div class="form-element">
                  <div class="form-element-label">
                    <label for="name">Imagen</label>
                  </div>
                <div class="form-element-input">
                  <input type="file" name="image">
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
    this.shadow.querySelector('.form').addEventListener('click', async event => {
      event.preventDefault()

      if (event.target.closest('.save-button')) {
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
            throw response
          }

          store.dispatch(showFormElement({
            endPoint: this.endpoint,
            data: null
          }))

          store.dispatch(refreshTable(this.endpoint))
          this.resetForm()

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
                message: 'Los datos enviados no son válidos, corrijalo.',
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
      }

      if (event.target.closest('.clean-button')) {
        this.resetForm()
      }

      if (event.target.closest('.tab')) {
        const clickedTab = event.target.closest('.tab')

        this.shadow.querySelector('.tab.active').classList.remove('active')
        clickedTab.classList.add('active')

        this.shadow.querySelector('.tab-content.active').classList.remove('active')
        this.shadow.querySelector(`.tab-content[data-tab='${clickedTab.dataset.tab}']`).classList.add('active')
      }
      if (event.target.closest('.close-button')) {
        const panel = this.shadow.querySelector('.validation-errors')
        panel.classList.remove('error')
        panel.querySelector('ul').innerHTML = ''
        event.target.closest('.close-button').remove()
      }
    })
  }

  showElement (data) {
    Object.entries(data).forEach(([key, value]) => {
      if (this.shadow.querySelector(`[name="${key}"]`)) {
        this.shadow.querySelector(`[name="${key}"]`).value = value
      }
    })
  }

  showValidationErrors (messages) { // message es la constante creada en el middleware de errors-handler que salta cuando hay un error, que te dice "ha ocurrido un error inesperado"
    // o si es 422 que es el del validador del sequelize o el mongoose pues nada es un array de objetos con varios atributos, uno de ellos "message"
    this.shadow.querySelectorAll('.error')
      .forEach(el => el.classList.remove('error')) // estas dos líneas de codigo son por si acaso uno de los campos sigue dando error pero otro no, entonces se quitan ambas clases y
      // se le vuelve a poner a los que sí tengan error, porque con clearvalidationerror solo se lo quitamos a los que se han guardado correctamente

    // 2. vaciar lista
    const panel = this.shadow.querySelector('.validation-errors')
    const ul = this.shadow.querySelector('.validation-errors ul') // creamos constante "ul" para referirnos a la ul de validation errors. Se podría ser mas especifico y
    //  poner validationErrorUl por ejemplo pero bue
    ul.innerHTML = '' // añadimos los li que creamos dinamicamente
    let closeButton = panel.querySelector('.close-button')
    if (!closeButton) {
      closeButton = document.createElement('button')
      closeButton.type = 'button'
      closeButton.className = 'close-button'
      closeButton.setAttribute('aria-label', 'Cerrar mensaje')
      closeButton.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM8.96963 8.96965C9.26252 8.67676 9.73739 8.67676 10.0303 8.96965L12 10.9393L13.9696 8.96967C14.2625 8.67678 14.7374 8.67678 15.0303 8.96967C15.3232 9.26256 15.3232 9.73744 15.0303 10.0303L13.0606 12L15.0303 13.9696C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0303 15.0303C9.73742 15.3232 9.26254 15.3232 8.96965 15.0303C8.67676 14.7374 8.67676 14.2625 8.96965 13.9697L10.9393 12L8.96963 10.0303C8.67673 9.73742 8.67673 9.26254 8.96963 8.96965Z" fill="#1C274C"></path> </g></svg>'
      /* handler para cerrar el panel */
      closeButton.addEventListener('click', () => {
        panel.classList.remove('error')
        ul.innerHTML = ''
        closeButton.remove()             // se elimina del DOM
      })
      panel.prepend(closeButton)         // lo insertamos arriba del todo
    }
    // 3. recorrer mensajes para crear un li por array de messages, msg cada array de messages
    messages.forEach(msg => {
    // a) mensaje en el panel
      const li = document.createElement('li') // creamos el li para meter los mensajes
      li.textContent = msg.message // pillas el atributo message que es el que nos interesa del array
      ul.appendChild(li) // lo metemos dentro de ul

      // b) borde rojo al input si existe `path`
      if (msg.path) { // "msg" es cada uno de los elementos que recorremos, cada objeto del array "messages" y "path" uno de los atributos, al igual que uno de ellos es el "messsage"
        // señala el tipo de campo que sale en el modelo
        const input = this.shadow.querySelector(`[name="${msg.path}"]`) // entonces creamos la constante input que compara si el nombre (que es como el tipo de campo) es igual que el "path"
        // por lo que si son iguales, quiere decir que ese input corresponde a ese path del modelo

        if (input) {
        // si es cierto que son iguales, entonces comprueba
          (input.closest('.form-element-input'))
            .classList.add('error')
        }
      }
    })
    this.shadow.querySelector('.validation-errors').classList.add('error')
  }
  // Aquí ponemos bordes rojos a los inputs que esten mal y solo a esos...pero y si quiero también meter el error dentro de los inputs?
  // el tema esta que lo que dice Carlos es que al pasar entre tabs no verás el error...Así que nada xd

  /* 🟢 para limpiar cuando todo va bien o al pulsar "Limpiar" */
  clearValidationErrors () {
    this.shadow.querySelectorAll('.error')
      .forEach(el => el.classList.remove('error'))
    const ul = this.shadow.querySelector('.validation-errors ul')
    if (ul) ul.innerHTML = ''
    const button = this.shadow.querySelector('.validation-errors .close-button')
    if (button) button.remove()
  }
  // estas líneas de codigo se ejecutan justo en las parte del codigo de la función save, ya que hemos colocado "clearValidationErrors" a continuación del refresco de la tabla que
  //  coloca el nuevo usuario guardado y por ende todo lo que tenga la clase error se le quita poruqe obviamente si has guardado esta bien y luego seleccionamos el ul haciendole
  // una constante "ul" y decimos que si existe "ul" que es la constante para la ul valga la rebundancia, entonces el html de ul es "" osea nada y así quitamos todos los lis creados y tal

  resetForm () {
    const form = this.shadow.querySelector('form')
    form.reset()
    this.shadow.querySelector('[name="id"]').value = ''
    this.formElementData = null
    this.clearValidationErrors()
  }
}

customElements.define('promoters-form-component', PromoterForm)
