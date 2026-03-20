# 🎨 AI Style Transfer

Turn your photos into stunning AI-generated artworks in seconds.

Upload an image, choose a visual style, and generate a polished transformation powered by AI.

---

## ✨ Features

* 🖼️ Upload your own images
* 🎭 Multiple visual styles (Anime, Cartoon, Cyberpunk, etc.)
* ⚡ Fast generation via AI API
* 🔐 Secure backend (API keys hidden via Cloudflare Worker)
* 💾 Download, copy, or open generated images
* 🚫 No signup required

---

## 🧠 How it works

1. Upload an image
2. Select a style
3. Click **Generate**
4. Get your AI-transformed result

---

## 🏗️ Architecture

```
Frontend (HTML/CSS/JS)
        ↓
Cloudflare Worker (proxy + security)
        ↓
AI API (fal.ai)
```

* **Frontend** — handles UI and user interaction
* **Worker** — hides API keys and forwards requests
* **AI API** — generates styled images

---

## 🔐 Security

* API key is **never exposed to the client**
* All requests go through **Cloudflare Worker**
* Keys are stored in **environment variables**

---

## 🛠 Tech Stack

* HTML / CSS / JavaScript
* Cloudflare Workers
* fal.ai API

---

## 🚀 Getting Started

### Run locally

```bash
cd frontend
npx serve
```

or simply open:

```
frontend/index.html
```

---

## 🌐 Deployment

* Frontend can be hosted on:

  * GitHub Pages
  * Webflow (via Embed)
  * Any static hosting

* Backend runs on:

  * Cloudflare Workers

---

## 📁 Project Structure

```
frontend/   # UI (static)
worker/     # backend (Cloudflare Worker)
```

---

## 💡 Future Improvements

* User accounts
* History of generations
* More styles & presets
* Image storage
* Mobile optimization

---

## 👨‍💻 Author

Built as a practical AI web application project.


* или наоборот **максимально формальный для сдачи**
* или добавить **скриншоты + бейджи (очень круто смотрится на GitHub)**
