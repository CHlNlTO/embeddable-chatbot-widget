(function(){"use strict";(()=>{const y="dental-chatbot-widget",f="https://02ef-158-62-6-36.ngrok-free.app",E=`
    #dental-chatbot-widget {
      position: fixed;
      bottom: 16px;
      right: 16px;
      width: 320px;
      max-width: 100%;
      border-radius: 8px 8px 0 0;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 2147483647;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      font-size: 14px;
      line-height: 1.5;
      transition: all 0.3s ease;
      background-color: white;
      height: 450px;
    }

    #dental-chatbot-widget.minimized {
      height: 48px !important;
    }

    .chatbot-header {
      background-color: #4F46E5;
      color: white;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      font-weight: bold;
    }

    .chatbot-toggle-button {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 0;
    }

    .chatbot-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      height: calc(100% - 48px);
    }

    #dental-chatbot-widget.minimized .chatbot-body {
      display: none;
    }

    .chatbot-messages {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background-color: #f9fafb;
    }

    .chatbot-message {
      max-width: 80%;
      padding: 10px;
      border-radius: 8px;
      margin-bottom: 8px;
      word-break: break-word;
    }

    .chatbot-message-user {
      align-self: flex-end;
      background-color: #4F46E5;
      color: white;
    }

    .chatbot-message-bot {
      align-self: flex-start;
      background-color: #f0f0f0;
      color: #333;
    }

    .chatbot-message-time {
      font-size: 10px;
      opacity: 0.7;
      margin-top: 4px;
      text-align: right;
    }

    .chatbot-input-area {
      display: flex;
      padding: 8px;
      border-top: 1px solid #e5e7eb;
      background-color: white;
    }

    .chatbot-input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      outline: none;
    }

    .chatbot-input:focus {
      border-color: #4F46E5;
      box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
    }

    .chatbot-send-button {
      margin-left: 8px;
      padding: 8px 16px;
      background-color: #4F46E5;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }

    .chatbot-send-button:hover {
      background-color: #4338CA;
    }

    .chatbot-send-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .chatbot-loading {
      display: flex;
      gap: 4px;
      padding: 8px;
      align-self: flex-start;
      background-color: #f0f0f0;
      border-radius: 8px;
    }

    .chatbot-loading-dot {
      width: 8px;
      height: 8px;
      background-color: #888;
      border-radius: 50%;
      opacity: 0.7;
    }

    .chatbot-loading-dot:nth-child(1) {
      animation: pulse 1.2s infinite;
    }

    .chatbot-loading-dot:nth-child(2) {
      animation: pulse 1.2s infinite 0.4s;
    }

    .chatbot-loading-dot:nth-child(3) {
      animation: pulse 1.2s infinite 0.8s;
    }

    @keyframes pulse {
      0% {
        transform: scale(0.5);
        opacity: 0.5;
      }
      50% {
        transform: scale(1);
        opacity: 1;
      }
      100% {
        transform: scale(0.5);
        opacity: 0.5;
      }
    }
  `,I=`
    <div class="chatbot-header">
      <span>Dental Support</span>
      <button class="chatbot-toggle-button" aria-label="Toggle chat widget">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>
    </div>
    <div class="chatbot-body">
      <div class="chatbot-messages" aria-live="polite"></div>
      <div class="chatbot-input-area">
        <input type="text" class="chatbot-input" placeholder="Type your message..." aria-label="Type your message">
        <button class="chatbot-send-button">Send</button>
      </div>
    </div>
  `,D=()=>{if(document.getElementById("dental-chatbot-styles"))return;const e=document.createElement("style");e.id="dental-chatbot-styles",e.textContent=E,document.head.appendChild(e)},C=()=>{const e=document.getElementById(y);if(e)return console.warn("Dental Chatbot Widget is already initialized"),e;const s=document.createElement("div");return s.id=y,s.innerHTML=I,s.setAttribute("aria-label","Dental Support Chat Widget"),document.body.appendChild(s),s},L=e=>{const s=e.querySelector(".chatbot-header"),M=e.querySelector(".chatbot-toggle-button"),g=e.querySelector(".chatbot-messages"),m=e.querySelector(".chatbot-input"),d=e.querySelector(".chatbot-send-button");let i=localStorage.getItem("chatbot-minimized")==="true";const u=localStorage.getItem("chatbot-user-id")||crypto.randomUUID();let n=[],l=!1;localStorage.setItem("chatbot-user-id",u);const x=()=>{M.innerHTML=i?'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>':'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>'},b=()=>{i=!i,e.classList.toggle("minimized",i),localStorage.setItem("chatbot-minimized",i.toString()),x()},c=t=>{const o=document.createElement("div");o.classList.add("chatbot-message",`chatbot-message-${t.sender}`);const a=t.timestamp instanceof Date?t.timestamp:new Date(t.timestamp);o.innerHTML=`
        <div class="chatbot-message-content">${t.text}</div>
        <div class="chatbot-message-time">${a.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</div>
      `,g.appendChild(o),g.scrollTop=g.scrollHeight},h=()=>{localStorage.setItem("chatbot-messages",JSON.stringify(n))},v=()=>{const t=document.createElement("div");return t.classList.add("chatbot-message","chatbot-message-bot","chatbot-loading"),t.innerHTML=`
        <div class="chatbot-loading-dot"></div>
        <div class="chatbot-loading-dot"></div>
        <div class="chatbot-loading-dot"></div>
      `,g.appendChild(t),g.scrollTop=g.scrollHeight,t},w=t=>{t&&t.parentNode&&t.parentNode.removeChild(t)},k=async t=>{if(!t.trim()||l)return;const o={id:crypto.randomUUID(),sender:"user",text:t.trim(),timestamp:new Date};c(o),n.push(o),h(),m.value="",l=!0,d.disabled=!0;const a=v();try{const r=await fetch(`${f}/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:u,message:o.text,domain:window.location.hostname||"unknown"})});if(w(a),l=!1,d.disabled=!1,!r.ok)throw new Error(`API responded with status ${r.status}`);const p=await r.json(),S={id:p.id||crypto.randomUUID(),sender:"bot",text:p.text,timestamp:p.timestamp?new Date(p.timestamp):new Date};c(S),n.push(S),h()}catch(r){w(a),l=!1,d.disabled=!1,console.error("Error sending message:",r);const p={id:crypto.randomUUID(),sender:"bot",text:"Sorry, I encountered an error. Please try again later.",timestamp:new Date};c(p),n.push(p),h()}},T=t=>{t.key==="Enter"&&k(m.value)},U=async()=>{e.classList.toggle("minimized",i),x();try{const t=await fetch(`${f}/history/${u}`);if(t.ok){const o=await t.json();if(o.messages&&o.messages.length>0){n=o.messages.map(a=>({...a,timestamp:new Date(a.timestamp)})),n.forEach(c),h();return}}}catch(t){console.warn("Failed to fetch chat history from API:",t)}try{const t=localStorage.getItem("chatbot-messages");if(t){const o=JSON.parse(t);if(Array.isArray(o)&&o.length>0){n=o.map(a=>({...a,timestamp:new Date(a.timestamp)})),n.forEach(c);return}}}catch(t){console.warn("Failed to load saved messages:",t)}try{l=!0,d.disabled=!0;const t=v(),o=await fetch(`${f}/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:u,message:"hello",domain:window.location.hostname||"unknown"})});if(w(t),l=!1,d.disabled=!1,o.ok){const a=await o.json(),r={id:a.id||crypto.randomUUID(),sender:"bot",text:a.text,timestamp:a.timestamp?new Date(a.timestamp):new Date};c(r),n.push(r),h()}else throw new Error(`API responded with status ${o.status}`)}catch(t){console.error("Error getting initial greeting:",t),l=!1,d.disabled=!1;const o={id:crypto.randomUUID(),sender:"bot",text:`Hello! How can I help you today? You're visiting from ${window.location.hostname||"an unknown domain"}.`,timestamp:new Date};c(o),n.push(o),h()}};return s.addEventListener("click",b),d.addEventListener("click",()=>k(m.value)),m.addEventListener("keydown",T),U(),{open:()=>{i&&b()},close:()=>{i||b()},toggle:b,isOpen:()=>!i}};(e=>{document.readyState==="complete"||document.readyState==="interactive"?setTimeout(e,1):document.addEventListener("DOMContentLoaded",e)})(()=>{try{D();const e=C();if(e){const s=L(e);window.ChatbotWidget=s}}catch(e){console.error("Error initializing Dental Chatbot Widget:",e)}})})()})();
//# sourceMappingURL=embed.js.map
