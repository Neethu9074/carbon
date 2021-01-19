/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
precision mediump float;
precision mediump int;

uniform sampler2D texture;
uniform float numColumns;

varying float fDistance;
varying vec3 vColor;
varying vec2 vUv;


void main() {
  float maxDistance = 30.0;
  float minOpacity = 0.1;
  float maxOpacity = 0.85;

  float x = vUv.x;
  float y = vUv.y;
  float width = gl_PointCoord.x / numColumns;
  float height = gl_PointCoord.y / numColumns;

  gl_FragColor = vec4(vColor, max(minOpacity, min(maxOpacity, 1.0 - (fDistance / maxDistance))));
  gl_FragColor = gl_FragColor * texture2D( texture, vec2( x + width, y + height ) );
}
