import type { Application, Container } from 'pixi.js';

/**
 * Handles camera controls (pan, zoom, WASD movement) for a PixiJS world container.
 */
export class CameraController {
  private readonly app: Application;
  private readonly world: Container;

  // Keyboard state for WASD movement
  private readonly keys: Record<string, boolean> = { w: false, a: false, s: false, d: false };
  private readonly wasdKeys: readonly string[] = ['w', 'a', 's', 'd'];

  // Drag state
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private worldStartX = 0;
  private worldStartY = 0;

  // Zoom configuration
  private readonly minZoom = 0.25;
  private readonly maxZoom = 4;
  private readonly zoomSpeed = 0.001;
  private readonly keyZoomSpeed = 0.02;

  // Movement configuration
  private readonly cameraSpeed = 4;

  constructor(app: Application, world: Container) {
    this.app = app;
    this.world = world;

    this.setupKeyboardControls();
    this.setupZoomControls();
    this.setupDragControls();
    this.setupTicker();
  }

  private setupKeyboardControls(): void {
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();

      // WASD movement
      if (this.wasdKeys.includes(key)) {
        e.preventDefault();
        this.keys[key] = true;
        console.log(`Key pressed: ${key.toUpperCase()}`);
      }

      // Q/E zoom
      if (key === 'e') {
        e.preventDefault();
        this.applyZoom(this.keyZoomSpeed);
      } else if (key === 'q') {
        e.preventDefault();
        this.applyZoom(-this.keyZoomSpeed);
      }
    });

    window.addEventListener('keyup', (e) => {
      const key = e.key.toLowerCase();
      if (this.wasdKeys.includes(key)) {
        this.keys[key] = false;
      }
    });
  }

  private setupZoomControls(): void {
    this.app.canvas.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        this.applyZoom(-e.deltaY * this.zoomSpeed);
      },
      { passive: false },
    );
  }

  private setupDragControls(): void {
    this.app.canvas.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // left button only
      this.isDragging = true;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
      this.worldStartX = this.world.x;
      this.worldStartY = this.world.y;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      this.world.x = this.worldStartX + (e.clientX - this.dragStartX);
      this.world.y = this.worldStartY + (e.clientY - this.dragStartY);
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.isDragging = false;
    });

    window.addEventListener('mouseleave', () => {
      this.isDragging = false;
    });
  }

  private setupTicker(): void {
    this.app.ticker.add((ticker) => {
      const dt = ticker.deltaTime;
      if (this.keys['d']) this.world.x -= this.cameraSpeed * dt;
      if (this.keys['a']) this.world.x += this.cameraSpeed * dt;
      if (this.keys['w']) this.world.y += this.cameraSpeed * dt;
      if (this.keys['s']) this.world.y -= this.cameraSpeed * dt;
    });
  }

  private applyZoom(delta: number): void {
    const cx = this.app.screen.width / 2;
    const cy = this.app.screen.height / 2;
    const scale = this.world.scale.x;
    const worldX = (cx - this.world.x) / scale;
    const worldY = (cy - this.world.y) / scale;
    const newScale = Math.min(this.maxZoom, Math.max(this.minZoom, scale + delta));
    this.world.scale.set(newScale);
    this.world.x = cx - worldX * newScale;
    this.world.y = cy - worldY * newScale;
  }
}

