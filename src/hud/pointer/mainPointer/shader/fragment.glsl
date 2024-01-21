#ifdef GL_ES
precision lowp float;
#endif

uniform vec3 uResolution;
uniform float uTime;
uniform float uScale;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNewPosition;

vec4 extractAlpha(vec3 colorIn)
{
    vec4 colorOut;
    float maxValue = min(max(max(colorIn.r, colorIn.g), colorIn.b), 1.0);
    if (maxValue > 1e-50)
    {
        colorOut.rgb = colorIn.rgb * (1.0 / maxValue);
        colorOut.a = maxValue;
    }
    else
    {
        colorOut = vec4(0.0);
    }
    return colorOut;
}

const vec3 color1 = vec3(0.611765, 0.662745, 0.496078);
const vec3 color2 = vec3(0.198039, 0.460784, 0.713725);
const vec3 color3 = vec3(0.062745, 0.078431, 0.600000);
const float innerRadius = 0.6;
const float noiseScale = 0.75;
#define time uTime

float light1(float intensity, float attenuation, float dist)
{
    return intensity / (1.0 + dist * attenuation);
}
float light2(float intensity, float attenuation, float dist)
{
    return intensity / (1.0 + dist * dist * attenuation);
}

void draw(out vec4 _FragColor, in vec2 vUv) {
  vec2 uv = vUv;
  float ang = atan(uv.x, uv.y);
  float len = length(uv);
  float v0, v1, v2, v3, cl;
  float r0, d0, n0;
  float r, d;

  r0 = mix(mix(innerRadius, 0.4, 0.5), mix(innerRadius, 0.6, 0.5), n0);
  d0 = distance(uv, r0 / len * uv);
  v0 = light1(1.0, 10.0, len);
  v0 *= smoothstep(r0 * 1.03, r0, len);
  cl = cos(ang + time * 4.0) * 0.5 + 0.5;

  // light
  float a = uTime * 4.5;
  vec2 pos = vec2(cos(a), sin(a)) * r0;
  d = distance(uv, pos);
  v1 = light2(1.3, 6.0, d);
  v1 *= light1(1.0, 20.0 , d0);
  
  // hole
  v3 = smoothstep(0.5, mix(0.5, 0.48, 1.2), len);

  // color
  vec3 col = mix(color1, color2, cl); 
  col = mix(color3, col, v0);

  col = (col + v1) * v3;
  col.rgb = clamp(col.rgb, 0.0, 1.0);

  _FragColor = extractAlpha(col);
}

void main()
{
  vec2 uv = vUv - vec2(0.5);
  vec4 col;
  draw(col, uv);

  col.rgb = col.rgb * (1.5 - uScale * 0.75);

  gl_FragColor = col;
}
