/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
precision mediump float;
precision mediump int;

varying float fMinOpacity;
varying float fMaxOpacity;
varying float fDistance;
varying vec3 vColor;


void main() {
  float maxZoomOut = 250.0;
  float maxZoomIn = 60.0;

  float opacity = fDistance / ( maxZoomOut - maxZoomIn );
  opacity = min( fMaxOpacity, max( fMinOpacity, opacity ) );

  gl_FragColor = vec4( vColor.rgb, opacity );
}
