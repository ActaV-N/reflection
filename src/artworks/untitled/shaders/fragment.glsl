#ifdef GL_ES
precision lowp float;
#endif

uniform vec2 uMouse;

in vec2 vUv;

void main () {
    vec2 st = vUv;

    gl_FragColor = vec4(vec3(uMouse, 0.0), 1.0);
}
