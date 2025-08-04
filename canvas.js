// Store canvases and their contexts for each section
const drawingSections = {};

// Initialize drawing functionality for multiple sections
function initializeDrawingSections() {
  // Find all sections with drawing functionality
  const sections = [
    'drawingSection1',
    'drawingSection2', 
    'drawingSection3'
    // Add more section IDs as needed
  ];

  sections.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    if (section) {
      initializeDrawingForSection(sectionId);
    }
  });
}

function initializeDrawingForSection(sectionId) {
  const section = document.getElementById(sectionId);
  
  // Create canvas for this section (using your existing styling)
  const canvas = document.createElement('canvas');
  canvas.id = `canvas-${sectionId}`;
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.zIndex = "0"; // behind all text/buttons
  canvas.style.pointerEvents = "none"; // default: not interactive
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  
  section.style.position = "relative";
  section.prepend(canvas);
  
  // Store canvas and context
  drawingSections[sectionId] = {
    canvas: canvas,
    ctx: canvas.getContext('2d'),
    currentTool: 'select',
    isDrawing: false,
    lastX: 0,
    lastY: 0
  };
  
  // Set actual resolution (your existing logic)
  function resizeCanvas() {
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  
  // Add event listeners for this canvas
  addCanvasEventListeners(sectionId);
}

function addCanvasEventListeners(sectionId) {
  const { canvas } = drawingSections[sectionId];
  
  canvas.addEventListener('mousedown', (e) => startDrawing(e, sectionId));
  canvas.addEventListener('mousemove', (e) => draw(e, sectionId));
  canvas.addEventListener('mouseup', () => stopDrawing(sectionId));
  canvas.addEventListener('mouseleave', () => stopDrawing(sectionId));
}

// Helper function to determine which section is currently active
function getCurrentActiveSectionId() {
  // For now, just return 'drawingSection1' - you can make this smarter later
  return 'drawingSection1';
}

// Modified setTool function to handle multiple sections
function setTool(selectedTool) {
  const currentSectionId = getCurrentActiveSectionId();
  if (drawingSections[currentSectionId]) {
    const section = drawingSections[currentSectionId];
    section.currentTool = selectedTool;
    
    // Enable drawing only for brush or eraser
    section.canvas.style.pointerEvents = (selectedTool === "brush" || selectedTool === "eraser") ? "auto" : "none";
    
    // Update button styles for ALL sections
    document.querySelectorAll(".toolbar button").forEach(btn => btn.classList.remove("active"));
    
    // Add active class to the correct buttons based on current section
    const sectionNumber = currentSectionId.replace('drawingSection', '');
    const suffix = sectionNumber === '1' ? '' : sectionNumber;
    
    if (selectedTool === "select") {
      const btn = document.getElementById(`selectBtn${suffix}`);
      if (btn) btn.classList.add("active");
    }
    if (selectedTool === "brush") {
      const btn = document.getElementById(`brushBtn${suffix}`);
      if (btn) btn.classList.add("active");
    }
    if (selectedTool === "eraser") {
      const btn = document.getElementById(`eraserBtn${suffix}`);
      if (btn) btn.classList.add("active");
    }
  }
}

// Better function to detect which section is currently active
function getCurrentActiveSectionId() {
  const sections = document.querySelectorAll('.section[id^="drawingSection"]');
  const scrollContainer = document.querySelector('.all-sections');
  const scrollTop = scrollContainer.scrollTop;
  
  for (let section of sections) {
    const rect = section.getBoundingClientRect();
    const containerRect = scrollContainer.getBoundingClientRect();
    
    // Check if section is currently visible
    if (rect.top <= containerRect.top + 100 && rect.bottom >= containerRect.top + 100) {
      return section.id;
    }
  }
  
  return 'drawingSection1'; // fallback
}

// ESC key returns to selection mode (your existing logic)
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    setTool("select");
  }
});

// Drawing functions (adapted from your existing code)
function startDrawing(e, sectionId) {
  const section = drawingSections[sectionId];
  if (section.currentTool !== "brush" && section.currentTool !== "eraser") return;
  
  section.isDrawing = true;
  const rect = section.canvas.getBoundingClientRect();
  section.lastX = e.clientX - rect.left;
  section.lastY = e.clientY - rect.top;
}

function draw(e, sectionId) {
  const section = drawingSections[sectionId];
  if (!section.isDrawing) return;
  
  const { canvas, ctx, currentTool } = section;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // Your existing drawing logic
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.strokeStyle = currentTool === "eraser" ? "#ffffff" : "purple";
  
  ctx.beginPath();
  ctx.moveTo(section.lastX, section.lastY);
  ctx.lineTo(x, y);
  ctx.stroke();
  
  section.lastX = x;
  section.lastY = y;
}

function stopDrawing(sectionId) {
  const section = drawingSections[sectionId];
  section.isDrawing = false;
}

// Save functions (your existing logic)
function saveDrawing() {
  const currentSectionId = getCurrentActiveSectionId();
  if (drawingSections[currentSectionId]) {
    const { canvas } = drawingSections[currentSectionId];
    const link = document.createElement("a");
    link.download = "sketch.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }
}

function saveAndClear() {
  saveDrawing();
  discardDrawing();
}

function discardDrawing() {
  const currentSectionId = getCurrentActiveSectionId();
  if (drawingSections[currentSectionId]) {
    const { canvas, ctx } = drawingSections[currentSectionId];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeDrawingSections();
  
  // Set default active state (your existing logic)
  const selectBtn = document.getElementById("selectBtn");
  if (selectBtn) {
    selectBtn.classList.add("active");
  }
});