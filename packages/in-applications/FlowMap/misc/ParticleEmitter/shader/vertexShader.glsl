/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

precision mediump float;
precision mediump int;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute float severity;
attribute float progress;
attribute vec3 position;

varying float fSeverity;


void main() {
  fSeverity = severity;

  float distance = 1500.0;
  vec4 mvPosition = modelViewMatrix * vec4( vec3( position.x,
                                                  position.y,
                                                  position.z + progress ),
                                            1.0 );

  float pointSize = 10.0;

  gl_PointSize = pointSize;
  gl_Position = projectionMatrix * mvPosition;
}
