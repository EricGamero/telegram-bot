class SubscriptionForm extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.data = [];
  }

  async connectedCallback() {
    await this.loadData();
    await this.render();
  }

  loadData() {
    this.data = {};
  }

  async render() {
    this.shadow.innerHTML = 
    /*html*/

      `
      <style>
        
      </style>
     
      `
      
      
      
      ;
  }
}

customElements.define("subscription-form-component", SubscriptionForm);
