precision mediump float;
precision mediump int;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float distance;

attribute float severity;
attribute float progress;
attribute vec3 position;

varying float fSeverity;


void main() {
  fSeverity = severity;

  vec4 mvPosition = modelViewMatrix * vec4( vec3( position.x,
                                                  position.y,
                                                  position.z + progress ),
                                            1.0 );

  float pointSize = 1.25 * ( distance / length( mvPosition.xyz ) );

  gl_PointSize = pointSize;
  gl_Position = projectionMatrix * mvPosition;
}
