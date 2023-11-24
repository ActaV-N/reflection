#version 300 es

layout(location = 0) 
in vec4 a_position;
out vec4 v_color;

void main() {
  gl_Position = a_position;
  gl_PointSize = 30.0;

  v_color = a_position * 0.5 + 0.5;
}