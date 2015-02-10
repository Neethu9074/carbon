'use strict';

var dynamicTex = require('./threex.dynamictexture.js');

exports.createTexture = function(text, aspect) {
  var height = 64;
  var width = height * aspect;
  var dynamicTexture = new dynamicTex.DynamicTexture(width, height);
      dynamicTexture.clear();
      dynamicTexture.context.font	= 'bolder 64px Arial';
      dynamicTexture.clear();
      dynamicTexture.drawText(text, 4, 60, 'white');

  var texture = dynamicTexture.texture.clone();
  texture.needsUpdate = true;
  return texture;
};
