precision mediump float;
precision mediump int;

uniform sampler2D texture;


void main() {
  gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0);
  gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );
}
