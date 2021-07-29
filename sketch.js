var audio;
var fft;
var spectrum;

var isPlaying = false;
var cursorX = 0;
var cursorY = 0;
var cursorRadius = 60;

var bubbles = [];

function preload() {
  audio = loadSound("./assets/Sun Rain - Oils.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  fft = new p5.FFT();
}

function drawCursor() {
  cursorX = lerp(cursorX, mouseX, 0.15);
  cursorY = lerp(cursorY, mouseY, 0.15);

  fill("#f7f7f7");
  circle(cursorX, cursorY, cursorRadius);
}

function drawSpectrum() {
  spectrum = fft.analyze();

  cursorRadius = 60 + spectrum[100] * 0.3;

  if (spectrum[10] > 100) {
    let red = spectrum[20] * random(4);
    let green = spectrum[50] * random(10);
    let blue = spectrum[5] * random(4);

    var bubble = {
      x: random(windowWidth),
      y: random(windowHeight),
      r: random(60, 120),
      rotateRadius: random(4),
      color: { red, green, blue },
      speed: random(0.01),
    };

    bubbles.push(bubble);
  }
}

function drawRect() {
  fill(10, 10, 10);

  if (spectrum[40] > 90) {
    rect(0, 0, windowWidth, windowHeight);
  }
}

function draw() {
  background("#51a7ba");
  cursor("none");

  drawSpectrum();
  drawRect();
  bubbles.forEach((bubble) => {
    fill(bubble.color.red, bubble.color.green, bubble.color.blue);
    circle(bubble.x, bubble.y, lerp(0, bubble.r + spectrum[50], 0.4));

    bubble.x +=
      Math.sin(Date.now() * bubble.speed) *
      bubble.rotateRadius *
      spectrum[40] *
      0.08;
    bubble.y +=
      Math.cos(Date.now() * bubble.speed) * bubble.rotateRadius -
      spectrum[20] * 0.05;

    if (bubble.y < -40) bubbles.splice(bubbles.indexOf(bubble), 1);
  });

  for (let i = 0; i < 50; i++) {
    let x = cursorX + Math.sin(Date.now() * 0.008) * 300;
    let y = cursorY + Math.cos(Date.now() * 0.01) * 200;
    fill("#f8f8f8");
    circle(x, y, spectrum[20] * 0.3);
  }

  drawCursor();
}

function mouseMoved() {
  currentMouseX = mouseX;
  currentMouseY = mouseY;
}

function keyPressed() {
  if (key === " ") {
    isPlaying = !isPlaying;

    isPlaying ? audio.play() : audio.pause();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
