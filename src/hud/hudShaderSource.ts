export const VERTEX = `#version 300 es

  layout(location = 0) in vec4 a_position;

  void main() {
    gl_Position = a_position;
    gl_PointSize = 3.0;
  }
`;

export const FRAGMENT = `#version 300 es

  precision highp float;

  out vec4 color;

  void main() {
    color = vec4(0, 0, 0.01, 0.1);
  }
`;
