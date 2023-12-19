#ifdef GL_ES
precision lowp float;
#endif
uniform float uMixRatio;
uniform sampler2D tDiffuse1;
uniform sampler2D tDiffuse2;
uniform vec4 uResolution;

varying vec2 vUv;

void main()	{
  vec2 newUV = (vUv - vec2(0.5))*uResolution.zw + vec2(0.5);
  vec2 p = newUV;
  float x = uMixRatio;
  x = smoothstep(.0,1.0,(x*2.0+p.y-1.0));
  vec4 f = mix(
    texture2D(tDiffuse1, (p-.5)*(1.-x)+.5), 
    texture2D(tDiffuse2, (p-.5)*x+.5), 
    x);
  gl_FragColor = f;
}
