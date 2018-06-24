const canvas = select("#canvas");
const ctx = canvas.getContext("2d");

const separationInput = select("#separation");
const cohesionInput = select("#cohesion");
const alignmentInput = select("#alignment");

const frameRateDisplay = select(".frameRate");
const vehicleDisplay = select(".vehicles");

const clearBtn = select("#clear");

const vehicles = [];

const colorSelect = select("#colors");
for (const colorTheme in colors) {
  if (colors.hasOwnProperty(colorTheme)) {
    const theme = colors[colorTheme];
    const option = document.createElement("option");
    option.setAttribute("value", colorTheme);
    if (colorTheme == "default") {
      option.setAttribute("selected", "");
    }
    option.textContent = `${colorTheme[0].toUpperCase()}${colorTheme.substr(
      1
    )}`;
    colorSelect.appendChild(option);
  }
}

let currentScheme;
if (!colors[currentScheme]) currentScheme = "default";

colorSelect.addEventListener("change", e => {
  currentScheme = e.target.value;
  if (!colors[currentScheme]) currentScheme = "default";
});

let clearedRecently = false;
let clearTime;

let frameCount = 0;
let frameRate = 0;
const maxFrameRate = 40;
let lastTime = Date.now();

function draw() {
  if (clearedRecently && Date.now() - clearTime < 800) {
    ctx.fillStyle = colors[currentScheme].clear;
  } else {
    ctx.fillStyle = colors[currentScheme].bg;
    clearedRecently = false;
  }
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const vehicle of vehicles) {
    if (vehicle.position.x > canvas.width + vehicle.length) {
      vehicle.position.x = -vehicle.length;
    } else if (vehicle.position.x < 0 - vehicle.length) {
      vehicle.position.x = canvas.width + vehicle.length;
    } else if (vehicle.position.y > canvas.height + vehicle.length) {
      vehicle.position.y = -vehicle.length;
    } else if (vehicle.position.y < 0 - vehicle.length) {
      vehicle.position.y = canvas.height + vehicle.length;
    }

    vehicle.applyForce(vehicle.cohesion(vehicles).mult(cohesionInput.value));
    vehicle.applyForce(vehicle.align(vehicles).mult(alignmentInput.value));
    vehicle.applyForce(vehicle.separate(vehicles).mult(separationInput.value));
    vehicle.update();
    vehicle.display(colors[currentScheme].stroke, colors[currentScheme].fill);
  }

  frameRateDisplay.textContent = ` ${frameRate}`;

  if (Date.now() - lastTime < 1000) {
    frameCount++;
  } else {
    frameRate = frameCount;
    frameCount = 0;
    lastTime = Date.now();
  }

  vehicleDisplay.textContent = ` ${vehicles.length}`;

  window.requestAnimationFrame(draw);
}

draw();

canvas.addEventListener("click", e => {
  if (frameRate > maxFrameRate) {
    vehicles.push(new Vehicle(e.offsetX, e.offsetY));
  }
});

canvas.addEventListener("dblclick", e => {
  if (frameRate > maxFrameRate) {
    for (let i = 0; i < 10; i++) {
      vehicles.push(new Vehicle(e.offsetX, e.offsetY));
    }
  }
});

// Move the menu away when not needed
const menu = select(".menu");

const timeout = 5;
let lastMoved = Date.now();

document.addEventListener("mousemove", () => {
  menu.classList.remove("moved");
  lastMoved = Date.now();
});

function hideMenuAfterInactivity() {
  const timeSinceMovement = Math.round((Date.now() - lastMoved) / 1000);
  if (timeSinceMovement > timeout) menu.classList.add("moved");
  window.requestAnimationFrame(hideMenuAfterInactivity);
}

hideMenuAfterInactivity();

// resize the canvas when window is resized
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", () => {
  resizeCanvas();
});

resizeCanvas();

// clear all vehicles
clearBtn.addEventListener("click", () => {
  while (vehicles.length > 0) {
    vehicles.pop();
  }
  clearedRecently = true;
  clearTime = Date.now();
});
