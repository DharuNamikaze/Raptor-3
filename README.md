# Raptor 1 Engine - 3D Scroll Animation

A cinematic, scroll-driven 3D animation of the SpaceX Raptor 1 engine assembly sequence, built with **Three.js**, **HTML**, **CSS**, and **JavaScript** (no frameworks).

## 🚀 Features

- **Scroll-Driven Animation**: Smooth, cinematic camera movements controlled by scroll position
- **5-Stage Assembly Sequence**: Progressive engine part integration from approach to final reveal
- **Realistic Lighting**: Ambient, directional, and point lights with dynamic core glow
- **Optimized Performance**: 60 FPS rendering with efficient geometry and materials
- **Responsive Design**: Adapts to different screen sizes
- **Metallic Materials**: PBR materials with high metalness and proper roughness

## 📦 Project Structure

```
Rapto/
├── index.html      # Main HTML structure with canvas and scroll sections
├── style.css       # Cinematic dark theme and UI styling
├── main.js         # Three.js scene, animation logic, and scroll mapping
└── README.md       # This file
```

## 🎬 Animation Timeline

| Scroll % | Stage | Description |
|----------|-------|-------------|
| **0-20%** | Stage 1: Approach | Camera zooms from distance (z: 25→15)<br>Base ring spins in from left |
| **20-40%** | Stage 2: Assembly | Chamber descends, turbopump slides in<br>Pipes connect, nozzle rises |
| **40-60%** | Stage 3: Ignition | Core ignites with orange glow<br>Emissive intensity increases<br>Pulsing effect activated |
| **60-80%** | Stage 4: Rotation | Full 360° engine rotation reveal<br>Camera orbits around model |
| **80-100%** | Stage 5: Online | Camera pulls back (z: 13→20)<br>"RAPTOR 1 ONLINE" displayed<br>Continuous gentle rotation |

## 🛠️ Local Setup

### Option 1: Direct Browser Open
Simply open `index.html` in a modern browser:
```bash
# Navigate to project directory
cd D:\Nami\Rapto

# Open in default browser (Windows)
start index.html
```

### Option 2: Local Server (Recommended)
For best performance and to avoid CORS issues with future .glb models:

**Using Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Using Node.js (http-server):**
```bash
npx http-server -p 8000
```

**Using PHP:**
```bash
php -S localhost:8000
```

Then open: `http://localhost:8000`

## 🎨 Customization

### Adding a Real .glb Model

To replace procedural geometry with a real Raptor 1 model:

1. Place your `.glb` file in an `assets/` folder
2. Update `main.js` to load the model:

```javascript
// Add after setupLighting() in init()
const loader = new THREE.GLTFLoader();
loader.load('assets/raptor1.glb', (gltf) => {
    const model = gltf.scene;
    scene.add(model);
    // Split model into parts for animation
    engineParts.chamber = model.getObjectByName('Chamber');
    engineParts.nozzle = model.getObjectByName('Nozzle');
    // ... etc
});
```

### Adjusting Animation Speed

Change scroll-to-stage ratios in `main.js`:
```javascript
// Current: Each stage is 20% of scroll (0.2)
// Slower: Increase stage ranges
if (progress < 0.3) stage = 1;  // Stage 1 now 30% of scroll
else if (progress < 0.5) stage = 2;  // Stage 2 at 50%
```

### Modifying Colors

Edit CSS variables in `style.css`:
```css
:root {
    --primary-color: #00d9ff;      /* Cyan accents */
    --secondary-color: #ff6b00;    /* Orange glow */
    --bg-darker: #050508;          /* Background */
}
```

Or change material colors in `main.js`:
```javascript
const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,  // Change to 0xaaaaaa for lighter metal
    metalness: 0.9,
    roughness: 0.2
});
```

## 🧩 Engine Parts Reference

Current procedural geometry components:

1. **Base Ring** - Outer torus structure at bottom
2. **Combustion Chamber** - Main central cylinder
3. **Turbopump Housing** - Side-mounted cylinder
4. **Preburner Pipes** - Connecting cylinders (x2)
5. **Engine Core** - Glowing center sphere (emissive)
6. **Nozzle** - Conical exhaust structure
7. **Exhaust Ring** - Bottom detail ring

## ⚡ Performance Tips

- Target FPS: **60+** (monitored via browser DevTools)
- Polygon count: ~10K with current procedural geometry
- Texture loading: Lazy-load if adding custom textures
- Shadow quality: Adjust `shadow.mapSize` for performance/quality balance

## 🌐 Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile: ✅ Touch scroll supported

## 📝 Technical Details

**Libraries Used:**
- Three.js r128 (from CDN)
- GLTFLoader (optional, for .glb models)

**Animation Technique:**
- `requestAnimationFrame` for 60 FPS rendering loop
- Scroll position mapped to 0-1 progress value
- `easeInOutCubic` easing for smooth motion
- Linear interpolation (`lerp`) for position/rotation

**Lighting Setup:**
- Ambient: Soft blue tint (0x4060a0)
- Directional: Main key light with shadows
- Point (Rim): Cyan accent (0x00d9ff)
- Point (Core): Orange glow (0xff6b00) - dynamic intensity

## 🔧 Troubleshooting

**Issue: Black screen / no render**
- Check browser console for Three.js errors
- Ensure canvas element ID is "raptor-canvas"
- Verify Three.js CDN is loading

**Issue: Laggy scrolling**
- Reduce shadow map size (line 85-86 in main.js)
- Lower `setPixelRatio` to 1 (line 52)
- Disable fog for performance boost

**Issue: Parts not animating**
- Scroll down slowly - animation is tied to scroll position
- Check that `scrollHeight` is sufficient (5 sections × 100vh)

## 📄 License

MIT License - Feel free to modify and use for your projects.

## 🙏 Credits

Inspired by SpaceX Raptor engine design and cinematic web animations.

---

**Built with ❤️ using Three.js and vanilla JavaScript**
