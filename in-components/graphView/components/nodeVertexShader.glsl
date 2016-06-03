precision mediump float;
precision mediump int;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 position;

varying float fPointSize;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

  float pointSize = 0.25 * ( 1500.0 / length( mvPosition.xyz ) );

  if (pointSize <= 2.0) {
    pointSize = 0.0;
  }

  fPointSize = pointSize;
  gl_PointSize = pointSize;
  gl_Position = projectionMatrix * mvPosition;
}
