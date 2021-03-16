/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

precision mediump float;
precision mediump int;

varying vec3 vColor;
varying float fOpacity;


void main() {
  gl_FragColor = vec4( vColor.rgb, fOpacity );
}
