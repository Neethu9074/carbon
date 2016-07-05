precision mediump float;
precision mediump int;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute float progress;
attribute vec3 position;
attribute float length;
attribute vec3 color;

varying float fProgress;
varying float fLength;
varying vec3 vColor;


void main() {
  fProgress = progress;
  fLength = length;
  vColor = color;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
