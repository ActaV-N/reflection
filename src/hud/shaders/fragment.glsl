precision mediump float;

uniform vec3 resolution;
uniform float uTime;

varying float vDisplacement;

void main()
{
  gl_FragColor = vec4(vec3(vDisplacement), 1);
}