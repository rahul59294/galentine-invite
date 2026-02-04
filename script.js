// Helper to get elements
const $ = (id) => document.getElementById(id);

const envelopeScene = $("envelopeScene");
const letterScene = $("letterScene");
const envelopeButton = $("envelopeButton");
const yesButton = $("yesButton");
const noButton = $("noButton");
const teaseMessage = $("teaseMessage");
const confettiCanvas = $("confettiCanvas");
const letterPaperEl = document.querySelector(".letter-paper");
const letterContent = $("letterContent");
const letterCelebrate = $("letterCelebrate");
const celebrationCat = $("celebrationCat");
const friendPhoto = $("friendPhoto");
const postmanCat = $("postmanCat");
const letterCompose = $("letterCompose");
const letterTextarea = $("letterTextarea");
const sendLetterBtn = $("sendLetterBtn");
const replySection = $("replySection");
const replyYesBtn = $("replyYesBtn");
const replyNoBtn = $("replyNoBtn");
const replyMessage = $("replyMessage");

const prefersReducedMotion =
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let noHoverAttempts = 0;
const teasePhrases = [
  "Nice try 😂",
  "Wrong answer, bestie.",
  "You can't escape destiny 💘",
  "Be so for real right now.",
  "The only correct answer is YES.",
];

// -----------------------
// Envelope → Letter flow
// -----------------------

envelopeButton.addEventListener("click", () => {
  // Open flap + slide letter animation
  envelopeButton.classList.add("open");

  // After animation, swap to letter scene
  setTimeout(() => {
    envelopeScene.style.display = "none";
    letterScene.classList.add("is-visible");
    letterScene.setAttribute("aria-hidden", "false");

    // Place "no" button initially as a normal option inside the card
    positionNoButtonNearLetter();
  }, prefersReducedMotion ? 0 : 750);
});

function positionNoButtonNearLetter() {
  const yesRect = yesButton.getBoundingClientRect();
  const bw = noButton.offsetWidth || 70;

  // Place "no" visually near YES (to the right), but as a fixed element
  const approxLeft = yesRect.right + 12;
  const approxTop = yesRect.top;
  moveNoButtonTo(approxLeft, approxTop, { instant: true });

  // Make it visible & interactive once positioned
  noButton.style.opacity = "1";
  noButton.style.pointerEvents = "auto";
}

// -----------------------
// "No" button movement logic (viewport-wide)
// -----------------------

function clampToViewport(x, y) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const bw = noButton.offsetWidth || 70;
  const bh = noButton.offsetHeight || 28;
  const pad = 6;

  const maxX = w - bw - pad;
  const maxY = h - bh - pad;

  const clampedX = Math.min(Math.max(x, pad), maxX);
  const clampedY = Math.min(Math.max(y, pad), maxY);
  return { x: clampedX, y: clampedY };
}

function moveNoButtonTo(x, y, options = {}) {
  const { x: nx, y: ny } = clampToViewport(x, y);
  const { instant = false } = options;
  if (!instant && !prefersReducedMotion) {
    noButton.style.transition = "left 110ms ease-out, top 110ms ease-out";
  } else {
    noButton.style.transition = "none";
  }
  noButton.style.left = `${nx}px`;
  noButton.style.top = `${ny}px`;
}

function randomFarPositionFrom(px, py) {
  const attempts = 18;
  const bw = noButton.offsetWidth || 70;
  const bh = noButton.offsetHeight || 28;

  let best = { x: 0, y: 0 };
  let maxDist2 = -1;

  for (let i = 0; i < attempts; i++) {
    const rx = Math.random() * (window.innerWidth - bw);
    const ry = Math.random() * (window.innerHeight - bh);
    const dx = rx - px;
    const dy = ry - py;
    const d2 = dx * dx + dy * dy;
    if (d2 > maxDist2) {
      maxDist2 = d2;
      best = { x: rx, y: ry };
    }
  }

  return clampToViewport(best.x, best.y);
}

function gentlyRepelFromPointer(px, py) {
  if (prefersReducedMotion) return;
  if (!letterScene.classList.contains("is-visible")) return;

  const rect = noButton.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = cx - px;
  const dy = cy - py;
  const dist = Math.hypot(dx, dy) || 0.0001;
  const radius = 140;
  if (dist > radius) return;

  const strength = (radius - dist) / radius;
  const push = 140 + 120 * strength;
  const ux = dx / dist;
  const uy = dy / dist;
  const targetX = rect.left + ux * push;
  const targetY = rect.top + uy * push;
  moveNoButtonTo(targetX, targetY);
  triggerNoWiggle();
  incrementAttempt();
}

function triggerNoWiggle() {
  noButton.classList.remove("wiggle");
  // Force reflow to restart animation
  void noButton.offsetWidth;
  noButton.classList.add("wiggle");
}

function incrementAttempt() {
  noHoverAttempts += 1;
  if (noHoverAttempts >= 2) {
    const msgIndex = Math.min(noHoverAttempts - 2, teasePhrases.length - 1);
    teaseMessage.textContent = teasePhrases[msgIndex];
  }
}

// When the cursor comes near NO, gently push it away.
window.addEventListener("mousemove", (e) => {
  gentlyRepelFromPointer(e.clientX, e.clientY);
});

// Extra dodge when hovering directly on the button
noButton.addEventListener("pointerenter", (e) => {
  if (!letterScene.classList.contains("is-visible")) return;
  const { x, y } = randomFarPositionFrom(e.clientX, e.clientY);
  moveNoButtonTo(x, y);
  triggerNoWiggle();
  incrementAttempt();
});

// On every click of NO, move it somewhere else (so it's never actually clicked).
noButton.addEventListener("click", (e) => {
  if (!letterScene.classList.contains("is-visible")) return;
  e.preventDefault();
  e.stopPropagation();

  const { x, y } = randomFarPositionFrom(e.clientX, e.clientY);
  moveNoButtonTo(x, y);
  triggerNoWiggle();
  incrementAttempt();
});

// -----------------------
// YES button / celebration
// -----------------------

yesButton.addEventListener("click", () => {
  // Transform the card into celebration state (inside the same card)
  letterPaperEl.classList.add("is-celebrating");
  letterContent.setAttribute("aria-hidden", "true");
  letterCelebrate.setAttribute("aria-hidden", "false");

  yesButton.disabled = true;
  noButton.style.display = "none";

  if (!prefersReducedMotion) {
    startConfetti();
  }

  // Position and show celebration cat next to the card on the left side
  const cardRect = letterPaperEl.getBoundingClientRect();
  const centerY = cardRect.top + cardRect.height / 2;
  celebrationCat.style.top = `${centerY}px`;
  celebrationCat.classList.add("is-visible");

  // Show friend's photo inside the card
  friendPhoto.classList.add("is-visible");

  // Gently reveal the "Send Rahul a letter" section shortly after celebration starts
  setTimeout(() => {
    replySection.classList.add("is-visible");
  }, prefersReducedMotion ? 0 : 650);
});

// -----------------------
// Reply section (send letter to Rahul)
// -----------------------

replyNoBtn.addEventListener("click", () => {
  replyNoBtn.style.display = "none";
  replyMessage.innerHTML =
    "Haven’t you learned anything? 😏<br />There ain’t any NO here.";
});

replyYesBtn.addEventListener("click", () => {
  // Switch card into "writing" mode
  letterPaperEl.classList.add("is-writing");
  letterCompose.setAttribute("aria-hidden", "false");

  // Swap flower cat for postman cat
  celebrationCat.classList.remove("is-visible");
  postmanCat.classList.add("is-visible");
  const cardRect = letterPaperEl.getBoundingClientRect();
  const centerY = cardRect.top + cardRect.height / 2;
  postmanCat.style.top = `${centerY}px`;
});

// -----------------------
// Confetti / hearts
// -----------------------

let confettiPieces = [];
let confettiRaf = null;

function resizeCanvas() {
  const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
  confettiCanvas.width = window.innerWidth * dpr;
  confettiCanvas.height = window.innerHeight * dpr;
  confettiCanvas.style.width = `${window.innerWidth}px`;
  confettiCanvas.style.height = `${window.innerHeight}px`;
  const ctx = confettiCanvas.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function startConfetti() {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const colors = ["#ff6fa5", "#ff9ac1", "#f44773", "#ffe6f1", "#ffd1b3"];
  const pieces = 120;
  confettiPieces = Array.from({ length: pieces }, () => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * window.innerHeight * 0.4,
    vx: (Math.random() - 0.5) * 2.4,
    vy: 2.4 + Math.random() * 4.2,
    r: 4 + Math.random() * 4,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.12,
    color: colors[(Math.random() * colors.length) | 0],
    shape: Math.random() < 0.55 ? "heart" : "rect",
    life: 280 + ((Math.random() * 180) | 0),
  }));

  const ctx = confettiCanvas.getContext("2d");
  if (!ctx) return;

  const step = () => {
    confettiRaf = requestAnimationFrame(step);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    confettiPieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02;
      p.rot += p.vr;
      p.life -= 1;

      // Respawn particle when it "dies" or goes off-screen for infinite confetti
      if (p.life <= 0 || p.y > window.innerHeight + 60) {
        p.x = Math.random() * window.innerWidth;
        p.y = -20 - Math.random() * window.innerHeight * 0.4;
        p.vx = (Math.random() - 0.5) * 2.4;
        p.vy = 2.4 + Math.random() * 4.2;
        p.r = 4 + Math.random() * 4;
        p.rot = Math.random() * Math.PI * 2;
        p.vr = (Math.random() - 0.5) * 0.12;
        p.color = colors[(Math.random() * colors.length) | 0];
        p.shape = Math.random() < 0.55 ? "heart" : "rect";
        p.life = 280 + ((Math.random() * 180) | 0);
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;

      if (p.shape === "rect") {
        ctx.fillRect(-p.r, -p.r, p.r * 2.1, p.r * 1.3);
      } else {
        // Simple heart shape
        const r = p.r;
        ctx.beginPath();
        ctx.moveTo(0, -r / 2);
        ctx.bezierCurveTo(r, -r * 1.4, r * 2, 0, 0, r * 1.6);
        ctx.bezierCurveTo(-r * 2, 0, -r, -r * 1.4, 0, -r / 2);
        ctx.fill();
      }

      ctx.restore();
    });
  };

  step();
}

function stopConfetti() {
  if (confettiRaf) cancelAnimationFrame(confettiRaf);
  confettiRaf = null;
}

// -----------------------
// SEND letter (animation stub + EmailJS hook)
// -----------------------

sendLetterBtn.addEventListener("click", async () => {
  const text = (letterTextarea.value || "").trim();

  console.log("SEND CLICKED");

  if (!text) {
    letterTextarea.focus();
    return;
  }

  try {
    fetch("https://docs.google.com/forms/u/0/d/e/1FAIpQLSdHkipCY-YHNW_SSUVqd2eTlOR42-V3cXh6uSASiZBRZPRYVQ/formResponse",
      {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "entry.192148591=" + encodeURIComponent(text)
      });


    console.log("FETCH SENT");

  } catch (err) {
    console.log("FETCH ERROR", err);
  }

  // 1. Prepare UI
  sendLetterBtn.disabled = true;
  sendLetterBtn.textContent = "Sending...";

  // Hide UI elements we don't need
  letterCompose.style.display = "none";
  postmanCat.style.display = "none";
  replySection.style.display = "none";

  // Confetti continues!

  // 2. Prepare Envelope Scene
  // We need to show the envelope again, but ensure it's "open" so the letter can slide in.
  envelopeScene.style.display = "flex"; // Override hidden
  envelopeButton.classList.add("open"); // Ensure flap is open
  envelopeScene.classList.add("is-visible"); // Ensure our CSS overrides apply

  // Change text to Rahul for the return trip
  const envelopeTo = document.querySelector(".envelope-to");
  if (envelopeTo) envelopeTo.textContent = "To Mr. Rahul Singh 💌";

  // Position envelope "behind" the letter visually? 
  // Actually, standard z-index stacking: 
  // envelopeScene z-index: 10 (from CSS update), letterScene z-index: 1 (default)
  // We want letter to be ON TOP initially, then slide BEHIND/INTO.
  // But envelopeScene covers the screen. 
  // Let's rely on the animation timing.

  // 3. Animate Card Sliding Down
  letterPaperEl.classList.add("inserting");

  // 4. Wait for card to be "inside" (approx 800ms)
  setTimeout(() => {
    // Hide the letter scene completely now that it's "inside"
    letterScene.style.display = "none";

    // 5. Close the envelope
    envelopeButton.classList.remove("open");

    // 6. Wait for flap close animation (0.6s)
    setTimeout(() => {

      // 7. Fly Away!
      const envelopeStack = document.querySelector(".envelope-stack");
      envelopeStack.classList.add("fly-away");

      // 8. Show Success Message after it flies off
      setTimeout(() => {
        const successMsg = document.createElement("div");
        successMsg.className = "success-message";
        successMsg.innerHTML = "Message sent to Rahul 💌✨";
        document.body.appendChild(successMsg);

        // Trigger reflow
        void successMsg.offsetWidth;
        successMsg.classList.add("is-visible");

        // Reset button state just in case (though flow ends here)
        sendLetterBtn.textContent = "SENT 💌";

      }, 700); // 700ms into fly away

    }, 700); // Wait for flap close

  }, 700); // Wait for card insertion

});

// -----------------------
// Initial placement
// -----------------------

window.addEventListener("load", () => {
  // Hide NO button until the letter appears and we can place it correctly
  moveNoButtonTo(0, 0, { instant: true });
});


