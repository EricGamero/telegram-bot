class ChatBot extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.data = []
    this.threadId = null                      // 👈 guardamos el hilo
    this.endpoint = '/api/customer/chats'
    this.loading = false
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

    const autoResize = (el) => {
      el.style.height = 'auto'
      el.style.height = Math.min(el.scrollHeight, 140) + 'px'
    }
    input.addEventListener('input', () => autoResize(input))
    autoResize(input)

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        form.requestSubmit()
      }
    })

    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const text = input.value.trim()
      if (!text || this.loading) return
      input.value = ''
      autoResize(input)
      this.pushMessage('user', text)
      await this.askAssistant(text)            // 👈 llamar al backend
    })

    toggle?.addEventListener('click', () => {
      this.toggleAttribute('collapsed')
    })
  }

  async askAssistant (prompt) {
    // “escribiendo…”
    const typingEl = this.pushMessage('assistant', '…')
    typingEl.classList.add('typing')

    this.loading = true
    try {
      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, threadId: this.threadId })
      })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }

      const data = await res.json()
      // Esperamos { threadId, answer }
      this.threadId = data.threadId || this.threadId

      // “answer” puede venir como string o como objeto/array; normalizamos a string
      let text = ''
      if (typeof data.answer === 'string') {
        text = data.answer
      } else if (Array.isArray(data.answer)) {
        text = data.answer.map(x => (x?.text || x?.content || '')).join('\n')
      } else if (data.answer && typeof data.answer === 'object') {
        text = data.answer.text || data.answer.content || JSON.stringify(data.answer)
      } else {
        text = '⚠️ No pude leer la respuesta del assistant.'
      }

      typingEl.textContent = text
      typingEl.classList.remove('typing')
      this.scrollToBottom()
    } catch (err) {
      typingEl.textContent = '⚠️ Error al conectar con el servidor.'
      typingEl.classList.remove('typing')
      console.error(err)
    } finally {
      this.loading = false
    }
  }

  pushMessage (role, content) {
    const list = this.shadow.querySelector('.msgs')
    if (!list) return
    const div = document.createElement('div')
    div.className = `msg ${role === 'user' ? 'me' : 'bot'}`
    div.textContent = content
    list.appendChild(div)
    this.scrollToBottom()
    return div
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
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
        }

        :host([fixed="false"]) {
          position: static;
          bottom: auto;
          right: auto;
        }

        /* ===========================
          Panel
          =========================== */
        .panel {
          display: flex;
          flex-direction: column;
          width: 340px;
          max-height: 70vh;
          overflow: hidden;
          border: 1px solid #eee;
          border-radius: 16px;
          background: #fff;
          box-shadow: 0 18px 40px rgba(0, 0, 0, .18);
        }

        /* ===========================
          Header
          =========================== */
        .head {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          font-weight: 700;
          font-size: 14px;
          color: #fff;
          background: #111;
        }

        .head .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
        }

        button.toggle {
          margin-left: auto;
          border: 0;
          background: transparent;
          cursor: pointer;
          font-size: 16px;
          line-height: 1;
          color: #fff;
          transform: rotate(0deg);
          transition: transform .2s ease;
        }

        :host([collapsed]) button.toggle {
          transform: rotate(180deg);
        }

        /* ===========================
          Body
          =========================== */
        .body {
          display: flex;           /* contenedor flex para msgs + form */
          flex-direction: column;
          min-height: 0;           /* permite que .msgs pueda encoger para scroll */
        }

        :host([collapsed]) .body {
          display: none;
        }

        /* ===========================
          Messages list
          =========================== */
        .msgs {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
          min-height: 0;           /* necesario para que el contenedor flex haga scroll */
          padding: 12px;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
        }

        .msg {
          max-width: 85%;
          padding: 8px 10px;
          border-radius: 12px;
          line-height: 1.35;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .me {
          align-self: flex-end;
          background: #e7f1ff;
        }

        .bot {
          align-self: flex-start;
          background: #f4f4f5;
        }

        .typing {
          opacity: 0.7;
        }

        /* ===========================
          Form
          =========================== */
        form.chat {
          display: flex;
          gap: 8px;
          padding: 10px;
          border-top: 1px solid #eee;
          background: #fafafa;
        }

        textarea.msg {
          flex: 1;
          min-height: 38px;
          max-height: 140px;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.35;
          outline: none;
          resize: none;
          overflow-y: auto;
        }

        textarea.msg:focus {
          border-color: #999;
        }

        button.send {
          padding: 10px 14px;
          border: 0;
          border-radius: 12px;
          background: #111;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
        }

        /* ===========================
          Responsive
          =========================== */
        @media (max-width: 480px) {
          :host {
            bottom: 10px;
            right: 10px;
          }

          .panel {
            width: calc(100vw - 20px);
            max-height: 55vh;
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
