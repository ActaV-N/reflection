#ifdef GL_ES
precision lowp float;
#endif

uniform vec2 uMouse;
uniform float uTime;

in vec2 vUv;

void main () {
    float pct = abs(sin(uTime));
    vec2 st = vUv;

    gl_FragColor = vec4(vec3(uMouse * pct, pct), 1.0);
}
