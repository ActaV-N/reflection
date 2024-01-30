#ifdef GL_ES
precision lowp float;
#endif

uniform vec3 uResolution;
uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNewPosition;

float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
	return smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
}

void main()
{
  vec2 st = vUv;

  vec3 color = vec3(circle(st,1.0));
  float a = 1.0;
  if(color == vec3(1.0)) {
    a = 0.0;
  } else {
    color = vec3(177.0/255.0, 151.0/255.0, 252.0/255.0);
  }
	gl_FragColor = vec4(color, a);
}
