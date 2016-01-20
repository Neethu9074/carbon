precision mediump float;
precision mediump int;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float aspect;

attribute vec3 color;

attribute float pointSize;
attribute vec3 position;
varying vec3 vColor;

void main() {
  vColor = color;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

  gl_PointSize = pointSize * aspect * ( 1500.0 / length( mvPosition.xyz ) );
  gl_Position = projectionMatrix * mvPosition;
}
