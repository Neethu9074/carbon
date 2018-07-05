precision mediump float;
precision mediump int;

uniform sampler2D texture;

varying float fSeverity;


void main() {
  // fuzzy check
  if ( fSeverity > 0.5 ) {
    gl_FragColor = vec4( 255.0 / 255.0,
                         64.0 / 255.0,
                         64.0 / 255.0,
                         1.0);
  } else {
    gl_FragColor = vec4( 0.0 / 255.0,
                         179.0 / 255.0,
                         179.0 / 255.0,
                         1.0);
  }

  gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );
}
