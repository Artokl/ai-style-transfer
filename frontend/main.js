(() => {
  const API_URL = "https://ai-style-transfer.artemokleev.workers.dev/generate";
  const DEMO_PREVIEW_URL = "./demo/demo_preview_with_dividers.png";
  const DEFAULT_RATIO = 3 / 4;

  const stylesList = [
    {
      id: "anime",
      name: "Anime",
      short: "Bold lines, expressive face",
      badge: "Popular",
      emoji: "✨",
      image: "./styles/anime.webp",
      fallback: "linear-gradient(135deg, #fce7f3 0%, #ffffff 50%, #ede9fe 100%)",
    },
    {
      id: "cartoon3d",
      name: "3D Cartoon",
      short: "Soft lighting, cute 3D look",
      badge: "Trending",
      emoji: "🧸",
      image: "./styles/3d-cartoon.webp",
      fallback: "linear-gradient(135deg, #fef3c7 0%, #ffffff 50%, #ffedd5 100%)",
    },
    {
      id: "ghibli",
      name: "Ghibli Mood",
      short: "Dreamy colors, soft painted feel",
      badge: "Loved",
      emoji: "🌿",
      image: "./styles/ghibli.webp",
      fallback: "linear-gradient(135deg, #d1fae5 0%, #ffffff 50%, #e0f2fe 100%)",
    },
    {
      id: "cyberpunk",
      name: "Cyberpunk",
      short: "Neon, night city, sci-fi vibe",
      badge: "Neon",
      emoji: "🌃",
      image: "./styles/cyberpunk.webp",
      fallback: "linear-gradient(135deg, #fae8ff 0%, #ffffff 50%, #cffafe 100%)",
    },
    {
      id: "cinematic",
      name: "Cinematic",
      short: "Photographic, premium realism",
      badge: "Pro",
      emoji: "🎬",
      image: "./styles/cinematic.webp",
      fallback: "linear-gradient(135deg, #f1f5f9 0%, #ffffff 50%, #f4f4f5 100%)",
    },
    {
      id: "oil",
      name: "Oil Painting",
      short: "Classic brush texture",
      badge: "Art",
      emoji: "🖼️",
      image: "./styles/oil.webp",
      fallback: "linear-gradient(135deg, #fef9c3 0%, #ffffff 50%, #fed7aa 100%)",
    },
  ];

  const featureCards = [
    {
      eyebrow: "Top picks",
      title: "6 popular styles",
      text: "The strongest visual directions users instantly understand and want to try first.",
      icon: "🎨",
      shell: "linear-gradient(180deg,#f5efff 0%,#efe7ff 100%)",
      border: "#d9c7ff",
      shadow: "0 14px 36px rgba(107,33,168,0.14)",
      badgeBg: "rgba(255,255,255,.8)",
      badgeColor: "#6d28d9",
      titleColor: "#4c1d95",
      textColor: "#5b4b87",
      orb: "rgba(139,92,246,.18)",
    },
    {
      eyebrow: "Fast flow",
      title: "One-click workflow",
      text: "Upload, choose a visual style card, generate, then download or copy in seconds.",
      icon: "⚡",
      shell: "linear-gradient(180deg,#eef4ff 0%,#e7eeff 100%)",
      border: "#c6d4ff",
      shadow: "0 14px 36px rgba(59,130,246,0.14)",
      badgeBg: "rgba(255,255,255,.8)",
      badgeColor: "#1d4ed8",
      titleColor: "#1e3a8a",
      textColor: "#4b5c87",
      orb: "rgba(96,165,250,.18)",
    },
    {
      eyebrow: "Backend magic",
      title: "Prompt-powered styles",
      text: "Prompts live on the backend, and extra instructions are applied there.",
      icon: "🚀",
      shell: "linear-gradient(180deg,#fff1f7 0%,#ffe8f3 100%)",
      border: "#ffc9df",
      shadow: "0 14px 36px rgba(236,72,153,0.14)",
      badgeBg: "rgba(255,255,255,.8)",
      badgeColor: "#be185d",
      titleColor: "#9d174d",
      textColor: "#7f4b68",
      orb: "rgba(244,114,182,.18)",
    },
  ];

  const icons = {
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v11"/><path d="M8 10l4 4 4-4"/><path d="M4 20h16"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="10" height="10" rx="2"/><path d="M5 15V7a2 2 0 0 1 2-2h8"/></svg>',
    open: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 5h5v5"/><path d="M10 14L19 5"/><path d="M19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>',
    sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z"/><path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z"/><path d="M5 14l.8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    "upload-large": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4"/><path d="M8 8l4-4 4 4"/><path d="M4 20h16"/></svg>',
  };

  const state = {
    file: null,
    preview: null,
    result: null,
    styleId: "cartoon3d",
    extra: "",
    loading: false,
    imageRatio: DEFAULT_RATIO,
    demoRatio: 3 / 2,
    toastTimer: null,
  };

  const el = {
    fileInput: document.getElementById("file-input"),
    uploadEmpty: document.getElementById("upload-empty"),
    uploadStage: document.getElementById("upload-stage"),
    uploadFrame: document.getElementById("upload-frame"),
    uploadPreview: document.getElementById("upload-preview"),
    stylesGrid: document.getElementById("styles-grid"),
    stylesCount: document.getElementById("styles-count"),
    selectedStyleName: document.getElementById("selected-style-name"),
    statusBadge: document.getElementById("status-badge"),
    resultShell: document.getElementById("result-shell"),
    loadingView: document.getElementById("loading-view"),
    loadingText: document.getElementById("loading-text"),
    resultFrame: document.getElementById("result-frame"),
    resultStage: document.getElementById("result-stage"),
    resultImage: document.getElementById("result-image"),
    downloadBtn: document.getElementById("download-btn"),
    copyBtn: document.getElementById("copy-btn"),
    openBtn: document.getElementById("open-btn"),
    featureGrid: document.getElementById("feature-grid"),
    extraInput: document.getElementById("extra-input"),
    generateBtn: document.getElementById("generate-btn"),
    generateLabel: document.getElementById("generate-label"),
    resetTop: document.getElementById("reset-top"),
    resetBottom: document.getElementById("reset-bottom"),
  };

  function applyIcons() {
    document.querySelectorAll("[data-icon]").forEach((node) => {
      const name = node.getAttribute("data-icon");
      if (icons[name]) node.innerHTML = icons[name];
    });
  }

  function getSelectedStyle() {
    return stylesList.find((item) => item.id === state.styleId) || stylesList[0];
  }

  function getImageRatio(width, height) {
    if (!width || !height) return DEFAULT_RATIO;
    return width / height;
  }

  function updateAspectRatio(frame, ratio) {
    frame.style.aspectRatio = String(ratio);
  }

  function revokePreview() {
    if (state.preview) {
      URL.revokeObjectURL(state.preview);
      state.preview = null;
    }
  }

  function showToast(message) {
    const existing = document.querySelector(".toast");
    if (existing) existing.remove();
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(() => toast.remove(), 2200);
  }

  function renderFeatures() {
    el.featureGrid.innerHTML = "";
    featureCards.forEach((item) => {
      const card = document.createElement("article");
      card.className = "feature-card";
      card.style.background = item.shell;
      card.style.borderColor = item.border;
      card.style.boxShadow = item.shadow;
      card.innerHTML = `
        <div class="feature-card__orb" style="background:${item.orb}"></div>
        <div class="feature-card__shine"></div>
        <div class="feature-card__content">
          <div class="feature-card__top">
            <span class="feature-card__icon" style="background:${item.badgeBg};color:${item.badgeColor};border:1px solid rgba(255,255,255,.8);box-shadow:0 1px 2px rgba(0,0,0,.06);">${item.icon}</span>
            <span class="feature-card__eyebrow">${item.eyebrow}</span>
          </div>
          <h3 class="feature-card__title" style="color:${item.titleColor};">${item.title}</h3>
          <p class="feature-card__text" style="color:${item.textColor};">${item.text}</p>
        </div>
      `;
      el.featureGrid.appendChild(card);
    });
  }

  function makeFallback(item) {
    return `
      <div class="style-card__fallback" style="background:${item.fallback}">
        <div class="style-card__fallback-emoji">${item.emoji}</div>
        <div class="style-card__fallback-title">${item.name}</div>
        <div class="style-card__fallback-text">${item.short}</div>
      </div>
    `;
  }

  function renderStyles() {
    el.stylesCount.textContent = String(stylesList.length);
    el.stylesGrid.innerHTML = "";

    stylesList.forEach((item) => {
      const active = item.id === state.styleId;
      const button = document.createElement("button");
      button.type = "button";
      button.className = `style-card${active ? " is-active" : ""}`;
      button.innerHTML = `
        <div class="style-card__media">
          <img src="${item.image}" alt="${item.name}" loading="lazy" />
          <div class="style-card__overlay"></div>
          <span class="style-card__badge">${item.badge}</span>
          ${active ? `<span class="style-card__check">${icons.check}</span>` : ""}
          <div class="style-card__copy">
            <div class="style-card__title">${item.name}</div>
            <div class="style-card__subtitle">${item.short}</div>
          </div>
        </div>
      `;

      const image = button.querySelector("img");
      image.addEventListener("error", () => {
        image.replaceWith(document.createRange().createContextualFragment(makeFallback(item)));
      });

      button.addEventListener("click", () => {
        state.styleId = item.id;
        renderStyles();
        render();
      });
      el.stylesGrid.appendChild(button);
    });
  }

  function updateUploadView() {
    const hasPreview = Boolean(state.preview);
    el.uploadEmpty.classList.toggle("hidden", hasPreview);
    el.uploadStage.classList.toggle("hidden", !hasPreview);
    el.resetTop.classList.toggle("hidden", !hasPreview);

    if (hasPreview) {
      el.uploadPreview.src = state.preview;
      updateAspectRatio(el.uploadFrame, state.imageRatio);
    } else {
      el.uploadPreview.removeAttribute("src");
      updateAspectRatio(el.uploadFrame, DEFAULT_RATIO);
    }
  }

  function updateResultView() {
    const selectedStyle = getSelectedStyle();
    const hasResult = Boolean(state.result);
    el.selectedStyleName.textContent = selectedStyle.name;
    el.generateLabel.textContent = state.loading ? "Generating..." : `Generate ${selectedStyle.name}`;
    el.loadingText.textContent = `Generating ${selectedStyle.name}...`;

    el.statusBadge.className = "status-badge";
    el.resultShell.classList.remove("demo-mode");
    el.loadingView.classList.toggle("hidden", !state.loading);
    el.resultStage.classList.toggle("hidden", state.loading);

    if (state.loading) {
      el.statusBadge.textContent = "Generating";
      el.statusBadge.classList.add("is-loading");
      el.resultShell.style.aspectRatio = String(state.imageRatio);
      return;
    }

    if (hasResult) {
      el.statusBadge.textContent = "Ready";
      el.statusBadge.classList.add("is-ready");
      el.resultImage.src = state.result;
      el.resultImage.alt = "Generated result";
      el.resultImage.classList.remove("stage__img--contain");
      updateAspectRatio(el.resultFrame, state.imageRatio);
      el.resultShell.style.height = "";
    } else {
      el.statusBadge.textContent = "Demo";
      el.resultShell.classList.add("demo-mode");
      el.resultImage.src = DEMO_PREVIEW_URL;
      el.resultImage.alt = "Demo preview";
      el.resultImage.classList.add("stage__img--contain");
      updateAspectRatio(el.resultFrame, state.demoRatio);
      el.resultShell.style.aspectRatio = String(state.demoRatio);
    }

    const enabled = hasResult;
    el.downloadBtn.disabled = !enabled;
    el.copyBtn.disabled = !enabled;
    el.openBtn.disabled = !enabled;
    el.generateBtn.disabled = state.loading;
  }

  function render() {
    updateUploadView();
    updateResultView();
    el.extraInput.value = state.extra;
  }

  function readImageDimensions(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(getImageRatio(img.width, img.height));
      img.onerror = () => resolve(DEFAULT_RATIO);
      img.src = src;
    });
  }

  async function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleFileChange(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    revokePreview();
    state.file = file;
    state.preview = URL.createObjectURL(file);
    state.imageRatio = await readImageDimensions(state.preview);
    state.result = null;
    render();
  }

  function resetAll() {
    revokePreview();
    state.file = null;
    state.result = null;
    state.extra = "";
    state.loading = false;
    state.imageRatio = DEFAULT_RATIO;
    el.fileInput.value = "";
    render();
  }

  async function generate() {
    if (!state.file) {
      showToast("Upload image");
      return;
    }

    state.loading = true;
    render();

    try {
      const base64 = await toBase64(state.file);
      const selectedStyle = getSelectedStyle();
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: base64,
          style_id: selectedStyle.id,
          extra: state.extra.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data || !data.image_url) {
        showToast((data && data.error) || "Ошибка генерации");
        return;
      }
      state.result = data.image_url;
    } catch (error) {
      console.error(error);
      showToast("Ошибка");
    } finally {
      state.loading = false;
      render();
    }
  }

  async function downloadResult() {
    if (!state.result) return;
    try {
      const response = await fetch(state.result);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `style-${getSelectedStyle().id}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      showToast("Не удалось скачать изображение");
    }
  }

  async function copyResult() {
    if (!state.result) return;
    try {
      const response = await fetch(state.result);
      const blob = await response.blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      showToast("Изображение скопировано");
    } catch (error) {
      console.error(error);
      showToast("Не удалось скопировать изображение");
    }
  }

  function openResult() {
    if (!state.result) return;
    window.open(state.result, "_blank", "noopener,noreferrer");
  }

  function bindEvents() {
    el.fileInput.addEventListener("change", handleFileChange);
    el.extraInput.addEventListener("input", (event) => {
      state.extra = event.target.value;
    });
    el.generateBtn.addEventListener("click", generate);
    el.downloadBtn.addEventListener("click", downloadResult);
    el.copyBtn.addEventListener("click", copyResult);
    el.openBtn.addEventListener("click", openResult);
    el.resetTop.addEventListener("click", resetAll);
    el.resetBottom.addEventListener("click", resetAll);

    window.addEventListener("beforeunload", () => {
      revokePreview();
    });
  }

  function initDemoRatio() {
    const img = new Image();
    img.onload = () => {
      if (img.width && img.height) {
        state.demoRatio = img.width / img.height;
        if (!state.result) render();
      }
    };
    img.src = DEMO_PREVIEW_URL;
  }

  applyIcons();
  renderFeatures();
  renderStyles();
  bindEvents();
  initDemoRatio();
  render();
})();
