# Dentalflo AI Chatbot Widget - Setup Guide

## Prerequisites

- Node.js v22.14.0 (check .nvmrc)
- npm or pnpm

## Quick Setup

1. **Clone the repository**
   git clone [https://github.com/CHlNlTO/embeddable-chatbot-widget.git](https://github.com/CHlNlTO/embeddable-chatbot-widget.git)
   cd dentalflo-chatbot-widget

2. **Install dependencies**
   npm install

# or with pnpm

pnpm install

3. **Build the embed script**
   npm run build:embed

4. **Start development server**
   npm run dev

5. **Access the application**

- Main demo: http://localhost:5173/
- Widget page: http://localhost:5173/widget?assistantId=4a30d4a1-b7c9-47f7-a20b-18ba750f265b

## Production Build

npm run build
npm run preview

The embed script can be included on any website with:

<script src="https://embeddable-chatbot-widget.vercel.app/embed.js?assistantId=YOUR_ASSISTANT_ID"></script>
