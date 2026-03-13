/**
 * ecs-example.ts
 *
 * Self-contained “tiny ECS” example for a top-down roguelike.
 *
 * Key point: you avoid a mega movement function by splitting behavior into
 * small, focused systems that operate on component sets.
 *
 * This file intentionally does NOT use or depend on your existing implementation.
 */

// ---------- Core ECS primitives ----------

export type Entity = number;

export class World {
  private nextId = 1;

  // Components are stored as Maps from entity -> component data.
  // (This is intentionally simple; you can optimize storage later.)
  position = new Map<Entity, Position>();
  velocity = new Map<Entity, Velocity>();

  // Movement behavior components (choose one, or compose multiple)
  wander = new Map<Entity, Wander>();
  seek = new Map<Entity, Seek>();
  orbit = new Map<Entity, Orbit>();

  createEntity(): Entity {
    return this.nextId++;
  }
}

// Helper: iterate entities that have all required component stores.
function* query2<A, B>(
  a: Map<Entity, A>,
  b: Map<Entity, B>,
): Iterable<[Entity, A, B]> {
  // Iterate the smaller map for fewer lookups.
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  for (const [e, c1] of small) {
    const c2 = large.get(e);
    if (c2 !== undefined) {
      // TypeScript can’t infer which is which after swapping; fetch directly.
      yield [e, a.get(e)!, b.get(e)!];
    }
  }
}

// ---------- Components ----------

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  dx: number;
  dy: number;
}

// Composable movement “behaviors”
export interface Wander {
  speed: number;
  // How quickly the entity changes direction (bigger = twitchier)
  jitter: number;
  // RNG seed/state so behavior is stable per-entity (optional but useful)
  rng: number;
}

export interface Seek {
  speed: number;
  // Entity id to chase
  target: Entity;
}

export interface Orbit {
  // Orbit around a target entity at a radius
  target: Entity;
  radius: number;
  angularSpeed: number; // radians/sec
  angle: number; // current angle
}

// ---------- Utility math ----------

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function normalize(dx: number, dy: number): { nx: number; ny: number; len: number } {
  const len = Math.hypot(dx, dy);
  if (len <= 1e-9) return { nx: 0, ny: 0, len: 0 };
  return { nx: dx / len, ny: dy / len, len };
}

// Small deterministic RNG (LCG). Good enough for motion noise.
function rand01(state: number): { value: number; next: number } {
  const next = (state * 1664525 + 1013904223) >>> 0;
  return { value: next / 0xffffffff, next };
}

// ---------- Systems (small and focused) ----------

/**
 * WanderSystem:
 * - Runs on entities with Position + Velocity + Wander
 * - Writes velocity only (does not move position directly)
 */
export function wanderSystem(world: World, dt: number) {
  for (const [e, , vel] of query2(world.position, world.velocity)) {
    const w = world.wander.get(e);
    if (!w) continue;

    // Update RNG and add small random acceleration
    const r1 = rand01(w.rng);
    const r2 = rand01(r1.next);
    w.rng = r2.next;

    const ax = (r1.value - 0.5) * 2 * w.jitter;
    const ay = (r2.value - 0.5) * 2 * w.jitter;

    vel.dx = clamp(vel.dx + ax * dt, -w.speed, w.speed);
    vel.dy = clamp(vel.dy + ay * dt, -w.speed, w.speed);

    // Keep max speed bounded
    const n = normalize(vel.dx, vel.dy);
    if (n.len > w.speed) {
      vel.dx = n.nx * w.speed;
      vel.dy = n.ny * w.speed;
    }
  }
}

/**
 * SeekSystem:
 * - Runs on entities with Position + Velocity + Seek
 * - Steers velocity toward a target
 */
export function seekSystem(world: World, dt: number) {
  for (const [e, pos, vel] of query2(world.position, world.velocity)) {
    const s = world.seek.get(e);
    if (!s) continue;

    const targetPos = world.position.get(s.target);
    if (!targetPos) continue;

    const dx = targetPos.x - pos.x;
    const dy = targetPos.y - pos.y;
    const n = normalize(dx, dy);

    // Simple “desired velocity” steering
    const desiredDx = n.nx * s.speed;
    const desiredDy = n.ny * s.speed;

    // Blend (steer) smoothly instead of snapping
    const steer = clamp(10 * dt, 0, 1);
    vel.dx = vel.dx + (desiredDx - vel.dx) * steer;
    vel.dy = vel.dy + (desiredDy - vel.dy) * steer;
  }
}

/**
 * OrbitSystem:
 * - Runs on entities with Position + Orbit
 * - Directly writes position (no velocity needed)
 *
 * This shows that not all movement needs Velocity; systems can own the motion model.
 */
export function orbitSystem(world: World, dt: number) {
  for (const [e, orbit] of world.orbit) {
    const pos = world.position.get(e);
    if (!pos) continue;

    const targetPos = world.position.get(orbit.target);
    if (!targetPos) continue;

    orbit.angle += orbit.angularSpeed * dt;
    pos.x = targetPos.x + Math.cos(orbit.angle) * orbit.radius;
    pos.y = targetPos.y + Math.sin(orbit.angle) * orbit.radius;
  }
}

/**
 * IntegrateVelocitySystem:
 * - Runs on entities with Position + Velocity
 * - Applies velocity to position
 *
 * This is the “physics-ish” step shared by all velocity-based movers.
 */
export function integrateVelocitySystem(world: World, dt: number) {
  for (const [e, pos, vel] of query2(world.position, world.velocity)) {
    // If an entity uses OrbitSystem (position-owned motion), you might choose to
    // skip integration when Orbit is present. Here’s one way:
    if (world.orbit.has(e)) continue;

    pos.x += vel.dx * dt;
    pos.y += vel.dy * dt;
  }
}

// ---------- Putting it together (example usage) ----------

/**
 * Example “game update” that composes multiple movement systems.
 * No giant switch, just many small systems.
 */
export function updateWorld(world: World, dt: number) {
  // Behavior/AI steering first:
  wanderSystem(world, dt);
  seekSystem(world, dt);
  orbitSystem(world, dt);

  // Then integrate velocities to positions:
  integrateVelocitySystem(world, dt);
}

// Example setup: player + rat + ork + bat
export function createExampleWorld() {
  const world = new World();

  const player = world.createEntity();
  world.position.set(player, { x: 10, y: 10 });

  // Rat: wanders around (Position + Velocity + Wander)
  const rat = world.createEntity();
  world.position.set(rat, { x: 2, y: 4 });
  world.velocity.set(rat, { dx: 0, dy: 0 });
  world.wander.set(rat, { speed: 2.5, jitter: 12, rng: 12345 });

  // Ork: charges the player (Position + Velocity + Seek)
  const ork = world.createEntity();
  world.position.set(ork, { x: 30, y: 18 });
  world.velocity.set(ork, { dx: 0, dy: 0 });
  world.seek.set(ork, { speed: 4.5, target: player });

  // Bat: wanders AND seeks (composition)
  const bat = world.createEntity();
  world.position.set(bat, { x: 15, y: 25 });
  world.velocity.set(bat, { dx: 0, dy: 0 });
  world.wander.set(bat, { speed: 3.2, jitter: 18, rng: 999 });
  world.seek.set(bat, { speed: 2.0, target: player }); // seek gently while wandering

  // Orb: orbits the player (Position + Orbit)
  const orb = world.createEntity();
  world.position.set(orb, { x: 10, y: 10 });
  world.orbit.set(orb, { target: player, radius: 6, angularSpeed: 2.4, angle: 0 });

  return { world, player, rat, ork, bat, orb };
}

