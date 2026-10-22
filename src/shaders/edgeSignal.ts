export const edgeVertex = /* glsl */ `
  attribute float aAlong;
  varying float vAlong;
  void main() {
    vAlong = aAlong;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
export const edgeFragment = /* glsl */ `
  uniform float uTime;
  uniform float uRunning;
  varying float vAlong;
  void main() {
    float signal = 1.0 - smoothstep(0.0, 0.15, abs(vAlong - fract(uTime / 1.4)));
    vec3 teal = vec3(0.173, 0.776, 0.686);
    vec3 amber = vec3(0.965, 0.722, 0.357);
    gl_FragColor = vec4(mix(teal, amber, signal * uRunning), 0.45 + signal * uRunning * 0.55);
  }
`;
