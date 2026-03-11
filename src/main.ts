/**
 * PixiJS entry point.
 * Creates the app, draws shapes with the Graphics API, and uses WASD to move the camera (world container).
 */
import { Application, Assets, Container, Graphics, Rectangle, Sprite, Texture } from 'pixi.js';

// Spritesheet: place rogues.png in public/sprites/ so it is served at /sprites/rogues.png
const ROGUES_SPRITESHEET_URL = '/sprites/rogues.png';

async function main(): Promise<void> {
  // --- Create and configure the PixiJS application ---
  const app = new Application();

  // init() is async in PixiJS v8; options set canvas size, background, and rendering quality
  await app.init({
    background: '#1a1a2e',   // Dark blue background
    resizeTo: window,        // Canvas fills the browser window and resizes with it
    antialias: true,         // Smooth edges on shapes and sprites
  });

  // Attach the canvas so it appears in the page
  document.body.appendChild(app.canvas);

  // --- World container (acts as the "camera" when we move it) ---
  const world = new Container();
  app.stage.eventMode = 'static'; // allow stage to receive pointer events for hit testing
  app.stage.addChild(world);

  // --- Sprite from spritesheet (top-left 32x32 at world position 0,0) ---
  const sheetTexture = await Assets.load(ROGUES_SPRITESHEET_URL);
  sheetTexture.source.scaleMode = 'nearest'; // Point filtering for crisp pixel art
  const frameTexture = new Texture({
    source: sheetTexture.source,
    frame: new Rectangle(0, 0, 32, 32),
  });
  const sprite = new Sprite(frameTexture);
  sprite.x = 0;
  sprite.y = 0;
  sprite.scale.set(4); // 4x scale (32x32 → 128x128 on screen)
  sprite.eventMode = 'static'; // enable hit testing and pointer events
  sprite.cursor = 'pointer';
  sprite.on('pointertap', () => console.log('Sprite was clicked'));
  world.addChild(sprite);

  // --- Draw shapes using the Graphics API ---
  const balls = new Graphics();
  balls.circle(200, 200, 60);
  balls.fill(0x00d9ff);
  balls.roundRect(350, 140, 120, 120, 12);
  balls.fill(0xff6b6b);
  world.addChild(balls);

  // --- WASD keyboard: track which keys are held for smooth camera movement ---
  const keys: Record<string, boolean> = { w: false, a: false, s: false, d: false };
  const wasdKeys: readonly string[] = ['w', 'a', 's', 'd'];

  window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (wasdKeys.includes(key)) {
      e.preventDefault();
      keys[key] = true;
      console.log(`Key pressed: ${key.toUpperCase()}`);
    }
  });

  window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (wasdKeys.includes(key)) {
      keys[key] = false;
    }
  });

  // --- Zoom: mouse wheel + Q/E, zoom toward center of screen ---
  const minZoom = 0.25;
  const maxZoom = 4;
  const zoomSpeed = 0.001;
  const keyZoomSpeed = 0.02;

  function applyZoom(delta: number): void {
    const cx = app.screen.width / 2;
    const cy = app.screen.height / 2;
    const scale = world.scale.x;
    const worldX = (cx - world.x) / scale;
    const worldY = (cy - world.y) / scale;
    const newScale = Math.min(maxZoom, Math.max(minZoom, scale + delta));
    world.scale.set(newScale);
    world.x = cx - worldX * newScale;
    world.y = cy - worldY * newScale;
  }

  app.canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    applyZoom(-e.deltaY * zoomSpeed);
  }, { passive: false });

  // --- Pan camera by dragging with the mouse (left button) ---
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let worldStartX = 0;
  let worldStartY = 0;

  app.canvas.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // left button only
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    worldStartX = world.x;
    worldStartY = world.y;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    world.x = worldStartX + (e.clientX - dragStartX);
    world.y = worldStartY + (e.clientY - dragStartY);
  });

  window.addEventListener('mouseup', (e) => {
    if (e.button === 0) isDragging = false;
  });

  window.addEventListener('mouseleave', () => {
    isDragging = false;
  });

  window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'e') {
      e.preventDefault();
      applyZoom(keyZoomSpeed);
    } else if (key === 'q') {
      e.preventDefault();
      applyZoom(-keyZoomSpeed);
    }
  });

  // --- Animation loop: rotate shapes and move camera (world) with WASD ---
  const cameraSpeed = 4;
  app.ticker.add((ticker) => {
    const dt = ticker.deltaTime;
    balls.rotation += dt * 0.01;

    // Move world in opposite direction of input (moving world left = camera right)
    if (keys['d']) world.x -= cameraSpeed * dt;
    if (keys['a']) world.x += cameraSpeed * dt;
    if (keys['w']) world.y += cameraSpeed * dt;
    if (keys['s']) world.y -= cameraSpeed * dt;
  });
}

// Start the app; any init error is logged to the console
main().catch(console.error);
