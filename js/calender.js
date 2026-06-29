  const THEMES = [
    {
      id: "pink",
      label: "ピンク",
      bg: "#f4e7e7",
      calbg:
        "linear-gradient(-135deg, #e8b5b4 0%, #f4e7e7 45%, #f4e7e7 55%, #e8b5b4 100%)",
      tx: "#5A4A4A",
      acc: "#e28687",
      btn: "#e8b5b4",
    },
    {
      id: "blue",
      label: "ブルー",
      bg: "#e3ecef",
      calbg:
        "linear-gradient(-135deg, #b4c8d8 0%, #e3ecef 45%, #e3ecef 55%, #b4c8d8 100%)",
      tx: "#3a4856",
      acc: "#6b8e9e",
      btn: "#b4c8d8",
    },
    {
      id: "green",
      label: "グリーン",
      bg: "#e6ebe5",
      calbg:
        "linear-gradient(-135deg, #b4c8b0 0%, #e6ebe5 45%, #e6ebe5 55%, #b4c8b0 100%)",
      tx: "#434A42",
      acc: "#768f72",
      btn: "#b4c8b0",
    },
    {
      id: "yellow",
      label: "イエロー",
      bg: "#fbf6e4",
      calbg:
        "linear-gradient(-135deg, #f0d88a 0%, #fbf6e4 45%, #fbf6e4 55%, #f0d88a 100%)",
      tx: "#524e42",
      acc: "#ba8c20",
      btn: "#f0d88a",
    },
    {
      id: "beige",
      label: "ベージュ",
      bg: "#efe8dd",
      calbg:
        "linear-gradient(-135deg, #d8c8b8 0%, #efe8dd 45%, #efe8dd 55%, #d8c8b8 100%)",
      tx: "#5a5048",
      acc: "#8a7060",
      btn: "#d8c8b8",
    },
  ];
  const DOTS = [
    { id: "orange", label: "オレンジ", hex: "#E28743" },
    { id: "pink", label: "ピンク", hex: "#D4799A" },
    { id: "blue", label: "ブルー", hex: "#6B8E9E" },
    { id: "green", label: "グリーン", hex: "#768F72" },
    { id: "purple", label: "パープル", hex: "#9B7BB8" },
    { id: "brown", label: "ブラウン", hex: "#77684d" },
    { id: "none", label: "なし", hex: "transparent" },
  ];
  const MARKS = [
    { id: "dot", char: "●", label: "丸" },
    { id: "star", char: "★", label: "星" },
    { id: "note", char: "♪", label: "音符" },
    { id: "heart", char: "◆", label: "四角" },
    { id: "cross", char: "×", label: "バツ" },
  ];
  const CHIPS = [
    "CLOSE",
    "OPEN",
    "LESSON",
    "WORKSHOP",
    "EVENT",
    "休",
    "営業日",
    "レッスン",
    "貸切",
    "イベント",
    "自由入力",
  ];
  const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let S = {
    theme: "pink",
    font: "'Noto Sans JP',sans-serif",
    chip: "CLOSE",
    customText: "",
    dot: "orange",
    mark: "dot",
    bulkDow: [],
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    days: {},
    imgSize: "feed",
    logoText: "",
    logoText02: "",
    accountText: "",
  };

  const save = () => {
    try {
      localStorage.setItem("cal_v4", JSON.stringify(S));
    } catch (e) {}
  };
  const th = () => THEMES.find((t) => t.id === S.theme) || THEMES[0];
  const dot = () => DOTS.find((d) => d.id === S.dot) || DOTS[0];
  const mark = () => MARKS.find((m) => m.id === S.mark) || MARKS[0];
  const markChar = (id) => (MARKS.find((m) => m.id === id) || MARKS[0]).char;
  const hasDayMark = (data) =>
    data && data.dotHex && data.dotHex !== "transparent";

  function applyTheme() {
    if (!THEMES.some((t) => t.id === S.theme)) S.theme = THEMES[0].id;
    const app = document.getElementById("app");
    app.className = "app theme-" + S.theme;
    if (typeof applyDocumentTheme === "function") {
      applyDocumentTheme({ theme: S.theme, font: S.font });
    } else {
      document.documentElement.style.setProperty("--font", S.font);
      document.body.style.setProperty("--font", S.font);
    }
  }

  function renderTheme() {
    document.getElementById("themeRow").innerHTML = THEMES.map(
      (t) => `
      <div class="theme-btn-wrap" onclick="setTheme('${t.id}')">
        <div class="theme-btn${S.theme === t.id ? " active" : ""}" style="background:${t.btn}"></div>
        <span class="theme-name">${t.label}</span>
      </div>`,
    ).join("");
  }
  const setTheme = (id) => {
    S.theme = id;
    applyTheme();
    renderTheme();
    save();
  };

  function renderChips() {
    document.getElementById("chipRow").innerHTML = CHIPS.map(
      (c) => `
      <button class="chip${S.chip === c ? " active" : ""}" onclick="setChip('${c}')">${c}</button>`,
    ).join("");
    const ci = document.getElementById("customInput");
    ci.style.display = S.chip === "自由入力" ? "block" : "none";
    ci.value = S.customText;
  }
  const setChip = (c) => {
    S.chip = c;
    renderChips();
    updateSel();
    save();
  };

  function renderMarks() {
    document.getElementById("markRow").innerHTML = MARKS.map(
      (m) => `
      <button type="button" class="mark-btn${S.mark === m.id ? " active" : ""}" onclick="setMark('${m.id}')" title="${m.label}">${m.char}</button>`,
    ).join("");
  }
  const setMark = (id) => {
    S.mark = id;
    renderMarks();
    updateSel();
    save();
  };

  function renderDots() {
    document.getElementById("dotRow").innerHTML = DOTS.map(
      (d) => `
      <div class="dot-btn${S.dot === d.id ? " active" : ""}"
        style="background:${d.hex === "transparent" ? "linear-gradient(135deg,#fff 45%,#ccc 45%)" : d.hex};border-color:${S.dot === d.id ? "var(--tx)" : "transparent"}"
        onclick="setDot('${d.id}')" title="${d.label}"></div>`,
    ).join("");
  }
  const setDot = (id) => {
    S.dot = id;
    renderDots();
    updateSel();
    save();
  };

  function updateSel() {
    const d = dot();
    const m = mark();
    const txt = S.chip === "自由入力" ? S.customText || "（未入力）" : S.chip;
    const selEl = document.getElementById("selDot");
    if (m.id === "dot") {
      selEl.textContent = "";
      selEl.style.background = d.hex === "transparent" ? "#ccc" : d.hex;
      selEl.style.borderRadius = "50%";
      selEl.style.width = "1em";
      selEl.style.height = "1em";
      selEl.style.fontSize = "";
      selEl.style.color = "";
    } else {
      selEl.textContent = m.char;
      selEl.style.background = "transparent";
      selEl.style.borderRadius = "0";
      selEl.style.width = "auto";
      selEl.style.height = "auto";
      selEl.style.fontSize = "1.2em";
      selEl.style.color = d.hex === "transparent" ? "#ccc" : d.hex;
    }
    document.getElementById("selText").innerHTML = `<b>${txt}</b>`;
  }

  function getFooterLines() {
    return [S.logoText, S.logoText02, S.accountText]
      .map((line) => (line || "").trim())
      .filter(Boolean);
  }

  function renderCalFooter() {
    const el = document.getElementById("calFooter");
    if (!el) return;
    el.replaceChildren();
    const lines = getFooterLines();
    lines.forEach((line) => {
      const p = document.createElement("p");
      p.className = "cal-footer-line";
      p.textContent = line;
      el.appendChild(p);
    });
    el.hidden = lines.length === 0;
  }

  function renderBulk() {
    document.getElementById("bulkRow").innerHTML = DOW.map(
      (d, i) => `
      <button class="bulk-dow-btn${S.bulkDow.includes(i) ? " active" : ""}" onclick="toggleBulk(${i})">${d}</button>`,
    ).join("");
  }
  function toggleBulk(i) {
    const idx = S.bulkDow.indexOf(i);
    if (idx >= 0) S.bulkDow.splice(idx, 1);
    else S.bulkDow.push(i);
    renderBulk();
    save();
  }
  function applyBulk() {
    if (!S.bulkDow.length) {
      alert("曜日を選択してください");
      return;
    }
    const d = dot();
    const txt = S.chip === "自由入力" ? S.customText : S.chip;
    const total = new Date(S.year, S.month + 1, 0).getDate();
    for (let day = 1; day <= total; day++) {
      const dow = new Date(S.year, S.month, day).getDay();
      if (S.bulkDow.includes(dow)) {
        S.days[`${S.year}-${S.month}-${day}`] = {
          label: txt,
          dotHex: d.hex,
          markId: S.mark,
        };
      }
    }
    renderCalendar();
    save();
  }
  function clearBulk() {
    if (!S.bulkDow.length) {
      alert("曜日を選択してください");
      return;
    }
    const total = new Date(S.year, S.month + 1, 0).getDate();
    for (let day = 1; day <= total; day++) {
      if (S.bulkDow.includes(new Date(S.year, S.month, day).getDay())) {
        delete S.days[`${S.year}-${S.month}-${day}`];
      }
    }
    renderCalendar();
    save();
  }

  function renderCalendar() {
    const y = S.year,
      m = S.month;
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    document.querySelector("#calMonth .year").textContent = y;
    document.querySelector("#calMonth .month-num").textContent = m + 1;
    document.querySelector("#calMonth .month-name").textContent = monthNames[m];

    const grid = document.getElementById("calGrid");
    grid.innerHTML = "";
    DOW.forEach((d, i) => {
      const el = document.createElement("div");
      el.className = "cal-dow" + (i === 0 ? " sun" : i === 6 ? " sat" : "");
      el.textContent = d;
      grid.appendChild(el);
    });
    const first = new Date(y, m, 1).getDay();
    const total = new Date(y, m + 1, 0).getDate();
    for (let i = 0; i < first; i++) {
      const e = document.createElement("div");
      e.className = "cal-day empty";
      grid.appendChild(e);
    }
    for (let d = 1; d <= total; d++) {
      const dow = new Date(y, m, d).getDay();
      const key = `${y}-${m}-${d}`;
      const data = S.days[key];
      const el = document.createElement("div");
      el.className =
        "cal-day" +
        (dow === 0 ? " is-sun" : dow === 6 ? " is-sat" : "") +
        (data ? " has-content" : "");

      // 日付番号
      const num = document.createElement("div");
      num.className = "d-num";
      num.textContent = d;
      el.appendChild(num);

      if (data) {
        if (hasDayMark(data)) {
          const markEl = document.createElement("div");
          markEl.className = "d-mark";
          markEl.style.color = data.dotHex;
          markEl.textContent = markChar(data.markId || "dot");
          el.appendChild(markEl);
        }
        // ラベル（コントラスト重視、中央揃え）
        if (data.label) {
          const lbl = document.createElement("div");
          lbl.className = "d-label";
          lbl.textContent = data.label;
          el.appendChild(lbl);
        }
      }
      el.onclick = () => {
        if (S.days[key]) delete S.days[key];
        else {
          const d2 = dot();
          const txt = S.chip === "自由入力" ? S.customText : S.chip;
          S.days[key] = { label: txt, dotHex: d2.hex, markId: S.mark };
        }
        renderCalendar();
        save();
      };
      grid.appendChild(el);
    }
  }

  function changeMonth(dir) {
    // 現在の月のデータを「前回スナップショット」として保存
    try {
      localStorage.setItem(
        "cal_prev_month",
        JSON.stringify({
          year: S.year,
          month: S.month,
          days: JSON.parse(JSON.stringify(S.days)),
        }),
      );
    } catch (e) {}

    S.month += dir;
    if (S.month < 0) {
      S.month = 11;
      S.year--;
    }
    if (S.month > 11) {
      S.month = 0;
      S.year++;
    }

    renderCalendar();
    save();
  }

  const setSize = (s, btn) => {
    S.imgSize = s;
    document
      .querySelectorAll(".size-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    save();
  };

  function restoreData() {
    try {
      const s = localStorage.getItem("cal_prev_month");
      if (!s) {
        alert(
          "前回のカレンダーデータがありません。\n◀▶ ボタンで月を移動すると前回データが保存されます。",
        );
        return;
      }
      const prev = JSON.parse(s);
      const mn = [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
      ];
      if (
        !confirm(
          `${prev.year}年${mn[prev.month]}のカレンダー内容を現在の月（${S.year}年${mn[S.month]}）に引き継ぎますか？\n※ ${mn[S.month]}の同日付のみ上書きされます。他の月のデータは残ります。`,
        )
      )
        return;

      // 前回月の days キーを現在の年月に付け替えてマージ（他の月のデータは保持）
      Object.keys(prev.days).forEach((key) => {
        const parts = key.split("-");
        const keyYear = parseInt(parts[0], 10);
        const keyMonth = parseInt(parts[1], 10);
        const day = parts[2];
        // スナップショット元の月のデータのみ引き継ぐ
        if (keyYear !== prev.year || keyMonth !== prev.month) return;
        const maxDay = new Date(S.year, S.month + 1, 0).getDate();
        if (parseInt(day, 10) <= maxDay) {
          S.days[`${S.year}-${S.month}-${day}`] = { ...prev.days[key] };
        }
      });
      renderCalendar();
      save();
      alert(`${prev.year}年${mn[prev.month]}の内容を引き継ぎました！`);
    } catch (e) {
      alert("復元に失敗しました");
    }
  }

  /* ---- CANVAS EXPORT ---- */
  function roundRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  function roundRect(ctx, x, y, w, h, r) {
    roundRectPath(ctx, x, y, w, h, r);
    ctx.fill();
  }

  function getThemeCssColors() {
    const app = document.getElementById("app");
    const styles = app ? getComputedStyle(app) : null;
    return {
      bdr: styles?.getPropertyValue("--bdr").trim() || "#e8b5b4",
      surf: styles?.getPropertyValue("--surf").trim() || "#fff8f8",
    };
  }

  function cssDegGradientEndpoints(deg, x, y, w, h) {
    const rad = ((deg - 90) * Math.PI) / 180;
    const cx = x + w / 2;
    const cy = y + h / 2;
    const len = Math.abs(w * Math.cos(rad)) + Math.abs(h * Math.sin(rad));
    return {
      x0: cx - (Math.cos(rad) * len) / 2,
      y0: cy - (Math.sin(rad) * len) / 2,
      x1: cx + (Math.cos(rad) * len) / 2,
      y1: cy + (Math.sin(rad) * len) / 2,
    };
  }

  function fillCssLinearGradient(ctx, x, y, w, h, gradientCss) {
    const m = gradientCss.match(
      /linear-gradient\(\s*(-?\d+(?:\.\d+)?)deg\s*,(.+)\)/i,
    );
    if (!m) {
      ctx.fillStyle = gradientCss;
      ctx.fillRect(x, y, w, h);
      return;
    }
    const deg = parseFloat(m[1]);
    const stops = [];
    const re = /(#[0-9a-fA-F]{3,8})\s+(\d+(?:\.\d+)?)%/g;
    let sm;
    while ((sm = re.exec(m[2]))) {
      stops.push({ color: sm[1], pos: parseFloat(sm[2]) / 100 });
    }
    const { x0, y0, x1, y1 } = cssDegGradientEndpoints(deg, x, y, w, h);
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    stops.forEach((s) => g.addColorStop(s.pos, s.color));
    ctx.fillStyle = g;
    ctx.fillRect(x, y, w, h);
  }

  function drawBlurredCircle(ctx, cx, cy, radius, color, blur, opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.filter = `blur(${blur}px)`;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  /** .cal-wrap 相当 — グラデーション・::before/::after 装飾・白枠・影 */
  function drawCalWrapCard(ctx, x, y, w, h, r, t, surf, bdr, scale) {
    ctx.save();
    ctx.shadowColor = "rgba(3, 3, 3, 0.3)";
    ctx.shadowBlur = Math.max(1, Math.round(4 * scale));
    ctx.shadowOffsetY = Math.max(1, Math.round(1 * scale));
    roundRectPath(ctx, x, y, w, h, r);
    ctx.fillStyle = "rgba(0,0,0,0.01)";
    ctx.fill();
    ctx.restore();

    ctx.save();
    roundRectPath(ctx, x, y, w, h, r);
    ctx.clip();
    fillCssLinearGradient(ctx, x, y, w, h, t.calbg);
    const decoOffset = Math.round(40 * scale);
    const rBefore = w * 0.21; // ::before 直径 = 横幅 42%
    const rAfter = w * 0.25; // ::after 直径 = 横幅 35%
    // .cal-wrap::after — 左上（var(--surf) / opacity 0.4）
    drawBlurredCircle(
      ctx,
      x + rAfter - decoOffset,
      y + rAfter - decoOffset,
      rAfter,
      surf,
      Math.round(8 * scale),
      0.4,
    );
    // .cal-wrap::before — 右下（var(--bdr) / opacity 0.8）
    drawBlurredCircle(
      ctx,
      x + w - rBefore * 0.86 + decoOffset,
      y + h - rBefore * 0.86 + decoOffset,
      rBefore,
      bdr,
      Math.round(8 * scale),
      0.4,
    );
    ctx.restore();

    ctx.save();
    roundRectPath(ctx, x, y, w, h, r);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = Math.max(1, Math.round(2 * scale));
    ctx.stroke();
    ctx.restore();
  }

  function drawDayMark(ctx, cx, y, markId, color, dotR, fb) {
    ctx.save();
    const id = markId || "dot";
    if (id === "dot") {
      ctx.beginPath();
      ctx.arc(cx, y + dotR, dotR, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
      return;
    }
    const fsz = Math.round(dotR * 2.2);
    ctx.font = `700 ${fsz}px ${fb}`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(markChar(id), cx, y + dotR);
    ctx.restore();
  }

  function drawCalendarToCanvas(canvas, W, H, tszBase) {
    const t = th();
    const { bdr, surf } = getThemeCssColors();
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    const fb = S.font.replace(/'/g, "");
    const scale = W / 1080; // 1080基準。Instagram用サイズはscale=1のまま変化なし
    const first = new Date(S.year, S.month, 1).getDay();
    const total = new Date(S.year, S.month + 1, 0).getDate();
    const numRows = Math.ceil((first + total) / 7);
    const wrapMarginX = Math.round(16 * scale);
    const wrapPaddingX = Math.round(8 * scale);
    const wrapPaddingY = Math.round(16 * scale); // 上下内側余白（HTMLの padding 8px の約2倍）
    const wrapRadius = Math.round(8 * scale);
    const pad = wrapMarginX + wrapPaddingX;

    // タイトル（年・月・月名 ― 画面の .cal-month と同じ構成・配色）
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const titleNumFsz = Math.round(tszBase * scale); // .month-num（最大要素）
    const sideFsz = Math.round(titleNumFsz * (35 / 68)); // .year / .month-name
    const titleGap = Math.round(8 * scale); // .month-num { margin: 0 8px }
    const titleTop = Math.round(50 * scale);
    const y0 = titleTop + titleNumFsz + Math.round(52 * scale);
    const colW = (W - pad * 2) / 7;
    const dowH = colW * 0.52;
    const availH = H - y0 - Math.round(90 * scale);
    const rowH = (availH - dowH) / 5.8;
    const wrapTop = titleTop - wrapPaddingY;
    const wrapBottom = y0 + dowH + numRows * rowH + wrapPaddingY;
    const wrapX = wrapMarginX;
    const wrapW = W - wrapMarginX * 2;
    const wrapH = wrapBottom - wrapTop;

    ctx.fillStyle = t.bg;
    ctx.fillRect(0, 0, W, H);
    drawCalWrapCard(
      ctx,
      wrapX,
      wrapTop,
      wrapW,
      wrapH,
      wrapRadius,
      t,
      surf,
      bdr,
      scale,
    );

    const yearTxt = String(S.year);
    const monthNumTxt = String(S.month + 1);
    const monthNameTxt = monthNames[S.month];

    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = `400 ${sideFsz}px ${fb}`;
    const yearW = ctx.measureText(yearTxt).width;
    ctx.font = `700 ${titleNumFsz}px ${fb}`;
    const numW = ctx.measureText(monthNumTxt).width;
    ctx.font = `400 ${sideFsz}px ${fb}`;
    const nameW = ctx.measureText(monthNameTxt).width;

    const titleY = titleTop + Math.round(titleNumFsz / 2);
    let tx = W / 2 - (yearW + titleGap + numW + titleGap + nameW) / 2;

    ctx.fillStyle = t.tx;
    ctx.font = `400 ${sideFsz}px ${fb}`;
    ctx.fillText(yearTxt, tx, titleY);
    tx += yearW + titleGap;

    ctx.fillStyle = t.acc;
    ctx.font = `700 ${titleNumFsz}px ${fb}`;
    ctx.fillText(monthNumTxt, tx, titleY);
    tx += numW + titleGap;

    ctx.fillStyle = t.tx;
    ctx.font = `400 ${sideFsz}px ${fb}`;
    ctx.fillText(monthNameTxt, tx, titleY);

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    const dotR = Math.round(colW * 0.1);
    const numDotGap = Math.round(10 * scale); // 日付数字と●の間隔
    const numFsz = Math.round(colW * 0.18);
    const cellR = Math.round(10 * scale);

    // 曜日ヘッダ
    ctx.font = `700 ${Math.round(colW * 0.28)}px ${fb}`;
    DOW.forEach((lb, i) => {
      ctx.fillStyle = i === 0 ? "#a87c7c" : i === 6 ? "#7c8ba8" : t.tx + "99";
      ctx.textAlign = "center";
      ctx.fillText(lb, pad + i * colW + colW / 2, y0 + Math.round(colW * 0.3));
    });

    for (let d = 1; d <= total; d++) {
      const idx = first + d - 1;
      const col = idx % 7,
        row = Math.floor(idx / 7);
      const dow = new Date(S.year, S.month, d).getDay();
      const cx = pad + col * colW + colW / 2;
      const cellX = pad + col * colW + 3;
      const cellY = y0 + dowH + row * rowH + 3;
      const cellW = colW - 6,
        cellH = rowH - 6;
      const key = `${S.year}-${S.month}-${d}`;
      const data = S.days[key];

      // セル背景
      ctx.fillStyle = data ? "rgba(255, 255, 255, 0.35)" : t.acc + "25";
      roundRect(ctx, cellX, cellY, cellW, cellH, cellR);

      // セル中央 Y（数字・ドット・ラベルをまとめて中央揃え）
      const hasDot = hasDayMark(data);
      const hasLabel = data && data.label;
      const len = hasLabel ? data.label.length : 0;
      const lsz =
        len <= 2
          ? Math.round(colW * 0.21)
          : len <= 5
            ? Math.round(colW * 0.19)
            : Math.round(colW * 0.14);
      const lineH = lsz * 1.3;

      // ブロック高さ計算
      let blockH = numFsz;
      if (hasDot) blockH += dotR * 2 + numDotGap;
      if (hasLabel) blockH += lineH + 3;
      const startY = cellY + cellH / 2 - blockH / 2;

      // 日付番号
      ctx.font = `600 ${numFsz}px ${fb}`;
      ctx.textAlign = "center";
      ctx.fillStyle = dow === 0 ? "#a87c7c" : dow === 6 ? "#7c8ba8" : t.tx;
      ctx.fillText(d, cx, startY + numFsz);

      if (data) {
        let curY = startY + numFsz + numDotGap;
        // ドット
        if (hasDot) {
          drawDayMark(ctx, cx, curY, data.markId, data.dotHex, dotR, fb);
          curY += dotR * 2 + 5;
        }
        // ラベル
        if (hasLabel) {
          ctx.font = `600 ${lsz}px ${fb}`;
          ctx.fillStyle = t.tx;
          ctx.textAlign = "center";
          // 折り返し
          const maxW = cellW - 8;
          const chars = [...data.label];
          let line = "",
            lines = [];
          for (const ch of chars) {
            if (ctx.measureText(line + ch).width > maxW && line) {
              lines.push(line);
              line = ch;
            } else line += ch;
          }
          if (line) lines.push(line);
          lines.forEach((ln, li) =>
            ctx.fillText(ln, cx, curY + lsz + li * lineH),
          );
        }
      }
    }

    // ロゴ・店名・営業時間・アカウント（空行は非表示）
    const footerLines = getFooterLines();
    const bottomMargin = Math.round(52 * scale);
    const lineGap = Math.round(38 * scale);
    const footerFsz = Math.round(W * 0.027);
    ctx.font = `400 ${footerFsz}px ${fb}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = t.tx + "80";
    footerLines.forEach((line, i) => {
      // 最下行（accountText）を下余白に合わせ、上の行を順に積む
      const linesFromBottom = footerLines.length - 1 - i;
      ctx.fillText(line, W / 2, H - bottomMargin - linesFromBottom * lineGap);
    });
  }

  let printBlobUrl = null;

  const PRINT_A4_W_MM = 210;
  const PRINT_A4_H_MM = 297;
  const PRINT_MARGIN_MM = 14;
  const IOS_PRINT_FUDGE = 0.94;

  function fitPrintImageLayout(img) {
    const pxPerMm = 96 / 25.4;
    const maxW =
      (PRINT_A4_W_MM - PRINT_MARGIN_MM * 2) * pxPerMm * IOS_PRINT_FUDGE;
    const maxH =
      (PRINT_A4_H_MM - PRINT_MARGIN_MM * 2) * pxPerMm * IOS_PRINT_FUDGE;
    const ratio = img.naturalWidth / img.naturalHeight;
    let w = maxW;
    let h = w / ratio;
    if (h > maxH) {
      h = maxH;
      w = h * ratio;
    }
    w = Math.round(w);
    h = Math.round(h);
    img.width = w;
    img.height = h;
    img.style.display = "block";
    img.style.width = `${w}px`;
    img.style.height = `${h}px`;
    img.style.margin = "0 auto";
    img.style.objectFit = "contain";
  }

  function getPrintCanvasSize() {
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    if (isMobile) {
      return [1240, 1754, 120];
    }
    return [2480, 3508, 151];
  }

  function shouldUseIframePrint() {
    const ua = navigator.userAgent;
    return (
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
  }

  function printViaIframe(src) {
    const iframe = document.createElement("iframe");
    iframe.setAttribute(
      "style",
      "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;",
    );
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`<!DOCTYPE html>
  <html lang="ja">
  <head>
  <meta charset="utf-8">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    @page { size: A4 portrait; margin: 0; }
    html, body {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      overflow: hidden;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      display: flex;
      align-items: center;
      justify-content: center;
      page-break-after: avoid;
    }
    img {
      display: block;
      page-break-before: avoid;
      page-break-after: avoid;
      page-break-inside: avoid;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  </style>
  </head>
  <body>
  <img id="p" alt="カレンダー印刷用画像">
  </body>
  </html>`);
    doc.close();

    const img = doc.getElementById("p");
    const win = iframe.contentWindow;
    const cleanup = () => {
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    };

    const runPrint = () => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          win.focus();
          win.print();
          setTimeout(cleanup, 2000);
        }, 200);
      });
    };

    img.onerror = () => {
      alert("印刷用画像の生成に失敗しました。時間をおいて再度お試しください。");
      cleanup();
    };
    let ready = false;
    const onReady = () => {
      if (ready) return;
      ready = true;
      fitPrintImageLayout(img);
      runPrint();
    };
    img.onload = onReady;
    img.src = src;
    if (img.complete && img.naturalWidth > 0) onReady();
  }

  function setPrintImgAndPrint(src) {
    if (shouldUseIframePrint()) {
      printViaIframe(src);
      return;
    }

    const img = document.getElementById("printImg");
    const runPrint = () => {
      requestAnimationFrame(() => {
        setTimeout(() => window.print(), 150);
      });
    };
    const done = () => {
      img.onload = null;
      fitPrintImageLayout(img);
      if (typeof img.decode === "function") {
        img.decode().then(runPrint).catch(runPrint);
      } else {
        runPrint();
      }
    };
    img.onerror = () => {
      alert("印刷用画像の生成に失敗しました。時間をおいて再度お試しください。");
    };
    img.onload = done;
    img.src = src;
    if (img.complete && img.naturalWidth > 0) done();
  }

  function setExportImgFromCanvas(canvas, exportImg) {
    exportImg.src = canvas.toDataURL("image/png");
    exportImg.alt = "生成されたカレンダー画像";
  }

  function closeModal() {
    document.getElementById("modalBg").classList.remove("open");
    document.body.style.overflow = "";
  }

  function exportImage() {
    const modalBg = document.getElementById("modalBg");
    const exportImg = document.getElementById("exportImg");
    modalBg.classList.add("open");
    document.body.style.overflow = "hidden";
    exportImg.removeAttribute("src");
    exportImg.alt = "画像を生成しています…";

    requestAnimationFrame(() => {
      try {
        const sizes = {
          story: [1080, 1920],
          feed: [1080, 1350],
          sq: [1080, 1080],
        };
        const [W, H] = sizes[S.imgSize];
        const tszBase = S.imgSize === "story" ? 166 : 137;
        const canvas = document.createElement("canvas");
        drawCalendarToCanvas(canvas, W, H, tszBase);
        setExportImgFromCanvas(canvas, exportImg);
      } catch (err) {
        closeModal();
        alert("画像の生成に失敗しました。時間をおいて再度お試しください。");
      }
    });
  }

  function printCalendar() {
    const [W, H, tszBase] = getPrintCanvasSize();
    try {
      const canvas = document.createElement("canvas");
      drawCalendarToCanvas(canvas, W, H, tszBase);
      if (printBlobUrl) {
        URL.revokeObjectURL(printBlobUrl);
        printBlobUrl = null;
      }
      if (typeof canvas.toBlob === "function") {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              printBlobUrl = URL.createObjectURL(blob);
              setPrintImgAndPrint(printBlobUrl);
              return;
            }
            setPrintImgAndPrint(canvas.toDataURL("image/png"));
          },
          "image/png",
          1,
        );
        return;
      }
      setPrintImgAndPrint(canvas.toDataURL("image/png"));
    } catch (err) {
      alert("印刷用画像の生成に失敗しました。時間をおいて再度お試しください。");
    }
  }

  function renderAll() {
    applyTheme();
    if (!MARKS.some((m) => m.id === S.mark)) S.mark = MARKS[0].id;
    renderTheme();
    renderChips();
    renderMarks();
    renderDots();
    renderBulk();
    renderCalendar();
    updateSel();
    document.getElementById("fontSel").value = S.font;
    document.getElementById("logoText").value = S.logoText || "";
    document.getElementById("logoText02").value = S.logoText02 || "";
    document.getElementById("accountText").value = S.accountText || "";
    renderCalFooter();
    document
      .querySelectorAll(".size-btn")
      .forEach((b) => b.classList.toggle("active", b.dataset.size === S.imgSize));
  }

  try {
    const s = localStorage.getItem("cal_v4");
    if (s) Object.assign(S, JSON.parse(s));
  } catch (e) {}

  document.getElementById("fontSel").addEventListener("change", (e) => {
    S.font = e.target.value;
    applyTheme();
    save();
  });
  document.getElementById("customInput").addEventListener("input", (e) => {
    S.customText = e.target.value.slice(0, 6);
    e.target.value = S.customText;
    updateSel();
    save();
  });
  document.getElementById("logoText").addEventListener("input", (e) => {
    S.logoText = e.target.value;
    renderCalFooter();
    save();
  });
  document.getElementById("logoText02").addEventListener("input", (e) => {
    S.logoText02 = e.target.value;
    renderCalFooter();
    save();
  });
  document.getElementById("accountText").addEventListener("input", (e) => {
    S.accountText = e.target.value;
    renderCalFooter();
    save();
  });

  renderAll();
