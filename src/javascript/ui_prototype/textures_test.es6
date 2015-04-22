/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
'use strict';

import THREE from 'three.js';

import {expect} from 'chai';
import * as textures from './textures';


describe('textures', () => {
  it('should have the same max Anisotropy like the global renderer', () => {
    const texAni = textures.groundTexture.anisotropy;
    const maxAni = new THREE.WebGLRenderer().getMaxAnisotropy();
    expect(texAni).to.equal(maxAni);
  });

  it('should contain all needed textures', () => {
    expect(typeof textures.groundTexture).to.equal(typeof THREE.Texture);
    expect(typeof textures.cubeHostTexture).to.equal(typeof THREE.Texture);
    expect(typeof textures.cubeContainerTexture).to.equal(typeof THREE.Texture);
    expect(typeof textures.groundEffectTexture).to.equal(typeof THREE.Texture);
  });
});
