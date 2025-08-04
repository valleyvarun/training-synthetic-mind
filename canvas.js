const section = document.getElementById("drawingSection");
const canvas = document.createElement("canvas");
canvas.id = "sketchCanvas";
canvas.style.position = "absolute"; // we'll anchor this to the section
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.zIndex = "0"; // behind all text/buttons
canvas.style.pointerEvents = "none"; // default: not interactive
canvas.style.width = "100%";
canvas.style.height = "100%";
section.style.position = "relative"; // important: anchor canvas to this
section.prepend(canvas);

const ctx = canvas.getContext("2d");

// Set actual resolution (not just style size)
function resizeCanvas() {
  const rect = section.getBoundingClientRect();
  canvas.width = section.offsetWidth;
  canvas.height = section.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Drawing state
let tool = "select";
let drawing = false;
let lastX = 0;
let lastY = 0;

// Default active state on page load
document.getElementById("selectBtn").classList.add("active");

function setTool(selectedTool) {
  tool = selectedTool;

  // Enable drawing only for brush or eraser
  canvas.style.pointerEvents = (tool === "brush" || tool === "eraser") ? "auto" : "none";

  // Update button styles
  document.querySelectorAll(".toolbar button").forEach(btn => btn.classList.remove("active"));
  if (tool === "select") document.getElementById("selectBtn").classList.add("active");
  if (tool === "brush") document.getElementById("brushBtn").classList.add("active");
  if (tool === "eraser") document.getElementById("eraserBtn").classList.add("active");
}

// ESC key returns to selection mode
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    setTool("select");
  }
});


canvas.addEventListener("mousedown", (e) => {
  if (tool !== "brush" && tool !== "eraser") return;
  drawing = true;
  const rect = canvas.getBoundingClientRect();
  lastX = e.clientX - rect.left;
  lastY = e.clientY - rect.top;
});

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.strokeStyle = tool === "eraser" ? "#ffffff" : "purple";

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();
  [lastX, lastY] = [x, y];
});

["mouseup", "mouseleave"].forEach(evt =>
  canvas.addEventListener(evt, () => (drawing = false))
);

// Save
function saveDrawing() {
  const link = document.createElement("a");
  link.download = "sketch.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// Save & Clear
function saveAndClear() {
  saveDrawing();
  discardDrawing();
}

// Discard
function discardDrawing() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
