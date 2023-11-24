#version 300 es

precision highp float;

in vec4 v_color;
out vec4 color;
in vec2 vUv;

void main() {
  color = v_color;
}