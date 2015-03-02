'use strict';

exports.Vertex = [
  'uniform mat4 textureMatrix;',
  'varying vec4 mirrorCoord;',

  'void main() {',
  'vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
  'vec4 worldPosition = modelMatrix * vec4( position, 1.0 );',
  'mirrorCoord = textureMatrix * worldPosition;',

  'gl_Position = projectionMatrix * mvPosition;',
  '}'
].join('\n');

exports.Fragment = [
  'uniform vec3 mirrorColor;',
  'uniform sampler2D mirrorSampler;',
  'varying vec4 mirrorCoord;',

  'float blendOverlay(float base, float blend) {',
  'return( base < 0.5 ? ',
  '( 2.0 * base * blend ) : ',
  '(1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );',
  '}',

  'void main() {',
  'vec4 color = texture2DProj(mirrorSampler, mirrorCoord);',
  'color = vec4(blendOverlay(mirrorColor.r, color.r), ',
  'blendOverlay(mirrorColor.g, color.g), ',
  'blendOverlay(mirrorColor.b, color.b), 1.0);',

  'gl_FragColor = color;',
  '}'

].join('\n');
