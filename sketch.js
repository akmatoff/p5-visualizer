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
    let red = map(spectrum[10] * random(3), 0, 300, 0, 255);
    let green = map(spectrum[40] * random(3), 0, 300, 0, 255);
    let blue = map(spectrum[26] * random(5), 0, 300, 0, 255);

    let bubble = {
      x: random(windowWidth),
      y: random(windowHeight),
      r: random(60, 120),
      color: { red, green, blue },
      speed: random(0.5, 2),
    };

    bubbles.push(bubble);
  }
}

function draw() {
  background("#51a7ba");
  cursor("none");

  drawSpectrum();

  bubbles.forEach((bubble) => {
    fill(bubble.color.red, bubble.color.green, bubble.color.blue);
    circle(bubble.x, bubble.y, lerp(0, bubble.r + spectrum[50], 0.4));
    bubble.y -= 0.8 + spectrum[10] * 0.02 * bubble.speed;
    bubble.x += bubble.speed;

    if (bubble.y < -40) bubbles.splice(bubbles.indexOf(bubble), 1);
  });

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
