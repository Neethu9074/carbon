import {addSceneObject, removeSceneObject} from 'in-map/stores/sceneStore';
import {RepeatWrapping, MeshBasicMaterial} from 'in-map/3DLibProvider';
import {hexToRGBNormalized} from 'in-services/formatters/color';
import {requestRendering} from 'in-map/stores/renderingStore';
import BaseGroundPlane from 'in-map/misc/common/GroundPlane';
import {loadImage} from 'in-map/services/imageLoader';
import theme from 'in-services/theme';

import groundTexturePath from 'in-map/misc/physical/ground.png';


export default class GroundPlane extends BaseGroundPlane {

  constructor() {
    super(1000);

    this.getGroundTexture();
  }

  getGroundTexture() {
    const quadsPerWorldUnit = 1;
    const repating = quadsPerWorldUnit * this.size;
    const texture = loadImage(groundTexturePath, loadedTexture => {
      loadedTexture.needsUpdate = true;
      requestRendering();
    });

    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(repating, repating);

    // set the ground anisotropy to the max because it's a huge ground always
    // seen and it needs to be as sharp as possible
    texture.anisotropy = 8;

    this.groundtexture = texture;

    const ground = this.ground;
    ground.material.dispose();
    ground.material = new MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
      map: texture
    });

    const color = hexToRGBNormalized(theme.map.colors.groundDots);
    ground.material.color.r = color.r;
    ground.material.color.g = color.g;
    ground.material.color.b = color.b;

    addSceneObject(ground);
  }

  dispose() {
    removeSceneObject(this.ground);

    this.ground.material.dispose();
    this.ground.geometry.dispose();
    this.ground = null;
  }
}
