/**
 * Custom GLSL Shaders for Xianxia 3D Xiangqi (Tu Tiên / Thủy Mặc Cổ Phong)
 * 1. Golden Bagua Magic Circle Shader (Rotating Octagonal Array + Trigram Rings)
 * 2. Golden Shockwave + Volumetric God-Rays Shader (Kiếm Khí Tuyệt Kỹ)
 * 3. Spiritual Sword-Flight Trail Shader
 */

export const BAGUA_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const BAGUA_FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  uniform sampler2D uBaguaTex;
  varying vec2 vUv;

  void main() {
    vec2 centered = vUv - 0.5;
    float r = length(centered) * 2.0;
    float angle = atan(centered.y, centered.x);

    // Rotate UV for the Bagua Texture
    float c = cos(uTime * 1.1);
    float s = sin(uTime * 1.1);
    vec2 rotUv = vec2(
      centered.x * c - centered.y * s + 0.5,
      centered.x * s + centered.y * c + 0.5
    );

    vec4 texCol = texture2D(uBaguaTex, rotUv);

    // Procedural pulsing Qi rings & 8-fold Bagua symmetry in GLSL
    float pulseRing = smoothstep(0.03, 0.0, abs(r - fract(uTime * 0.45) * 0.95)) * (1.0 - r);
    float octagonWave = 0.5 + 0.5 * cos(angle * 8.0 - uTime * 3.0);
    float outerHalo = smoothstep(0.92, 0.85, r) * smoothstep(0.68, 0.82, r) * octagonWave * 0.6;

    float alpha = clamp(texCol.a * 1.15 + pulseRing * 0.85 + outerHalo, 0.0, 1.0) * smoothstep(1.0, 0.88, r);
    vec3 finalColor = mix(uColor, vec3(1.0, 0.97, 0.78), texCol.r * 0.7 + pulseRing);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export const SHOCKWAVE_GODRAYS_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const SHOCKWAVE_GODRAYS_FRAGMENT_SHADER = /* glsl */ `
  uniform float uProgress;
  uniform vec3 uPrimaryColor;
  uniform vec3 uSecondaryColor;
  varying vec2 vUv;

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float r = length(p);
    float theta = atan(p.y, p.x);

    // Expanding Golden Shockwave Ring
    float waveRadius = uProgress * 0.95;
    float ringThickness = mix(0.14, 0.02, uProgress);
    float shockRing = smoothstep(ringThickness, 0.0, abs(r - waveRadius));

    // Angular God-Rays (Light Rays bursting radially)
    float rays1 = max(0.0, cos(theta * 12.0 + uProgress * 8.0));
    float rays2 = max(0.0, sin(theta * 20.0 - uProgress * 12.0));
    float godRays = pow(rays1 * 0.65 + rays2 * 0.35, 3.0) * smoothstep(1.0, 0.1, r) * (1.0 - uProgress);

    // Core Flash
    float coreFlash = smoothstep(0.45, 0.0, r) * pow(1.0 - uProgress, 2.0);

    float fade = 1.0 - smoothstep(0.75, 1.0, uProgress);
    float alpha = clamp((shockRing * 1.2 + godRays * 0.95 + coreFlash) * fade, 0.0, 1.0) * smoothstep(1.0, 0.9, r);

    vec3 col = mix(uSecondaryColor, uPrimaryColor, shockRing + coreFlash * 0.8);
    gl_FragColor = vec4(col, alpha);
  }
`;
