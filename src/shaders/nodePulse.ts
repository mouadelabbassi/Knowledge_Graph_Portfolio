export const nodeVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
export const nodeFragment = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv - 0.5;
    float radius = length(p);
    float angle = atan(p.y, p.x);
    float shape = 0.26 + 0.045 * cos(angle * 8.0);
    float star = 1.0 - smoothstep(shape - 0.004, shape + 0.006, radius);
    float ring = 1.0 - smoothstep(0.003, 0.008, abs(radius - 0.385));
    float inner = 1.0 - smoothstep(0.04, 0.1, radius);
    float outline = 1.0 - smoothstep(0.003, 0.014, abs(radius - shape));
    float pulse = 0.72 + 0.28 * sin(uTime * 1.6);
    vec3 teal = vec3(0.173, 0.776, 0.686);
    vec3 color = teal;
    float alpha = star * 0.055 + outline * 0.65 + inner * pulse * 0.35 + ring * 0.3;
    gl_FragColor = vec4(color, alpha);
  }
`;
