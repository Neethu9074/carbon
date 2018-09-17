precision mediump float;
precision mediump int;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 position;


void main() {
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
}
