/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
precision mediump float;
precision mediump int;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

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

  float distance = 1000.0;
  float pointSize = pointSize * ( distance / length( mvPosition.xyz ) );
  gl_PointSize = pointSize;

  if ( pointSize < 7.5 ) {
    gl_Position = vec4( -1000.0, 0.0, 0.0, 0.0 );
  } else {
    gl_Position = projectionMatrix * mvPosition;
  }
}
