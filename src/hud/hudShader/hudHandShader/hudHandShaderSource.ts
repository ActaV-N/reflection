export const VERTEX = `#version 300 es
  #ifdef GL_ES
  precision mediump float;
  #endif
  
  layout(location = 0) in vec4 a_position;

  void main() {
    gl_Position = a_position;
    gl_PointSize = 5.0;
  }
`;

export const FRAGMENT = `#version 300 es

  #ifdef GL_ES
  precision mediump float;
  #endif

  out vec4 color;

  void main() {
    color = vec4(0, 0, 0.1, 1);
  }
`;
