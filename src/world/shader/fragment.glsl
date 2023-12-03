uniform float uMixRatio;
uniform sampler2D tDiffuse1;
uniform sampler2D tDiffuse2;
uniform sampler2D tMixTexture;

varying vec2 vUv;

void main() {
  vec4 texel1 = texture2D(tDiffuse1, vUv);
  vec4 texel2 = texture2D(tDiffuse2, vUv);
  vec4 transitionTexel = texture2D(tMixTexture, vUv);

  float r = uMixRatio * (1.0 + 0.1 * 2.0) - 0.1;
  float mixf = clamp((transitionTexel.r - r) * (1.0 / 0.1), 0.0, 1.0);

  gl_FragColor = mix(texel1, texel2, mixf);
  // gl_FragColor = texel1;
  // gl_FragColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
}
