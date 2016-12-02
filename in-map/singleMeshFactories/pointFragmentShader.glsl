precision mediump float;
precision mediump int;

uniform float numColumns;
uniform sampler2D map;

varying vec3 vColor;
varying vec2 vUv;


void main() {
  float x = vUv.x;
  float y = vUv.y;
  float width = gl_PointCoord.x / numColumns;
  float height = gl_PointCoord.y / numColumns;

  gl_FragColor = vec4( vColor, 0.75 );
  gl_FragColor = gl_FragColor * texture2D( map, vec2( x + width, y + height ) );
}
