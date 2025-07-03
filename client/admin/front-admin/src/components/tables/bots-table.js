import { store } from '../../redux/store.js'
import { showFormElement } from '../../redux/crud-slice.js'

class BotTable extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = '/api/admin/bots'
    this.filterQuery = null
    this.unsubscribe = null
  }

  async connectedCallback () {
    this.unsubscribe = store.subscribe(() => {
      const currentState = store.getState()

      if (currentState.crud.filterQuery.query && currentState.crud.filterQuery.endPoint === this.endpoint) {
        this.filterQuery = currentState.crud.filterQuery.query
        const endpoint = `${this.endpoint}?${currentState.crud.filterQuery.query}`
        this.loadData(endpoint).then(() => this.render())
      }

      if (!currentState.crud.filterQuery.query && currentState.crud.tableEndpoint === this.endpoint) {
        this.loadData().then(() => this.render())
      }
    })

    await this.loadData()
    await this.render()
  }

  async loadData (customEndpoint = null) {
    try {
      const finalEndpoint = customEndpoint || this.endpoint
      const response = await fetch(finalEndpoint)

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
        font-family: "Nunito", sans-serif;
      }
      
      h1, h2, h3, h4, h5, h6, p, a, ul, li, button {
        margin: 0;
      }

      ul{
        list-style:none;
        padding: 0;
        margin: 0;
      }

      .table{
        display:flex;
        flex-direction:column;
        gap: 0.5rem;
      }

      .table-header{
        background-color: red;
      }

      .table-header svg{
        width: 2rem;
        cursor:pointer;
      }


      .table-body{
        display:flex;
        flex-direction:column;
        gap: 1rem;
        width:100%;
        align-items:center;
      }

      .table-body{
        min-height: 75vh;
        max-height: 75vh;
        overflow-y: auto;
      }

      .table-body::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      .table-body::-webkit-scrollbar-thumb {
        background: hsl(271, 76%, 53%);
        border-radius: 4px;
      }

      .table-register{
        width: 80%
      }

      .table-register-header{
        display: flex;
        justify-content: flex-end;
        background-color:red;
        width:100%;
      }

      .table-register-header svg{
        width: 2rem;
        cursor:pointer;
      }


      .table-register-body{
        background-color:yellow;
        width:100%;
        padding: 0.2rem;

      }    

      .table-register-body ul{
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }  

      .table-register-body li span{
        font-weight: 600;
      }

      .table-register-body li span::after{
        content: ':';
        font-weight: 600;
        margin-right: 0.2rem;
      }  
      
      .table-footer{
        background-color: red;
        padding: 0.5rem;
        align-items:center;
        display: flex;
        justify-content: space-between;
      }

      .pagination-bar-buttons{
        display:flex;
        align-items:center;
      }

      .pagination-bar-buttons svg{
        height: 1rem;
        width: 1rem;
      } 

      .pagination-button{
        cursor: pointer;
      }

      .pagination-button.disabled{
        cursor: not-allowed;
      }

      .pagination-bar-buttons .disabled svg path{
        fill:hsl(0, 0.00%, 56.90%);
      }

      .page-counter{
        font-size:1.5rem;
      }

      .tooltip {
        position: absolute;
        background-color: #4f46e5;
        color: #ffffff;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.875rem;
        white-space: nowrap;
        transform: translateY(-120%);
        margin-bottom: 0.25rem;
        opacity: 0;
        transition: opacity 0.2s ease;  
        z-index: 10;
      }

      .button {
        position: relative;
      }

      .button:hover .tooltip {
        opacity: 1;
      }

      .form-element-input input {
        border-radius: 2rem;
      }

    </style>

    <section class="table">
      <div class="table-header">
        <div class="filter-button">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M4.2673 6.24223C2.20553 4.40955 3.50184 1 6.26039 1H17.7396C20.4981 1 21.7945 4.40955 19.7327 6.24223L15.3356 10.1507C15.1221 10.3405 15 10.6125 15 10.8981V21.0858C15 22.8676 12.8457 23.7599 11.5858 22.5L9.58578 20.5C9.21071 20.1249 8.99999 19.6162 8.99999 19.0858V10.8981C8.99999 10.6125 8.87785 10.3405 8.66436 10.1507L4.2673 6.24223ZM6.26039 3C5.34088 3 4.90877 4.13652 5.59603 4.74741L9.99309 8.6559C10.6336 9.22521 11 10.0412 11 10.8981V19.0858L13 21.0858V10.8981C13 10.0412 13.3664 9.22521 14.0069 8.6559L18.404 4.74741C19.0912 4.13652 18.6591 3 17.7396 3H6.26039Z" fill="#0F0F0F"></path> </g></svg></h2>
        </div>
      </div>
      <div class="table-body"></div>   
      <div class="table-footer">
        <div class="table-count">
          <span>${this.data.meta.total} ${this.data.meta.total > 1 ? 'registros' : 'registro'}, mostrando ${this.data.meta.size} por página</span>
        </div>  
        <div class="pagination-bar-buttons">
          <div class="pagination-button first-page ${this.data.meta.currentPage === 1 ? 'disabled' : ''}" data-page="1">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12.7071 5.70711C13.0976 5.31658 13.0976 4.68342 12.7071 4.29289C12.3166 3.90237 11.6834 3.90237 11.2929 4.29289L4.29289 11.2929C4.10536 11.4804 4 11.7348 4 12C4 12.2652 4.10536 12.5196 4.29289 12.7071L11.2929 19.7071C11.6834 20.0976 12.3166 20.0976 12.7071 19.7071C13.0976 19.3166 13.0976 18.6834 12.7071 18.2929L6.41421 12L12.7071 5.70711ZM19.7071 5.70711C20.0976 5.31658 20.0976 4.68342 19.7071 4.29289C19.3166 3.90237 18.6834 3.90237 18.2929 4.29289L11.2929 11.2929C11.1054 11.4804 11 11.7348 11 12C11 12.2652 11.1054 12.5196 11.2929 12.7071L18.2929 19.7071C18.6834 20.0976 19.3166 20.0976 19.7071 19.7071C20.0976 19.3166 20.0976 18.6834 19.7071 18.2929L13.4142 12L19.7071 5.70711Z" fill="#000000"></path> </g></svg>
          </div>
          <div class="pagination-button previous-page  ${this.data.meta.currentPage === 1 ? 'disabled' : ''}" data-page="${this.data.meta.currentPage > 1 ? this.data.meta.currentPage - 1 : 1}">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M15.7071 4.29289C16.0976 4.68342 16.0976 5.31658 15.7071 5.70711L9.41421 12L15.7071 18.2929C16.0976 18.6834 16.0976 19.3166 15.7071 19.7071C15.3166 20.0976 14.6834 20.0976 14.2929 19.7071L7.29289 12.7071C7.10536 12.5196 7 12.2652 7 12C7 11.7348 7.10536 11.4804 7.29289 11.2929L14.2929 4.29289C14.6834 3.90237 15.3166 3.90237 15.7071 4.29289Z" fill="#000000"></path> </g></svg>
          </div>
          <div class="page-counter">
            <span>${this.data.meta.currentPage} de ${this.data.meta.pages}</span>
          </div>
          <div class="pagination-button next-page ${this.data.meta.currentPage === this.data.meta.pages ? 'disabled' : ''}"  data-page="${this.data.meta.currentPage < this.data.meta.pages ? this.data.meta.currentPage + 1 : this.data.meta.currentPage}">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M8.29289 4.29289C8.68342 3.90237 9.31658 3.90237 9.70711 4.29289L16.7071 11.2929C17.0976 11.6834 17.0976 12.3166 16.7071 12.7071L9.70711 19.7071C9.31658 20.0976 8.68342 20.0976 8.29289 19.7071C7.90237 19.3166 7.90237 18.6834 8.29289 18.2929L14.5858 12L8.29289 5.70711C7.90237 5.31658 7.90237 4.68342 8.29289 4.29289Z" fill="#000000"></path> </g></svg>
          </div>
          <div class="pagination-button last-page ${this.data.meta.currentPage === this.data.meta.pages ? 'disabled' : ''}" data-page="${this.data.meta.pages}">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.70711 4.29289C5.31658 3.90237 4.68342 3.90237 4.29289 4.29289C3.90237 4.68342 3.90237 5.31658 4.29289 5.70711L10.5858 12L4.29289 18.2929C3.90237 18.6834 3.90237 19.3166 4.29289 19.7071C4.68342 20.0976 5.31658 20.0976 5.70711 19.7071L12.7071 12.7071C13.0976 12.3166 13.0976 11.6834 12.7071 11.2929L5.70711 4.29289ZM12.7071 4.29289C12.3166 3.90237 11.6834 3.90237 11.2929 4.29289C10.9024 4.68342 10.9024 5.31658 11.2929 5.70711L17.5858 12L11.2929 18.2929C10.9024 18.6834 10.9024 19.3166 11.2929 19.7071C11.6834 20.0976 12.3166 20.0976 12.7071 19.7071L19.7071 12.7071C20.0976 12.3166 20.0976 11.6834 19.7071 11.2929L12.7071 4.29289Z" fill="#000000"></path> </g></svg>
          </div>
        </div>
      </div>
    </section>

    
      `
    this.data.rows.forEach(element => {
      const elementsContainer = this.shadow.querySelector('.table-body')
      const elementContainer = document.createElement('div')
      elementContainer.classList.add('table-register')
      elementsContainer.appendChild(elementContainer)

      const barContainer = document.createElement('div')
      barContainer.classList.add('table-register-header')
      elementContainer.appendChild(barContainer)

      const editButtonContainer = document.createElement('div')
      editButtonContainer.classList.add('edit-button', 'button')
      editButtonContainer.dataset.id = element.id
      barContainer.appendChild(editButtonContainer)

      editButtonContainer.innerHTML = `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8.29289 3.70711L1 11V15H5L12.2929 7.70711L8.29289 3.70711Z" fill="#000000">
      </path> <path d="M9.70711 2.29289L13.7071 6.29289L15.1716 4.82843C15.702 4.29799 16 3.57857 16 2.82843C16 1.26633 14.7337 0 13.1716 0C12.4214 0 11.702 0.297995 11.1716 0.828428L9.70711 2.29289Z"
      fill="#000000"></path> </g></svg>

      <span class="tooltip">Editar</span>`

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
      contentContainer.classList.add('table-register-body')
      elementContainer.appendChild(contentContainer)

      const contentUl = document.createElement('ul')
      contentContainer.appendChild(contentUl)

      const translations = {
        name: 'Nombre',
        platform: 'Plataforma',
        description: 'Descripción',
        createdAt: 'Fecha de creación',
        updatedAt: 'Fecha de actualización'
      }

      Object.keys(element).forEach(key => {
        const contentLi = document.createElement('li')
        contentLi.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${element[key]}`
        contentUl.appendChild(contentLi)
        contentLi.textContent = `${element[key]}`

        const contentSpan = document.createElement('span')
        contentLi.prepend(contentSpan)
        const label = translations[key] || key.charAt(0).toUpperCase() + key.slice(1)
        contentSpan.textContent = label
      })
    })
    this.renderButtons()
  }

  renderButtons () {
    this.shadow.querySelector('.table').addEventListener('click', async event => {
      if (event.target.closest('.filter-button')) {
        document.dispatchEvent(new CustomEvent('showBotFilter', {
          detail: {
            endpoint: this.endpoint
          }
        }))
      }

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

      if (event.target.closest('.pagination-button') && !event.target.closest('.pagination-button').classList.contains('disabled')) {
        const page = event.target.closest('.pagination-button').dataset.page
        let endpoint = `${this.endpoint}?page=${page}`

        if (this.filterQuery) {
          endpoint = `${endpoint}&${this.filterQuery}`
        }

        this.loadData(endpoint).then(() => this.render())
      }
    })
  }
}

customElements.define('bots-table-component', BotTable)
