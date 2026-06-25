const CAL_STORAGE_KEY = "cal_v4";
const CAL_THEME_IDS = ["pink", "blue", "green", "yellow", "beige"];
const CAL_DEFAULT_THEME = "pink";

function loadCalSettings() {
  try {
    const raw = localStorage.getItem(CAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function resolveThemeId(theme) {
  return CAL_THEME_IDS.includes(theme) ? theme : CAL_DEFAULT_THEME;
}

function applyDocumentTheme(settings) {
  const saved = settings || loadCalSettings();
  const theme = resolveThemeId(saved.theme);
  const root = document.documentElement;
  const body = document.body;

  CAL_THEME_IDS.forEach((id) => {
    root.classList.remove("theme-" + id);
    if (body) body.classList.remove("theme-" + id);
  });

  root.classList.add("theme-" + theme);
  if (body) body.classList.add("theme-" + theme);

  const font = saved.font || "'Noto Sans JP',sans-serif";
  root.style.setProperty("--font", font);
  if (body) body.style.setProperty("--font", font);
}

function bindStorageSync() {
  window.addEventListener("storage", (e) => {
    if (e.key === CAL_STORAGE_KEY) applyDocumentTheme();
  });
}

function initDocumentThemeIfNeeded() {
  if (document.getElementById("app")) return;
  applyDocumentTheme();
  bindStorageSync();
}

if (document.body && !document.getElementById("app")) {
  initDocumentThemeIfNeeded();
} else if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDocumentThemeIfNeeded);
} else {
  initDocumentThemeIfNeeded();
}
