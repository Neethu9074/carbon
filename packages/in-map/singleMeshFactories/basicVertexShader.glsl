/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

precision mediump float;
precision mediump int;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float opacity;

attribute vec3 position;
attribute vec3 color;

varying vec3 vColor;
varying float fOpacity;


void main() {
  vColor = color;
  fOpacity = opacity;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

  gl_Position = projectionMatrix * mvPosition;
}
