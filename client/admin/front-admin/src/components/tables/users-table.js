import { store } from '../../redux/store.js'
import { showFormElement } from '../../redux/crud-slice.js'

class UserTable extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = '/api/admin/users'
    this.unsubscribe = null
  }

  async connectedCallback () {
    this.unsubscribe = store.subscribe(() => {
      const currentState = store.getState()

      if (currentState.crud.tableEndpoint === this.endpoint) {
        this.loadData().then(() => this.render())
      }
    })

    await this.loadData()
    await this.render()
  }

  async loadData () {
    try {
      const response = await fetch(this.endpoint)

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`)
      }

      this.data = await response.json()
    } catch (error) {
      console.error('Error loading data:', error)
      this.data = []
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
      
      h1, h2, h3, h4, h5, h6, p, a, ul, li, button {
        margin: 0;
      }

      ul{
        list-style:none;
      }

      svg{
        width: 2rem;
        cursor:pointer;
      }

      .table{
        display:flex;
        flex-direction:column;
        gap:0.6rem;
      }

      .filter-bar{
        background-color:red;
      }

      .filtered-users{
        display:flex;
        flex-direction:column;
        gap:3rem;
        width:100%;
        align-items:center;
      }

      .filtered-users-count{
        position:fixed;
        top:50rem;
        width:32%;
        background-color: red;
        height:3rem;
        padding:0.6rem;
        display:flex;
        align-items:center;
      }

      .filtered-user{
        width:80%
      }

      .filtered-user-content{
        background-color:yellow;
        width:100%;
        padding:0;
      }    

      .filtered-user-bar{
        display: flex;
        justify-content: flex-end;
        background-color:red;
        width:100%;
      }

      .filtered-user-content li, ul{
        padding:0.2rem;
      }  

      .table{
        min-height: 70vh;
        max-height: 70vh;
        overflow-y: scroll;
      }

     .table::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      .table::-webkit-scrollbar-thumb {
        background: hsl(271, 76%, 53%);
        border-radius: 4px;
      }

    </style>

    <section class="table">
      <div class="filter-bar">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M4.2673 6.24223C2.20553 4.40955 3.50184 1 6.26039 1H17.7396C20.4981 1 21.7945 4.40955 19.7327 6.24223L15.3356 10.1507C15.1221 10.3405 15 10.6125 15 10.8981V21.0858C15 22.8676 12.8457 23.7599 11.5858 22.5L9.58578 20.5C9.21071 20.1249 8.99999 19.6162 8.99999 19.0858V10.8981C8.99999 10.6125 8.87785 10.3405 8.66436 10.1507L4.2673 6.24223ZM6.26039 3C5.34088 3 4.90877 4.13652 5.59603 4.74741L9.99309 8.6559C10.6336 9.22521 11 10.0412 11 10.8981V19.0858L13 21.0858V10.8981C13 10.0412 13.3664 9.22521 14.0069 8.6559L18.404 4.74741C19.0912 4.13652 18.6591 3 17.7396 3H6.26039Z" fill="#0F0F0F"></path> </g></svg></h2>
      </div>
      <div class="filtered-users">
      
    
      <div class="filtered-users-count">
        <span>1 registro en total, mostrando 10 por página<span>
      </div>
    </section>

    
      `
    this.data.rows.forEach(element => {
      const elementsContainer = this.shadow.querySelector('.filtered-users')
      const elementContainer = document.createElement('div')
      elementContainer.classList.add('filtered-user')
      elementsContainer.appendChild(elementContainer)

      const barContainer = document.createElement('div')
      barContainer.classList.add('filtered-user-bar')
      elementContainer.appendChild(barContainer)

      const editButtonContainer = document.createElement('div')
      editButtonContainer.classList.add('edit-button')
      editButtonContainer.dataset.id = element.id
      barContainer.appendChild(editButtonContainer)

      editButtonContainer.innerHTML = `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8.29289 3.70711L1 11V15H5L12.2929 7.70711L8.29289 3.70711Z" fill="#000000">
      </path> <path d="M9.70711 2.29289L13.7071 6.29289L15.1716 4.82843C15.702 4.29799 16 3.57857 16 2.82843C16 1.26633 14.7337 0 13.1716 0C12.4214 0 11.702 0.297995 11.1716 0.828428L9.70711 2.29289Z"
      fill="#000000"></path> </g></svg>`

      const deleteButtonContainer = document.createElement('div')
      deleteButtonContainer.classList.add('delete-button')
      deleteButtonContainer.dataset.id = element.id
      barContainer.appendChild(deleteButtonContainer)

      deleteButtonContainer.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> 
      <path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> 
      <path d="M6 10L7.70141 19.3578C7.87432 20.3088 8.70258 21 9.66915 21H14.3308C15.2974 21 16.1257 20.3087 16.2986 19.3578L18 10" stroke="#000000" stroke-width="2" stroke-linecap="round" 
      stroke-linejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      </path> </g></svg>`

      const contentContainer = document.createElement('div')
      contentContainer.classList.add('filtered-user-content')
      elementContainer.appendChild(contentContainer)

      const contentUl = document.createElement('ul')
      contentContainer.appendChild(contentUl)

      const translations = {
        name: 'Nombre',
        email: 'Email',
        createdAt: 'Fecha de creación',
        updatedAt: 'Fecha de actualización'
      }

      Object.keys(element).forEach(key => {
        const contentLi = document.createElement('li')
        contentLi.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${element[key]}`
        contentUl.appendChild(contentLi)

        const label = translations[key] || key.charAt(0).toUpperCase() + key.slice(1)
        contentLi.textContent = `${label}: ${element[key]}`
      })
    })
    this.renderButtons()
  }

  renderButtons () {
    this.shadow.querySelector('.table').addEventListener('click', async event => {
      if (event.target.closest('.edit-button')) {
        const element = event.target.closest('.edit-button')
        const id = element.dataset.id
        const endpoint = `${this.endpoint}/${id}`

        try {
          const response = await fetch(endpoint)

          if (response.status === 500 || response.status === 404) {
            throw response
          }

          const data = await response.json()

          const formElement = {
            endPoint: this.endpoint,
            data
          }

          store.dispatch(showFormElement(formElement))
        } catch (error) {
          document.dispatchEvent(new CustomEvent('notice', {
            detail: {
              message: 'No se han podido recuperar el dato',
              type: 'error'
            }
          }))
        }
      }

      if (event.target.closest('.delete-button')) {
        const element = event.target.closest('.delete-button')
        const id = element.dataset.id

        document.dispatchEvent(new CustomEvent('showDeleteModal', {
          detail: {
            endpoint: this.endpoint,
            elementId: id,
          }
        }))
      }
    })
  }
}
customElements.define('users-table-component', UserTable)
