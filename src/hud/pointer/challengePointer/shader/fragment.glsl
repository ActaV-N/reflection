#ifdef GL_ES
precision lowp float;
#endif

uniform vec3 uResolution;
uniform float uTime;

varying vec2 vUv;

void main()
{
  	vec2 p = vUv - 0.5; 
    vec2 st = vUv;

    float a = atan(p.x,p.y);
    float r = distance(vec2(0.5), st);
    
    vec4 colorAnimation =  vec4(0.6 + 0.3 * sin(uTime * 3.0), 0.3 + 0.1 * cos(uTime * 2.0), 0.4 + 0.3 * sin(uTime * 8.0), 1.0);

    vec4 color = (vec4( 5. / (10. * abs(32.0*length(p)-1.) ) ) + vec4( 5. / (70. * abs(2.4*length(p)-1.) ) )) * colorAnimation;

    vec2 dist = st-vec2(0.5);
    
    float brightness = (color.r + color.g + color.b) / 3.0;

    // Calculate alpha based on brightness and whether color is black
    float alpha = brightness > 0.5 ? 1.0 : 0.0;
    if(color.r == 0.0 && color.g == 0.0 && color.b == 0.0) {
        alpha = 0.0;
    }

    
    color = vec4(color.rgb, alpha);
    gl_FragColor = color;
}