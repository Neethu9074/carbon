precision mediump float;
precision mediump int;

uniform vec3 cameraDirection;

varying vec3 vNormal;


void main() {
  float x = dot( vNormal, cameraDirection );

  // a light blue
  vec3 color = vec3( 0.42, 0.74, 0.95 );

  gl_FragColor = vec4( color, 1.0 - ( x * x ) );
}
