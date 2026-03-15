/**
 * PixiJS entry point.
 * Creates the app, draws shapes with the Graphics API, and uses WASD to move the camera (world container).
 */
import { Application, Assets, Container, Graphics, Rectangle, Sprite, Text, Texture, Ticker } from 'pixi.js';

import { CameraController } from './cameraController';
import { Node } from './nodes'

// Spritesheet: place rogues.png in public/sprites/ so it is served at /sprites/rogues.png
const MAP_URL = '/sprites/isle_of_mysteries.png';
const ROGUES_SPRITESHEET_URL = '/sprites/rogues.png';
let targetX = 0
let targetY = 0


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


  const mapTexture = await Assets.load(MAP_URL);
  const mapSprite = new Sprite(mapTexture);
  mapSprite.anchor.set(0.5);
  mapSprite.x = 0;
  mapSprite.y = 0;
  world.addChild(mapSprite);

  let homenode: Node = new Node(world, -63, 318)


  let n1: Node = new Node(world, 964, 17)
  let n2: Node = new Node(world, -100, 100)

  n1.addNode(homenode)
  homenode.addNode(n1)
  homenode.addNode(n2)
  Node.onMoveTo = moveto
  await homenode.init()
  await n2.init()
  await n1.init()

  const sheetTexture = await Assets.load(ROGUES_SPRITESHEET_URL);
  sheetTexture.source.scaleMode = 'nearest'; // Point filtering for crisp pixel art
  const frameTexture = new Texture({
    source: sheetTexture.source,
    frame: new Rectangle(0, 0, 32, 32),
  });
  const sprite = new Sprite(frameTexture);
  sprite.zIndex = 10
  sprite.x = homenode.x;
  sprite.y = homenode.y;
  targetX = homenode.x;
  targetY = homenode.y;
  world.addChild(sprite);

  const ticker = new Ticker();

  ticker.add((ticker) => {
    sprite.x += (targetX - sprite.x)*ticker.deltaTime*0.1
    sprite.y += (targetY - sprite.y)*ticker.deltaTime*0.1
   
  });

  ticker.start()

  // --- Mouse position label (top-left, fixed on screen) ---
  const mouseLabel = new Text({
    text: '0, 0',
    style: { fontFamily: 'system-ui', fontSize: 14, fill: 0, stroke: 0xeeeeee, fontWeight: 800 },
  });
  mouseLabel.x = 10;
  mouseLabel.y = 10;
  mouseLabel.zIndex = 1000;
  app.stage.addChild(mouseLabel);

  app.stage.on('pointermove', (e) => {
    const worldX = (e.global.x - world.x) / world.scale.x;
    const worldY = (e.global.y - world.y) / world.scale.y;
    mouseLabel.text = `${Math.round(worldX)}, ${Math.round(worldY)}`;
  });

  // --- Camera controller: handles WASD movement, zoom, and drag panning ---
  new CameraController(app, world);
}
function moveto(node: Node) {
  console.log("moving to node at: [" + node.x + ", " + node.y + "]")
  targetX = node.x
  targetY = node.y
}

// Start the app; any init error is logged to the console
main().catch(console.error);
