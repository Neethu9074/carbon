precision mediump float;
precision mediump int;

uniform sampler2D texture;
uniform float numColumns;

varying vec3 vColor;
varying float fDistance;


void main() {
  float minOpacity = 0.1;
  float maxOpacity = 0.6;
  float maxZoomOut = 250.0;
  float maxZoomIn = 60.0;

  float opacity = fDistance / ( maxZoomOut - maxZoomIn );
  opacity = min( maxOpacity, max( minOpacity, opacity ) );

  gl_FragColor = vec4( vColor.rgb, opacity );
}
