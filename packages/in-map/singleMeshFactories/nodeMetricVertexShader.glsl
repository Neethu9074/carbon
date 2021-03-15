/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

precision mediump float;
precision mediump int;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float progress;

attribute float oldHeight;
attribute float newHeight;
attribute vec3 position;
attribute vec3 color;

varying vec3 vColor;


void main() {
  vColor = color;

  float deltaHeights = newHeight - oldHeight;

  gl_Position =
    projectionMatrix *
    modelViewMatrix *
    vec4( position.x,
          oldHeight + ( deltaHeights * progress ),
          position.z,
          1.0 );
}
