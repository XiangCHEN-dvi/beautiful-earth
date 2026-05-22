# Third-Party Notices

This project bundles or loads the following third-party materials.

## Runtime (loaded from CDN when visiting the site)

### Three.js r170

- **License:** MIT License  
- **Copyright:** three.js authors  
- **Source:** https://github.com/mrdoob/three.js  
- **Loaded via:** jsDelivr (`cdn.jsdelivr.net/npm/three@0.170.0/`)  
- **Requirement:** Include copyright and permission notice in distributions of the Software. See `licenses/threejs-MIT.txt` (if present) or the upstream LICENSE file.

`OrbitControls` is part of Three.js examples (same MIT license).

## Bundled assets (`assets/`)

### `earth-day.jpg` — Solar System Scope `8k_earth_daymap`

- **License:** [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/)  
- **Author:** Solar System Scope (copyright notice commonly given as © 2010–2017 Solar System Scope)  
- **Source:** https://www.solarsystemscope.com/textures/  
- **Changes:** None (file used as downloaded).  
- **Attribution (TASL):** Earth imagery by [Solar System Scope](https://www.solarsystemscope.com/textures/), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

### `earth-height.png` — global elevation bump map (8192×4096 grayscale)

- **Origin:** `earth-topology.png` from [three-globe](https://github.com/vasturiano/three-globe) example assets (MIT-licensed project).  
- **Data nature:** Grayscale **bump / elevation** map for terrain displacement (not a normal map). Based on NASA-class global topography products.  
- **Changes:** Upscaled from 2048×1024 to 8192×4096 (smooth resample) to match `earth-day.jpg` UV resolution.  
- **Recommended credit:** Topography courtesy of [NASA](https://www.nasa.gov/) / [Visible Earth](https://visibleearth.nasa.gov/); distributed via [three-globe](https://github.com/vasturiano/three-globe) example data.

## This repository’s source code

- **License:** Apache License 2.0 (see root `LICENSE`)  
- **Applies to:** `index.html`, `css/`, `js/`, and project documentation authored in this repo.  
- **Note:** Apache 2.0 applies to **code**, not to CC BY–licensed textures above. Those files keep their original licenses.

## Procedural content

- **Starfield** in `js/main.js`: generated at runtime; no third-party data.
