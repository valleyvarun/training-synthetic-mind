const nodes = [
  { id: "🧠 Human-Computer Interaction" },
  { id: "📐 CAD" },
  { id: "🤖 AI" },
  { id: "🔀 Multimodal" },
  { id: "✏️ Sketching/Drawing" },
  { id: "📊 Datasets" },
  { id: "🎨 Art" },
  { id: "💡 Creativity" }
];

const links = [
  { source: "🤖 AI", target: "🔀 Multimodal" },
  { source: "🤖 AI", target: "📊 Datasets" },
  { source: "🔀 Multimodal", target: "📊 Datasets" },

  { source: "✏️ Sketching/Drawing", target: "📊 Datasets" },
  { source: "✏️ Sketching/Drawing", target: "🤖 AI" },
  { source: "✏️ Sketching/Drawing", target: "🧠 Human-Computer Interaction" },
  { source: "✏️ Sketching/Drawing", target: "🎨 Art" },
  { source: "✏️ Sketching/Drawing", target: "💡 Creativity" },

  { source: "🧠 Human-Computer Interaction", target: "📐 CAD" },
  { source: "🧠 Human-Computer Interaction", target: "🤖 AI" },
  { source: "📊 Datasets", target: "📐 CAD" },

  { source: "🎨 Art", target: "💡 Creativity" },
];

const width = window.innerWidth;
const height = window.innerHeight;

const svg = d3.select("#network")
  .attr("width", width)
  .attr("height", height);

// Sketchy-style filter
const defs = svg.append("defs");
const filter = defs.append("filter").attr("id", "sketchy");
filter.append("feTurbulence")
  .attr("type", "turbulence")
  .attr("baseFrequency", "0.015")
  .attr("numOctaves", "2")
  .attr("result", "turbulence");

filter.append("feDisplacementMap")
  .attr("in", "SourceGraphic")
  .attr("in2", "turbulence")
  .attr("scale", "3")
  .attr("xChannelSelector", "R")
  .attr("yChannelSelector", "G");

const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id).distance(220)) 
  .force("charge", d3.forceManyBody().strength(-1000))           
  .force("center", d3.forceCenter(width / 2, height / 2));


const link = svg.append("g")
  .attr("stroke", "#a020f0")
  .attr("stroke-width", 2)
  .attr("stroke-dasharray", "3,2")
  .attr("filter", "url(#sketchy)")
  .selectAll("line")
  .data(links)
  .enter().append("line");

const node = svg.append("g")
  .selectAll("g")
  .data(nodes)
  .enter().append("g")
  .attr("class", "node")
  .call(d3.drag()
    .on("start", dragStarted)
    .on("drag", dragged)
    .on("end", dragEnded));

node.append("circle")
  .attr("r", 50)
  .attr("fill", "#a020f0")
  .attr("filter", "url(#sketchy)");

node.append("text")
  .text(d => d.id)
  .attr("dy", "0.35em")
  .attr("x", 0)
  .attr("text-anchor", "middle")
  .attr("fill", "#fff")
  .attr("font-size", "13px")
  .attr("font-family", "Fira Code, monospace");

simulation.on("tick", () => {
  link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  node.attr("transform", d => `translate(${d.x},${d.y})`);
});

function dragStarted(event, d) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(event, d) {
  d.fx = event.x;
  d.fy = event.y;
}

function dragEnded(event, d) {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
