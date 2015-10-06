precision mediump float;
precision mediump int;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 position;
attribute vec3 color;

attribute float oldHeight;
attribute float newHeight;
uniform float progress;
varying vec3 vColor;


void main() {
  vColor = color;

  float deltaHeights = newHeight - oldHeight;

  gl_Position =
    projectionMatrix *
    modelViewMatrix *
    vec4(position.x, oldHeight + (deltaHeights * progress), position.z, 1.0);
}
