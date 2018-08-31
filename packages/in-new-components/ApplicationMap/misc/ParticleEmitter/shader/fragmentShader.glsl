precision mediump float;
precision mediump int;

uniform sampler2D texture;

varying float fSeverity;
varying float fOpacity;


void main() {
  // fuzzy check
  if ( fSeverity > 0.5 ) {
    gl_FragColor = vec4( 255.0 / 255.0,
                         64.0 / 255.0,
                         64.0 / 255.0,
                         fOpacity);
  } else {
    gl_FragColor = vec4( 71.0 / 255.0,
                         82.0 / 255.0,
                         93.0 / 255.0,
                         fOpacity);
  }

  gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );
}
