#ifdef GL_ES
precision lowp float;
#endif

uniform vec2 uMouse;
uniform float uTime;
uniform float uGrab;

in vec2 vUv;

vec4 Line(vec2 uv, float speed, float height, vec3 col) {
    uv.y += smoothstep(1., 0., abs(uv.x)) * sin(uTime * speed + uv.x * height) * (.2 * uGrab);
    return vec4(smoothstep(.1 * smoothstep(.2, .9, abs(uv.x)), 0., abs(uv.y) - .004) * col, 1.0) * smoothstep(1., .3, abs(uv.x));
}

void main () {
    vec2 uv = vUv - vec2(0.5);
    vec4 color = vec4(0.0);

    for (float i = 0.; i <= 10.; i += 1.) {
        float t = i / 10.;
        color += Line(uv, 1.0 + t, 4. * uGrab + t, vec3(.2 + t * .5, .2 + t * .2, 0.7));
    }

    gl_FragColor = color;
}
