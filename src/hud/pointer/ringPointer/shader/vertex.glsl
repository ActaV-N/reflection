#ifdef GL_ES
precision lowp float;
#endif

uniform float uScale;

varying vec3 vPosition;
varying vec3 vNewPosition;
varying vec3 vNormal;
varying vec2 vUv;


void main() {
  vPosition = vPosition;
  vNormal = vNormal;
  vUv = uv;

  // MVP
  
  vec3 newPosition = position * uScale * 0.6;
  vNewPosition = newPosition;
  vec4 modelViewPosition = modelViewMatrix * vec4(newPosition, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
}
