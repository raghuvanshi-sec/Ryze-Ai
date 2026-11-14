(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const styles = document.createElement("style");
  styles.textContent = `
    .ryze-dialog-backdrop{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:20px;background:rgba(28,27,24,.48);backdrop-filter:blur(5px)}
    .ryze-dialog{position:relative;width:min(100%,440px);padding:32px;border-radius:20px;background:#fbf8f1;color:#24231f;box-shadow:0 24px 80px rgba(0,0,0,.22)}
    .ryze-dialog h2{margin:0 36px 12px 0;font:700 clamp(25px,5vw,34px)/1.1 'Manrope',sans-serif;letter-spacing:-.04em}
    .ryze-dialog p{margin:0 0 22px;color:#656158;line-height:1.65}
    .ryze-dialog-close{position:absolute;top:14px;right:14px;width:38px;height:38px;border:0;border-radius:50%;background:#eee9df;color:#24231f;font-size:24px;cursor:pointer}
    .ryze-dialog-action{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:13px 19px;border:0;border-radius:999px;background:#25241f;color:#fff;text-decoration:none;font:600 14px 'DM Sans',sans-serif;cursor:pointer}
    .ryze-dialog-action:focus-visible,.ryze-dialog-close:focus-visible{outline:3px solid #c86d42;outline-offset:3px}
    body.ryze-dialog-open{overflow:hidden}
    @media(max-width:520px){.ryze-dialog{padding:26px 22px}}
  `;
  document.head.appendChild(styles);

  let activeDialog = null;
  let previousFocus = null;

  function closeDialog() {
    if (!activeDialog) return;
    activeDialog.remove();
    activeDialog = null;
    document.body.classList.remove("ryze-dialog-open");
    if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
  }

  function openDialog({ title, message, actionLabel, actionHref }) {
    closeDialog();
    previousFocus = document.activeElement;

    const backdrop = document.createElement("div");
    backdrop.className = "ryze-dialog-backdrop";
    backdrop.setAttribute("role", "presentation");

    const dialog = document.createElement("section");
    dialog.className = "ryze-dialog";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "ryze-dialog-title");
    dialog.innerHTML = `
      <button class="ryze-dialog-close" type="button" aria-label="Close dialog">&times;</button>
      <h2 id="ryze-dialog-title"></h2>
      <p></p>
      <a class="ryze-dialog-action" target="_blank" rel="noopener noreferrer"></a>
    `;
    dialog.querySelector("h2").textContent = title;
    dialog.querySelector("p").textContent = message;
    const action = dialog.querySelector(".ryze-dialog-action");
    action.textContent = actionLabel;
    action.href = actionHref;

    backdrop.appendChild(dialog);
    document.body.appendChild(backdrop);
    document.body.classList.add("ryze-dialog-open");
    activeDialog = backdrop;

    dialog.querySelector(".ryze-dialog-close").addEventListener("click", closeDialog);
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) closeDialog();
    });
    dialog.querySelector(".ryze-dialog-close").focus();
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    if (href === "#get-started") {
      event.preventDefault();
      openDialog({
        title: "Ready to grow with Ryze?",
        message: "Explore the official Ryze website to learn more. This landing-page redesign is a frontend prototype; account creation and demo booking are not connected here.",
        actionLabel: "Visit Ryze website ↗",
        actionHref: "https://www.get-ryze.ai/"
      });
      return;
    }

    if (href === "#login") {
      event.preventDefault();
      openDialog({
        title: "Login",
        message: "The login destination is not configured in this design prototype. No account details are collected on this page.",
        actionLabel: "Visit Ryze website ↗",
        actionHref: "https://www.get-ryze.ai/"
      });
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      event.preventDefault();
      const section = href === "#how-it-works"
        ? document.querySelector("#capabilities")
        : target;
      if (section) section.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
      if (history.replaceState) history.replaceState(null, "", href);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && activeDialog) closeDialog();
  });
})();