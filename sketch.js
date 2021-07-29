var audio;
var fft;
var spectrum;

var isPlaying = true;

var cursorX = 0;
var cursorY = 0;
var cursorRadius = 60;
var cursorStrokeWeight = 1;
var canAnimateCursorStroke = false;

var bubbles = [];

function preload() {
  audio = loadSound("./assets/Cooroot - Wherever You Go.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  fft = new p5.FFT();
  audio.play();
}

function drawCursor() {
  cursorX = lerp(cursorX, mouseX, 0.15);
  cursorY = lerp(cursorY, mouseY, 0.15);

  fill("f8f8f8");
  strokeWeight(cursorStrokeWeight);
  circle(cursorX, cursorY, cursorRadius);
}

function drawSpectrum() {
  spectrum = fft.analyze();

  cursorRadius = 60 + spectrum[100] * 0.5;

  if (spectrum[10] > 100) {
    let red = spectrum[20] * random(4);
    let green = spectrum[50] * random(10);
    let blue = spectrum[5] * random(4);
    let alpha = random(5, 250);

    var bubble = {
      x: random(windowWidth),
      y: random(windowHeight),
      r: random(60, 120),
      rotateRadius: random(4),
      color: { red, green, blue, alpha },
      speed: random(0.01),
    };

    bubbles.push(bubble);
  }
}

function drawBGFill() {
  fill(10, 10, 10);

  if (spectrum[0] > 100) {
    ellipse(width / 2, height / 2, 3000, 3000);
  }
}

function draw() {
  background("#51a7ba");
  cursor("none");

  drawSpectrum();
  drawBGFill();

  bubbles.forEach((bubble) => {
    fill(
      bubble.color.red,
      bubble.color.green,
      bubble.color.blue,
      bubble.color.alpha
    );
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
