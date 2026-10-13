# 🧠 AI Voice Assistant – Gemini Powered (React App)

A smart, voice-interactive assistant built using **React**, **Vite**, and the **Web Speech API**, designed to capture spoken commands, generate intelligent responses using the Gemini API, and respond back via voice. Includes authentication, personalization, and a chat-style interface.

---

## 🚀 Features

* 🎤 Voice-to-text command input using Web Speech API
* 🧠 Gemini AI integration for intelligent, context-aware responses
* 🗣️ Text-to-speech output using SpeechSynthesis API
* 👤 Auth-protected routes and logout feature
* 🎨 Assistant image/name customization
* 📱 Fully responsive with mobile menu and transitions
* 💬 Dynamic chat-like conversation history display
* 📂 Persists chat history in the database (MongoDB)

---

## 🛠️ Tech Stack

| Layer       | Tech Used                                  |
| ----------- | ------------------------------------------ |
| Frontend    | React.js, Vite, Tailwind CSS, React Router |
| Voice Input | Web Speech API (SpeechRecognition)         |
| AI Backend  | Gemini API (via Axios calls)               |
| Auth        | Express.js & Cookies (assumed backend)     |
| State Mgmt  | React Context API                          |
| DB          | MongoDB                                    |

---

## ⚙️ Vite + React Tooling

This project uses **Vite** for fast build and development setup.

### 🔌 Supported Plugins

* [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) — Uses [Babel](https://babeljs.io) for Fast Refresh.
* [`@vitejs/plugin-react-swc`](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) — Uses [SWC](https://swc.rs) for even faster refresh.

### 🔧 ESLint Setup

We recommend using TypeScript with type-aware lint rules. Refer to:

* [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts)
* [`typescript-eslint`](https://typescript-eslint.io)

---

## 📁 Folder Structure

```
src/
├── assets/              # Assistant and user GIFs
├── context/
│   └── UserContext.js   # Context for user data & API logic
├── pages/
│   └── Home.jsx         # Voice assistant main logic & UI
├── App.jsx              # Route definitions
└── main.jsx             # App entry point
```

---

## 🧑‍💻 Getting Started

### 1. Clone the repo

```bash
git https://github.com/Jaiprakash12321/Virtual-AI-Voice-Assistant.git

```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file in the root directory:

```
VITE_SERVER_URL=http://localhost:5000
```

### 4. Run the app

```bash
npm run dev
```

---

## 💡 How It Works

1. User logs in → assistant greets them.
2. User taps the microphone → audio converted to text.
3. Gemini API is called with that text.
4. AI response is shown and read out loud.
5. Interaction history is maintained in the UI and DB.
6. Assistant stops speaking when user interrupts.

---

## 🖼️ UI Highlights

* 🎭 Avatar + name of assistant
* 💬 Left-right aligned chat bubbles
* ⟳ Mic state toggle (listen/speak)
* 📱 Responsive design with mobile-friendly navigation
* ⚙️ Customize assistant and logout from side drawer

---

## 🔮 Future Improvements

* Wake word detection ("Hey Assistant")
* Multilingual support
* Rich media (images, cards, links) in AI responses
* Admin config panel for assistant control

Voice interation flow diagram
![image](https://github.com/user-attachments/assets/71644386-130a-4741-afe2-7d9e9597bd74)


