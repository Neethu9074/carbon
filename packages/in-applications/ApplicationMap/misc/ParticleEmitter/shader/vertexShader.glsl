/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

precision mediump float;
precision mediump int;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float opacity;

attribute float severity;
attribute float progress;
attribute vec3 position;

varying float fSeverity;
varying float fOpacity;


void main() {
  fSeverity = severity;
  fOpacity = opacity;

  float distance = 1500.0;
  vec4 mvPosition = modelViewMatrix * vec4( vec3( position.x,
                                                  position.y,
                                                  position.z + progress ),
                                            1.0 );

  float pointSize = 6.0;

  gl_PointSize = pointSize;
  gl_Position = projectionMatrix * mvPosition;
}
