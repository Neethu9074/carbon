'use strict';

module.exports = [
  'varying float alpha;',

  'void main(){',
  'gl_FragColor = vec4(0.11, 0.68, 0.74, alpha);',
  '}'
].join('\n');
