export const VERTEX = `#version 300 es
  #ifdef GL_ES
  precision mediump float;
  #endif
  layout(location = 0) 
  in vec4 a_position;
  out vec4 v_color;

  void main() {
    gl_Position = a_position;
    gl_PointSize = 30.0;

    v_color = a_position * 0.5 + 0.5;
  }
`;

export const FRAGMENT = `#version 300 es
  #ifdef GL_ES
  precision mediump float;
  #endif

  in vec4 v_color;
  out vec4 color;
  in vec2 vUv;

  void main() {
    color = v_color;
  }
`;
