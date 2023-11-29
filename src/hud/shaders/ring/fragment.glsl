precision highp float;

uniform vec3 uResolution;
uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNewPosition;

vec3 hash33(vec3 p3)
{
	p3 = fract(p3 * vec3(.1031,.11369,.13787));
    p3 += dot(p3, p3.yxz+19.19);
    return -1.0 + 2.0 * fract(vec3(p3.x+p3.y, p3.x+p3.z, p3.y+p3.z)*p3.zyx);
}
float snoise3(vec3 p)
{
    const float K1 = 0.333333333;
    const float K2 = 0.166666667;
    
    vec3 i = floor(p + (p.x + p.y + p.z) * K1);
    vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
    
    vec3 e = step(vec3(0.0), d0 - d0.yzx);
	vec3 i1 = e * (1.0 - e.zxy);
	vec3 i2 = 1.0 - e.zxy * (1.0 - e);
    
    vec3 d1 = d0 - (i1 - K2);
    vec3 d2 = d0 - (i2 - K1);
    vec3 d3 = d0 - 0.5;
    
    vec4 h = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);
    vec4 n = h * h * h * h * vec4(dot(d0, hash33(i)), dot(d1, hash33(i + i1)), dot(d2, hash33(i + i2)), dot(d3, hash33(i + 1.0)));
    
    return dot(vec4(31.316), n);
}

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
        colorOut = vec4(vec3(0.0), 1.0);
    }
    return colorOut;
}

const vec3 color1 = vec3(0.611765, 0.262745, 0.996078);
const vec3 color2 = vec3(0.298039, 0.760784, 0.913725);
const vec3 color3 = vec3(0.062745, 0.078431, 0.600000);
const float innerRadius = 0.6;
float noiseScale = 0.65;
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
  
  n0 = snoise3( vec3(uv * noiseScale, time * 1.5) ) * 0.5 + 0.5;
  r0 = mix(mix(innerRadius, 0.4, 0.7), mix(innerRadius, 0.6, 0.8), n0);
  d0 = distance(uv, r0 / len * uv);
  v0 = light1(2.0, 10.0, len);
  v0 *= smoothstep(r0 * 1.05, r0, len);
  cl = cos(ang + time * 15.0) * 0.5 + 0.5;

  // light
  float a = uTime * 10.0;
  vec2 pos = vec2(cos(a), sin(a)) * r0;
  d = distance(uv, pos);
  v1 = light2(1.5, 5.0, d);
  v1 *= light1(1.0, 20.0 , d0);
  
  v2 = smoothstep(1.0, mix(innerRadius, 1.0, 0.8 * n0), len);

  // hole
  v3 = smoothstep(0.4, mix(0.4, 0.55, 0.2), len);

  // color
  vec3 c = mix(color1, color2, cl);
  vec3 col = mix(color1, color2, cl); 
  col = mix(color3, col, v0);

  // col = (col + v1);
  col = (col + v1) * v2 * v3;
  col.rgb = clamp(col.rgb, 0.0, 1.0);

  _FragColor = extractAlpha(col);
}

void main()
{
  vec2 uv = vUv - vec2(0.5);
  vec4 col;
  draw(col, uv);

  gl_FragColor = col;
}
