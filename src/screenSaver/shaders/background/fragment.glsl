#ifdef GL_ES
precision lowp float;
#endif

uniform vec2 uResolution;

vec2 tile(vec2 _st, float _zoom){
    _st *= _zoom;
    return fract(_st);
}

float box(vec2 _st, vec2 _size){
    _size = vec2(0.45)-_size*0.5;
    vec2 uv = smoothstep(_size,_size+vec2(1e-4),_st);
    uv *= smoothstep(_size,_size+vec2(1e-4),vec2(1.0)-_st);
    return uv.x*uv.y;
}

void main () {
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    vec3 color = vec3(0.0);

    // Repat the space
    st = tile(st,16.0);

    // Draw a rectangle in each one
    color = 1.0 - vec3(box(st,vec2(0.9)));

    // Show the space coordinates
    // color = vec3(st,0.0);

    gl_FragColor = vec4(color,1.0);
}
