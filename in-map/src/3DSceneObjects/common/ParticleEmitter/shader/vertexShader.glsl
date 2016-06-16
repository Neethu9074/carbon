precision mediump float;
precision mediump int;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform vec3 color;

attribute vec3 position;
attribute float progress;

varying vec3 vColor;

void main() {
  vColor = color;

  vec4 mvPosition = modelViewMatrix * vec4( vec3( position.x, position.y, position.z + progress ), 1.0 );

  float pointSize = 1.0 * ( 1500.0 / length( mvPosition.xyz ) );

  gl_PointSize = pointSize;
  gl_Position = projectionMatrix * mvPosition;
}
