#ifdef GL_ES
precision lowp float;
#endif

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
