precision mediump float;
precision mediump int;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float aspect;

attribute float pointSize;
attribute vec3 position;
attribute vec3 color;
attribute vec2 uv;

varying vec3 vColor;
varying vec2 vUv;

void main() {
  vColor = color;
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

  gl_PointSize = pointSize * aspect * ( 1500.0 / length( mvPosition.xyz ) );
  gl_Position = projectionMatrix * mvPosition;
}
