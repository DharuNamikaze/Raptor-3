# Raptor 1 Scroll Animation Mapping

## Complete Scroll Timeline Reference

### Stage 1: Approach Sequence (0% - 20%)
**Scroll Position:** Top of page → 20% scrolled

**Camera Movement:**
- Position Z: 25 → 15 (approaches engine)
- Position Y: 2 → 3 (slight lift)

**Engine Parts:**
- **Base Ring**: Slides from left (-20, -2, 0) → (0, -2, 0)
- **Base Ring**: Rotates 360° around Y-axis
- All other parts: Remain in starting positions (off-screen)

**Visual Effect:** Camera slowly approaches assembly zone while base ring spins into frame

---

### Stage 2: Component Assembly (20% - 40%)
**Scroll Position:** 20% → 40% scrolled

**Camera Movement:**
- Position: Maintains (0, 3, 15)

**Engine Parts:**
- **Chamber**: Descends from above (0, 15, 0) → (0, 1, 0)
- **Turbopump**: Slides from right (20, 1, 0) → (3.5, 1, 0)
- **Turbopump**: Rotates 180° around Y-axis
- **Pipe 1 & 2**: Connect from left (-15) → (-2.5)
- **Nozzle**: Rises from below (0, -20, 0) → (0, -4, 0)
- **Exhaust Ring**: Rises from below (0, -25, 0) → (0, -6, 0)

**Visual Effect:** All major components converge to form complete engine structure

---

### Stage 3: Core Ignition (40% - 60%)
**Scroll Position:** 40% → 60% scrolled

**Camera Movement:**
- Position Z: 15 → 13 (moves closer)
- Position: Maintains Y at 3

**Engine Parts:**
- **All parts**: Locked in final positions
- **Core**: Emissive intensity 0 → 2 (orange glow)
- **Core**: Pulsing scale effect (1.0 ± 0.05)
- **Core Light**: Intensity 0 → 3
- **Core Light**: Distance 10 → 30

**Visual Effect:** Engine "powers up" with glowing orange core and pulsing effect

---

### Stage 4: Final Assembly & Rotation (60% - 80%)
**Scroll Position:** 60% → 80% scrolled

**Camera Movement:**
- Orbits around engine (90° arc)
- Position X: 0 → varies with sin(angle) × 5
- Position Z: 13 + varies with cos(angle) × 5
- Always looks at center (0, 0, 0)

**Engine Parts:**
- **All parts**: Rotate 360° around world center point
- **Each part**: Individual Y-rotation += 0.002/frame
- **Core**: Maintains full glow (intensity 2)

**Visual Effect:** Complete 360° reveal of assembled engine with camera orbit

---

### Stage 5: Raptor 1 Online (80% - 100%)
**Scroll Position:** 80% → 100% scrolled (end)

**Camera Movement:**
- Position Z: 13 → 20 (pulls back)
- Position Y: 3 → 5 (rises)
- Looks at center (0, 0, 0)

**Engine Parts:**
- **All parts**: Locked in position
- **All parts**: Gentle continuous rotation (Y += 0.001/frame)
- **Core**: Pulsing glow 2.0 ± 0.5 (sinusoidal)
- **Core Light**: Maintains intensity 3

**UI Changes:**
- Stage label: "RAPTOR 1 ONLINE"
- Final specs appear: Thrust, Chamber Pressure, Isp

**Visual Effect:** Dramatic pull-back with "hero shot" of completed Raptor 1 engine

---

## Easing Function

All transitions use **easeInOutCubic**:

```javascript
function easeInOutCubic(t) {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
```

This creates smooth acceleration and deceleration for cinematic feel.

---

## Performance Notes

- **Target FPS:** 60+
- **Render Method:** `requestAnimationFrame` loop
- **Scroll Calculation:** `pageYOffset / (scrollHeight - viewportHeight)`
- **Update Frequency:** Every frame (continuous)
- **Stage Detection:** Real-time based on scroll progress

---

## Customization Quick Tips

### Slow Down Animation
Increase each stage's scroll range:
```javascript
// Original: 0.2 (20% per stage)
// Slower: 0.3 (30% per stage)
if (progress < 0.3) stage = 1;
else if (progress < 0.5) stage = 2;
// etc.
```

### Change Camera Distance
Edit camera Z positions in each stage:
```javascript
// Stage 1: Make it start farther
camera.position.z = 35 - (easeStage * 15); // Instead of 25-10

// Stage 5: Make it pull back less
camera.position.z = 13 + (easeStage * 3); // Instead of 13+7
```

### Adjust Glow Intensity
Modify emissive intensity multipliers:
```javascript
// Stage 3: Brighter glow
engineParts.core.material.emissiveIntensity = easeStage * 4; // Instead of 2

// Stage 5: Stronger pulse
engineParts.core.material.emissiveIntensity = 3 + Math.sin(Date.now() * 0.002) * 1; // Instead of 2±0.5
```

### Faster Rotation
Increase rotation increments:
```javascript
// Stage 4: Faster individual spins
part.rotation.y += 0.01; // Instead of 0.002

// Stage 5: Faster continuous rotation
engineParts[key].rotation.y += 0.005; // Instead of 0.001
```

---

## Debugging

**Check scroll progress:**
```javascript
console.log('Scroll Progress:', animationState.scrollProgress);
```

**Check current stage:**
```javascript
console.log('Current Stage:', animationState.currentStage);
```

**Monitor FPS:**
Open browser DevTools → Performance → Record scroll interaction

**Check part positions:**
```javascript
console.log('Chamber Position:', engineParts.chamber.position);
```
