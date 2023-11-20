export const VERTEX = `#version 300 es

  layout(location = 0) 
  in vec4 a_position;

  uniform mat4 u_matrix;
  
  void main() {
    gl_Position = a_position;
    gl_PointSize = 10.0;
  }
`;

export const FRAGMENT = `#version 300 es
  precision highp float;

  out vec4 color;
  in vec2 vUv;

  void main() {
    color = vec4(1.0, 0, 0.01, 1.0);
  }
`;
