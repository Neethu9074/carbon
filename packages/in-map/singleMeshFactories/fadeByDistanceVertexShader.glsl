/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
precision mediump float;
precision mediump int;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float minOpacity;
uniform float maxOpacity;

attribute vec3 position;
attribute vec3 color;

varying float fMinOpacity;
varying float fMaxOpacity;
varying float fDistance;
varying vec3 vColor;


void main() {
  fMinOpacity = minOpacity;
  fMaxOpacity = maxOpacity;
  vColor = color;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

  fDistance = length( mvPosition.xyz );
  gl_Position = projectionMatrix * mvPosition;
}
