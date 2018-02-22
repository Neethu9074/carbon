precision mediump float;
precision mediump int;

uniform sampler2D texture;

varying float fSeverity;


void main() {
  // fuzzy check
  if ( fSeverity > 0.5 ) {
    gl_FragColor = vec4( 255.0 / 255.0,
                         66.0 / 255.0,
                         41.0 / 255.0,
                         1.0);
  } else {
    gl_FragColor = vec4( 31.0 / 255.0,
                         183.0 / 255.0,
                         185.0 / 255.0,
                         1.0);
  }

  gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );
}
