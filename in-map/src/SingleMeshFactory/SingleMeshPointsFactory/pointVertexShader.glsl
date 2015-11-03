precision mediump float;
precision mediump int;

uniform float pointSize;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 position;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

  gl_PointSize = pointSize * ( 2000.0 / length( mvPosition.xyz ) );
  gl_Position = projectionMatrix * mvPosition;
}
