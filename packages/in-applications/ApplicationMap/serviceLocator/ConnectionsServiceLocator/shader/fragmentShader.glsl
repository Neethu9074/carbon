/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

precision mediump float;
precision mediump int;

varying float fOpacity;


void main() {
  gl_FragColor = vec4( 106.0 / 255.0,
                       124.0 / 255.0,
                       143.0 / 255.0,
                       fOpacity );
}
