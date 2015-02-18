'use strict';

exports.Fragment = [
  'varying float alpha;',

  'void main(){',
  'gl_FragColor = vec4(0.11, 0.68, 0.74, alpha);',
  '}'
].join('\n');

exports.Vertex = [
  'uniform float amplitude;',
  'varying float alpha;',

  'void main() {',
  'float maxHeight = 5.0;',
  'vec3 newPosition = position;',
  'newPosition.y += amplitude;',
  'if(newPosition.y > maxHeight){',
    'newPosition.y -= maxHeight;',
  '}',
  'float percent = newPosition.y / maxHeight;',

  'alpha = 1.0 - percent;',
  'gl_PointSize = 2.5;',
  'gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);',
  '}'
].join('\n');
