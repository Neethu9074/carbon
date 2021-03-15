/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

precision mediump float;
precision mediump int;

varying float fDistance;


void main() {
  float maxDistance = 30.0;
  float minOpacity = 0.05;
  float maxOpacity = 0.5;

  gl_FragColor = vec4(0.5, 0.5, 0.5, max(minOpacity, min(maxOpacity, 1.0 - (fDistance / maxDistance))));
}
