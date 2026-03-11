## Game Design Document – Echoes of the Depths (Working Title)

---

### 1. Overview

- **Title (Working)**: `Echoes of the Depths`
- **Genre**: Action roguelike with meta-progression & village-building
- **Platform**: Web browser (desktop-first), using `pixi.js`
- **Perspective**: Top-down 2D
- **Session Length**: 10–20 minutes per run
- **Target Audience**: Fans of roguelikes, meta-progression, and short, replayable sessions

---

### 2. Vision & Design Pillars

- **Fast, readable combat**: Quick feedback, clear telegraphs, minimal UI friction.
- **Meaningful death**: Each run grants prestige that permanently shapes your village.
- **Growing home base**: The village visually and mechanically evolves with progression.
- **Simple to learn, deep to optimize**: Small input set, many build synergies and trade-offs.

---

### 3. Core Fantasy

You are a hunter descending into cursed ruins beneath your home village. Each dive harvests resources and reveals secrets. Though you always die (or extract early), the village endures and grows from your sacrifices, making each subsequent run more powerful and complex.

---

### 4. Core Gameplay Loop

1. **Prepare in Village**
   - Spend prestige points on permanent upgrades.
   - Unlock new buildings, NPCs, and starting options.
   - Choose starting weapon/build from unlocked options.

2. **Descend into a Roguelike Run**
   - Explore procedurally generated floors.
   - Fight enemies, dodge attacks, collect temporary power-ups.
   - Choose routes: safer paths vs riskier paths with better rewards.

3. **Progress & Decisions In-Run**
   - Level up and pick perks.
   - Find artifacts/gear that affect playstyle.
   - Decide when to push deeper vs extract early with current rewards.

4. **Death or Extraction**
   - On death or return, convert run gains into:
     - **Prestige** (meta-currency).
     - **Resources** (for some buildings or cosmetics).

5. **Meta-Progression**
   - Spend prestige/resources to improve the village, unlocking:
     - Stronger starts, new weapons, permanent bonuses.
     - Expanded content (enemies, biomes, events).
   - Repeat the loop.

---

### 5. Core Mechanics

#### 5.1 Player Controls & Actions

- **Movement**: WASD / arrow keys move the player one tile at a time on a grid.
- **Primary attack**: Mouse click or spacebar; attacks originate from the player’s current tile and can be directional (toward input) or auto-aimed at nearest enemy.
- **Secondary ability**: Limited-use ability with cooldown (dash to adjacent tile, shield, AoE centered on tile, etc.).
- **Interaction**: Single key (E) for chests, NPCs, doors, etc., when on an adjacent/occupied interaction tile.
- **Extract/Return**: Key to trigger an “escape ritual” at specific grid nodes (special tiles).

#### 5.2 Combat

- **Style**: Real-time, top-down, grid-based movement (player and enemies snap to tiles, movement occurs in discrete tile steps).
- **Telegraphs**: Clear wind-up animations, projectile paths, and AoE indicators.
- **Collisions**:
  - Player and enemies respect walls/obstacles.
  - Projectiles may pass through some objects, others block.
- **Damage Model**:
  - Player has a health pool, with limited in-run healing.
  - No permanent HP loss outside special curses.

#### 5.3 In-Run Progression

- **Experience & Leveling**
  - Enemies drop XP.
  - Leveling gives perk choices (e.g., +projectiles, HP, crit chance).

- **Loot**
  - Weapons, artifacts, consumables (potions, bombs, scrolls).
  - Item rarity tiers for variety and excitement.

- **In-Run Currency**
  - **Gold**: Used only in current run (shops, rerolls, special events).

#### 5.4 Failure & Death

- **On death**:
  - Lose all temporary items, gold, and run-specific progress.
  - Keep prestige and some resources based on:
    - Floor depth reached.
    - Boss/elite kills.
    - Completed challenges.

---

### 6. Meta-Progression & Prestige System

#### 6.1 Prestige Points

- **Earning Prestige**
  - Awarded based on:
    - Depth reached.
    - Elite and boss kills.
    - Optional challenges (no-hit rooms, speed clears, etc.).

- **Spending Prestige**
  - On **village buildings** (unlocks and upgrades).
  - On **global perks** (small account-wide stat boosts).
  - On **content unlocks** (new classes, weapons, artifacts).

#### 6.2 Example Prestige Sinks

- **Stat Improvements (Soft Caps)**
  - +Max HP, +base damage, +movement speed; cost scales with tier.

- **Unlock Pools**
  - Add new artifacts and weapons to the loot pool.
  - Unlock new enemy types and biomes (increasing variety and difficulty).

- **Run Conveniences**
  - Extra rerolls on perk choices.
  - Additional starting potion slot.
  - Increased chance for rare loot.

---

### 7. Village Design

#### 7.1 Village Overview

- **Visual Style**: Cozy but slightly grim, showing recovery and growth.
- **Function**: Physical hub that represents menus as buildings and NPCs.
- **Implementation**: Separate Pixi scene/container from the dungeon scene.

#### 7.2 Buildings & Systems

- **Town Hall**
  - Core prestige spending UI.
  - Shows global progress, milestones, and achievements.

- **Blacksmith**
  - Unlocks new weapons and base damage upgrades.
  - Can forge weapon variants for future runs.

- **Arcane Tower / Shrine**
  - Unlocks new spells/abilities.
  - Upgrades magic stats (mana, cooldowns, spell power).

- **Tavern**
  - Unlocks new classes / starting loadouts.
  - Houses passive-bonus NPCs (e.g., +XP gain, +gold).

- **Farm / Resource Plot**
  - Generates minor resources between runs (time-based).
  - Visuals: more crops, livestock, etc., as it upgrades.

#### 7.3 Village Progression & Feedback

- **Visual Progress**
  - Buildings visually upgrade with new levels (size, details, lighting).
  - More NPCs appear and animate.
- **UI Feedback**
  - Hover/click buildings to see:
    - Current level, active bonuses.
    - Next-level bonuses and costs.
  - Upgrade animations (construction particles, sound stings).

---

### 8. World, Biomes & Levels

#### 8.1 Structure

- **Acts/Floors (MVP)**
  - **Act 1: Ruined Outskirts**
    - Simple enemies, tutorial-like environment.
  - **Act 2: Fungus Caves**
    - Poison, spores, and light/darkness mechanics.
  - **Act 3: Ember Halls**
    - Fire hazards, faster/aggressive enemies.

(More acts can be added later.)

#### 8.2 Room Types

- **Combat Rooms**
  - Required fights; clear to proceed.

- **Reward Rooms**
  - Chests, shrines, perk selections, artifacts.

- **Shops**
  - Spend in-run gold for items, rerolls, and boons.

- **Event Rooms**
  - Narrative snippets and risk–reward choices (e.g., sacrifice HP for power).

#### 8.3 Procedural Generation

- **Room Prefabs**
  - Hand-crafted tile-based layouts (grid of walkable/non-walkable tiles) with defined spawn tiles.
  - Enemy waves configured per room using tile coordinates.

- **Graph-Based Layout**
  - Rooms connected semi-randomly with:
    - Branching paths.
    - Occasional player choice between next rooms (shop vs elite, etc.).

---

### 9. Enemies, Bosses & Difficulty

#### 9.1 Enemy Archetypes

- **Melee Chaser**
  - Rushes the player; basic dodging test.

- **Ranged Shooter**
  - Fires projectiles at intervals; encourages movement.

- **Area-Denial Caster**
  - Spawns zones and AoE attacks.

- **Tank**
  - Slow but high HP; soaks hits and corners the player.

- **Support / Summoner (Future)**
  - Buffs allies or spawns minions.

#### 9.2 Elites & Bosses

- **Elites**
  - Enhanced basic enemies with:
    - Extra HP, new abilities, or auras.
  - Drop extra XP/loot and multiply prestige rewards.

- **Bosses**
  - End-of-act encounters:
    - Unique arenas and visuals.
    - At least two distinct phases.
    - Signature mechanics (e.g., pattern changes at 50% HP).
  - First-time kills unlock specific village upgrades or content.

#### 9.3 Difficulty Scaling

- **Per-Act/Depth Scaling**
  - Enemy HP, damage, and spawn rate increase.

- **Meta Scaling (Curses/Challenges)**
  - Optional toggles that:
    - Increase enemy speed, add new attacks, reduce healing.
    - Provide additional prestige/loot multipliers.

---

### 10. Player Progression & Builds

#### 10.1 Classes (Long-Term Unlocks)

- **Hunter (Default)**
  - Balanced; mid-range attacks (bow or throwing weapons).

- **Berserker**
  - High melee damage, lower range, higher risk–reward.

- **Mystic**
  - Fragile but powerful spells and AoE.

(More classes later as unlockable content.)

#### 10.2 Build Customization (In-Run)

- **Perks**
  - Awarded on level-up, choose 1 of 3.
  - Categories:
    - **Offensive**: damage, projectiles, crits.
    - **Defensive**: HP, shields, resistances.
    - **Utility**: movement, gold find, cooldowns.

- **Artifacts**
  - Rare, run-defining items:
    - Lifesteal, chain lightning, extra dashes, etc.
  - Often synergize with specific perks or stats.

- **Synergies**
  - Perks and artifacts interact:
    - Crit-focused builds, damage-over-time builds, summoned allies, etc.

---

### 11. UX / UI Design

#### 11.1 In-Run HUD

- **Elements**
  - HP bar.
  - Ability icons with cooldown indicators.
  - Gold and XP counters.
  - Optional minimap (later feature).

- **Clarity Goals**
  - Minimal clutter, high contrast.
  - Important info near screen edges, not covering action.

#### 11.2 Village UI

- **Interaction**
  - Buildings clickable with simple hover feedback.
  - Dialogue windows for NPCs.

- **Upgrade Panels**
  - Show:
    - Current building level.
    - Current and next-level bonuses.
    - Prestige/resource cost.

- **Tooltips**
  - For all upgrades, perks, and artifacts, explaining:
    - Exact effects.
    - Any synergies (where appropriate).

#### 11.3 Feedback & Juice

- **Visual**
  - Hit flashes on enemies.
  - Knockback, small screen shake (configurable).
  - Particles on kills, level-ups, and upgrades.

- **Text**
  - Floating combat text (damage, crits, heals; toggleable).
  - On-screen banners for:
    - Level up.
    - Boss encountered.
    - Major loot.

- **Audio**
  - Distinct sounds for hits, dodges, pickups, UI.

---

### 12. Art & Visual Style

- **Style**
  - 2D stylized; readable silhouettes at a glance.
  - Dark-fantasy palette with warm highlights in the village.

- **Resolution**
  - Pixel-art friendly, but scaled cleanly to HD.

- **Key Assets**
  - Player sprites (idle, walk, attack, death).
  - Enemy sets per biome.
  - Environmental tiles and props.
  - Village background and building sprites.
  - VFX spritesheets for attacks and upgrades.

- **Effects (Pixi)**
  - Particle systems for:
    - Hits.
    - Spells.
    - Prestige/village upgrade visuals.

---

### 13. Audio Design

- **Music**
  - Village theme: calm, hopeful.
  - Dungeon themes:
    - Act-specific, ambient and tense, escalating with depth.

- **SFX**
  - Attacks, enemy deaths, UI interactions.
  - Special sounds for:
    - Level-ups.
    - Boss entrances.
    - Prestige upgrades.

- **Priority**
  - Telegraph sounds for dangerous enemy actions.
  - Clear feedback on player hits vs being hit.

---

### 14. Story & Theme

- **Tone**
  - Dark-fantasy with underlying hope and rebuilding.

- **Premise**
  - A curse seeps upward from the depths, draining the village.
  - Descending into the ruins, your deaths fuel knowledge and resources.
  - The village grows stronger with every fall, aiming to one day break the curse.

- **Narrative Delivery**
  - Light NPC dialogue in the village.
  - Notes and relics found during runs.
  - Occasional short events with choices affecting prestige/resources.

---

### 15. Technical Design (PixiJS & Architecture)

#### 15.1 Technology Stack

- **Core Engine**: `pixi.js` (TypeScript recommended).
- **State Management**: Simple custom state machine or lightweight library.
- **Persistence**
  - `localStorage` / IndexedDB for:
    - Prestige totals.
    - Village building levels.
    - Class/weapon/artifact unlocks.
- **Build Tooling**
  - Reuse existing project setup (from `src/main.ts`, e.g., Vite/Webpack).

#### 15.2 High-Level Architecture

- **Scenes / States**
  - `BootScene`: load assets.
  - `MainMenuScene`: title screen, game start.
  - `VillageScene`: hub, upgrades, NPCs.
  - `DungeonScene`: core gameplay, grid-based rooms, enemies.

- **Core Systems**
  - Rendering via Pixi display tree.
  - Input handling (keyboard + mouse).
  - Tile-based movement and collision on a grid (each entity occupies one or more tiles; movement in discrete tile steps).
  - Enemy AI (finite state machines).
  - Procedural generation controller.
  - Save/load system for meta-progression.

- **Entity Model**
  - Either:
    - Component-based entities (Position, Renderable, Health, AI, etc.).
    - Or simple class hierarchy for MVP (e.g., `Entity`, `Player`, `Enemy`).

---

### 16. Content Scope & Roadmap

#### 16.1 MVP Scope

- **Player**
  - 1 class: Hunter.
- **World**
  - 1 biome with 5–7 enemy types.
  - 1 boss.
- **Village**
  - 3–4 buildings (Town Hall, Blacksmith, Tavern, basic Farm).
  - 3 upgrade tiers per building.
- **Systems**
  - Basic run loop: Village ↔ Dungeon.
  - Prestige earn and spend.
  - In-run leveling, perks, and artifacts:
    - ~15–20 perks.
    - ~10–15 artifacts.

#### 16.2 Post-MVP Extensions

- Additional classes.
- New biomes and bosses.
- Challenge modifiers (curses).
- More artifacts, events, room types.
- Cosmetic village customization.

---

### 17. Monetization & Distribution (Optional)

- **Monetization**
  - Primarily free browser game.
  - Possible later:
    - Cosmetic support packs.
    - Steam/itch builds with extra cosmetic or QoL features.

- **Distribution**
  - Browser-based via personal site or `itch.io`.
  - All saves stored client-side.

---

### 18. Risks & Open Questions

- **Balance**
  - Ensuring prestige upgrades feel impactful but don’t trivialize early content.
- **Performance**
  - Managing large numbers of entities and particles in browser.
- **Content Load**
  - Creating enough room prefabs, perks, and artifacts for replayability.
- **Open Questions**
  - How punishing should death be at high prestige?
  - How quickly should village upgrades cap out for MVP?

---

### 19. Next Steps (Implementation-Focused)

- **Design**
  - Lock MVP feature set and cut anything non-essential.
  - Define:
    - First set of 3–5 core perks.
    - 3–4 artifacts.
    - 3–4 enemy types and 1 boss concept.

- **Technical**
  - Wrap your existing `pixi.js` bootstrap (`main.ts`) in a simple scene manager.
  - Implement:
    - `VillageScene` with a clickable Town Hall and simple upgrade UI.
    - `DungeonScene` with:
      - Basic room prefab(s).
      - 1–2 enemy types.
      - Player movement and attack.
    - Prestige accumulation (simple scoring) and spending at Town Hall.

