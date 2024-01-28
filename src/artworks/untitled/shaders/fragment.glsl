#ifdef GL_ES
precision lowp float;
#endif

uniform float uTime;
uniform float uResolution;
uniform float uGrab;

in vec2 vUv;

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

void main () {
    vec2 st = vUv;
    vec3 color = vec3(.0);

    // Scale
    st *= 8.;

    // Tile the space
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    float m_dist = 1.;  // minimum distance

    float x[9] = float[9](-1.0, -1.0, -1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0);
    float y[9] = float[9](-1.0, 0.0, 1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0);

    for(int i=0; i<9; i++){
        // Neighbor place in the grid
        vec2 neighbor = vec2(x[i], y[i]);

        // Random position from current + neighbor place in the grid
        vec2 offset = random2(i_st + neighbor);

        // Animate the offset
        offset = 0.5 + 0.5*sin(uTime + 6.2831*offset * uGrab);

        // Position of the cell
        vec2 pos = neighbor + offset - f_st;

        // Cell distance
        float dist = length(pos);

        // Metaball it!
        m_dist = min(m_dist, m_dist*dist);
    }

    // Draw cells
    color += step(0.03, m_dist);

    gl_FragColor = vec4(1.0-color,1.0);
}
