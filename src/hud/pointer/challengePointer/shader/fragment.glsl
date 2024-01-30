#ifdef GL_ES
precision lowp float;
#endif

uniform vec3 uResolution;
uniform float uTime;

varying vec2 vUv;

float saturation(vec3 color) {
    float maxColor = max(max(color.r, color.g), color.b);
    float minColor = min(min(color.r, color.g), color.b);
    return maxColor - minColor;
}

void main()
{
  	vec2 p = vUv - 0.5; 

    float a = atan(p.x,p.y);
    float r = length(p);
    vec2 uv = vec2(0.0,r);

    
    vec4 colorAnimation = vec4(0.6 + 0.3 * sin(uTime * 3.0), 0.3 + 0.1 * cos(uTime * 2.0), 0.4 + 0.3 * sin(uTime * 8.0), 1.0);

    vec4 color = vec4( 5. / (70. * abs(2.4*length(p)-1.) ) ) * colorAnimation;

    color = vec4(color.rgb, smoothstep(0.2, 0.4, saturation(color.rgb)));
    gl_FragColor = color;
}