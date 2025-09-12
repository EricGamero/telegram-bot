class ChatBot extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.data = []
  }

  connectedCallback () {
    this.render()
    this.pushMessage('assistant', '¡Hola! ¿En qué puedo ayudarte?')
    this.bindEvents()
  }

  bindEvents () {
    const form = this.shadow.querySelector('form.chat')
    const input = this.shadow.querySelector('textarea.msg')
    const toggle = this.shadow.querySelector('button.toggle')
    if (!form || !input) return

    // Auto-resize del textarea
    const autoResize = (el) => {
      el.style.height = 'auto'
      el.style.height = Math.min(el.scrollHeight, 140) + 'px' // tope = max-height del CSS
    }
    input.addEventListener('input', () => autoResize(input))
    autoResize(input)

    // Enter envía / Shift+Enter nueva línea
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        form.requestSubmit()
      }
    })

    // Envío del mensaje
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const text = input.value.trim()
      if (!text) return
      input.value = ''
      autoResize(input)
      this.pushMessage('user', text)
    })

    // Minimizar / expandir
    toggle?.addEventListener('click', () => {
      this.toggleAttribute('collapsed')
    })
  }

  pushMessage (role, content) {
    const list = this.shadow.querySelector('.msgs')
    if (!list) return
    const div = document.createElement('div')
    div.className = `msg ${role === 'user' ? 'me' : 'bot'}`
    div.textContent = content
    list.appendChild(div)
    this.scrollToBottom()
  }

  scrollToBottom () {
    const wrap = this.shadow.querySelector('.msgs')
    if (!wrap) return
    requestAnimationFrame(() => {
      wrap.scrollTop = wrap.scrollHeight - wrap.clientHeight
    })
  }

  render () {
    this.shadow.innerHTML = /* html */`
      <style>
        :host {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 2147483647;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
        }

        :host([fixed="false"]) {
          position: static;
          bottom: auto;
          right: auto;
        }

        /* Panel base */
        .panel {
          width: 340px;
          max-height: 70vh;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 18px 40px rgba(0, 0, 0, .18);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #eee;
        }

        /* Cabecera */
        .head {
          padding: 10px 12px;
          font-weight: 700;
          font-size: 14px;
          background: #111;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .head .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
        }

        /* Botón minimizar (opcional) */
        button.toggle {
          margin-left: auto;
          border: 0;
          background: transparent;
          cursor: pointer;
          font-size: 16px;
          line-height: 1;
          transform: rotate(0deg);
          transition: transform .2s ease;
          color: #fff;
        }

        :host([collapsed]) button.toggle {
          transform: rotate(180deg);
        }

        /* Cuerpo (msgs + form) */
        .body {
          display: flex;            /* clave: convierte el body en contenedor flex */
          flex-direction: column;
          min-height: 0;            /* clave: permite que .msgs pueda encoger para scrollear */
        }
        :host([collapsed]) .body {
          display: none;
        }

        /* Mensajes */
        .msgs {
          flex: 1;                   /* clave: ocupa el espacio sobrante para scrollear */
          min-height: 0;             /* clave: permite que el flex hijo haga scroll */
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          overflow: auto;            /* aquí vive el scroll */
          -webkit-overflow-scrolling: touch;
        }

        .msg {
          border-radius: 12px;
          padding: 8px 10px;
          max-width: 85%;
          line-height: 1.35;
          word-wrap: break-word;
          white-space: pre-wrap;
        }

        .me  { align-self: flex-end;  background: #e7f1ff; }
        .bot { align-self: flex-start; background: #f4f4f5; }

        /* Formulario */
        form.chat {
          display: flex;
          gap: 8px;
          padding: 10px;
          border-top: 1px solid #eee;
          background: #fafafa;
        }

        textarea.msg {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 12px;
          font-size: 14px;
          outline: none;
          resize: none;
          min-height: 38px;
          max-height: 140px;
          overflow-y: auto;
          line-height: 1.35;
        }
        textarea.msg:focus { border-color: #999; }

        button.send {
          padding: 10px 14px;
          border-radius: 12px;
          border: 0;
          background: #111;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
        }

        /* Responsive */
        @media (max-width: 480px) {
          :host { bottom: 10px; right: 10px; }
          .panel { width: calc(100vw - 20px); max-height: 55vh; }
        }

      </style>

      <div class="panel" role="dialog" aria-label="Chat">
        <div class="head">
          <span class="dot" aria-hidden="true"></span>
          Atención al cliente
          <button class="toggle" aria-label="Minimizar" title="Minimizar">⌄</button>
        </div>

        <div class="body">
          <div class="msgs" aria-live="polite" aria-atomic="false"></div>
          <form class="chat">
            <textarea class="msg" placeholder="Escribe tu mensaje…" rows="1"></textarea>
            <button class="send" type="submit">Enviar</button>
          </form>
        </div>
      </div>
    `
  }
}

customElements.define('chat-bot-component', ChatBot)
