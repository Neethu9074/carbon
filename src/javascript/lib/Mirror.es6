'use strict';

var THREE = require('three.js');
var shader = require('./mirror_shader');

require('./postprocessing/EffectComposer');
require('./postprocessing/RenderPass');
require('./postprocessing/ShaderPass');
require('./postprocessing/MaskPass');

require('./CopyShader');
require('./HorizontalBlurShader');
require('./VerticalBlurShader');


THREE.ShaderLib.mirror = {
  uniforms: {
    'mirrorColor': {
      type: 'c',
      value: new THREE.Color(0x7F7F7F)
    },
    'mirrorSampler': {
      type: 't',
      value: null
    },
    'textureMatrix': {
      type: 'm4',
      value: new THREE.Matrix4()
    }
  }
};

class Mirror extends THREE.Object3D{
  constructor(renderer, camera, scene, options) {
    super(this);

    this.name = 'mirror_' + this.id;

    options = options || {};

    this.matrixNeedsUpdate = true;

    var width = options.textureWidth !== undefined ?
      options.textureWidth :
      1024;
    var height = options.textureHeight !== undefined ?
      options.textureHeight :
      1024;

    this.clipBias = options.clipBias !== undefined ? options.clipBias : 0.0;

    var mirrorColor = options.color !== undefined ?
      new THREE.Color(options.color) :
      new THREE.Color(0x7F7F7F);

    this.scene = scene;
    this.renderer = renderer;
    this.mirrorPlane = new THREE.Plane();
    this.normal = new THREE.Vector3(0, 0, 1);
    this.mirrorWorldPosition = new THREE.Vector3();
    this.cameraWorldPosition = new THREE.Vector3();
    this.rotationMatrix = new THREE.Matrix4();
    this.lookAtPosition = new THREE.Vector3(0, 0, -1);
    this.clipPlane = new THREE.Vector4();
    this.camera = camera;

    this.textureMatrix = new THREE.Matrix4();

    this.mirrorCamera = this.camera.clone();
    this.mirrorCamera.matrixAutoUpdate = true;

    this.texture = new THREE.WebGLRenderTarget(width, height);
    //we need this texture replacing the original one while rendering to
    //avoid missunderstanding between browser and logic and to avoid
    //[.WebGLRenderingContext]GL ERROR :GL_INVALID_OPERATION :
    //glDrawElements: Source and destination textures of the draw are the same.
    this.emptyTexture = new THREE.WebGLRenderTarget(1, 1);

    var mirrorShader = THREE.ShaderLib.mirror; //['mirror']
    var mirrorUniforms = THREE.UniformsUtils.clone(mirrorShader.uniforms);

    this.material = new THREE.ShaderMaterial({
      fragmentShader: shader.Fragment,
      vertexShader: shader.Vertex,
      uniforms: mirrorUniforms
    });

    this.material.uniforms.mirrorSampler.value = this.texture;
    this.material.uniforms.mirrorColor.value = mirrorColor;
    this.material.uniforms.textureMatrix.value = this.textureMatrix;

    if (!THREE.Math.isPowerOfTwo(width) || !THREE.Math.isPowerOfTwo(height)) {
      this.texture.generateMipmaps = false;
    }

    //init post pro effects
    this.composer = new THREE.EffectComposer(this.renderer, this.texture);
    //first add the simple render pass to save the raw image
    this.composer.addPass(new THREE.RenderPass(scene, this.mirrorCamera));

    //then add a horizontal blur pass
    var effect = new THREE.ShaderPass(THREE.HorizontalBlurShader);
    effect.uniforms.h.value = 0.001;
    this.composer.addPass(effect);

    //and finally a vertical blur pass
    effect = new THREE.ShaderPass(THREE.VerticalBlurShader);
    effect.uniforms.v.value = 0.001;
    this.composer.addPass(effect);

    this.updateTextureMatrix();
    this.render();
  }

  updateTextureMatrix() {
    this.updateMatrixWorld();
    this.camera.updateMatrixWorld();

    this.mirrorWorldPosition.setFromMatrixPosition(this.matrixWorld);
    this.cameraWorldPosition.setFromMatrixPosition(this.camera.matrixWorld);

    this.rotationMatrix.extractRotation(this.matrixWorld);

    this.normal.set(0, 0, 1);
    this.normal.applyMatrix4(this.rotationMatrix);

    var view = this.mirrorWorldPosition.clone().sub(this.cameraWorldPosition);
    view.reflect(this.normal).negate();
    view.add(this.mirrorWorldPosition);

    this.rotationMatrix.extractRotation(this.camera.matrixWorld);

    this.lookAtPosition.set(0, 0, -1);
    this.lookAtPosition.applyMatrix4(this.rotationMatrix);
    this.lookAtPosition.add(this.cameraWorldPosition);

    var target = this.mirrorWorldPosition.clone().sub(this.lookAtPosition);
    target.reflect(this.normal).negate();
    target.add(this.mirrorWorldPosition);

    this.up.set(0, -1, 0);
    this.up.applyMatrix4(this.rotationMatrix);
    this.up.reflect(this.normal).negate();

    this.mirrorCamera.position.copy(view);
    this.mirrorCamera.up = this.up;
    this.mirrorCamera.lookAt(target);

    this.mirrorCamera.updateProjectionMatrix();
    this.mirrorCamera.updateMatrixWorld();
    this.mirrorCamera.matrixWorldInverse.getInverse(
  		this.mirrorCamera.matrixWorld);

    // Update the texture matrix
    this.textureMatrix.set(
      0.5, 0.0, 0.0, 0.5,
      0.0, 0.5, 0.0, 0.5,
      0.0, 0.0, 0.5, 0.5,
      0.0, 0.0, 0.0, 1.0);
    this.textureMatrix.multiply(this.mirrorCamera.projectionMatrix);
    this.textureMatrix.multiply(this.mirrorCamera.matrixWorldInverse);

    //Now update projection matrix with new clip plane,
    //implementing code from: http://www.terathon.com/code/oblique.html
    //Paper explaining this technique:
    //http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
    this.mirrorPlane.setFromNormalAndCoplanarPoint(this.normal,
  		this.mirrorWorldPosition);
    this.mirrorPlane.applyMatrix4(this.mirrorCamera.matrixWorldInverse);

    this.clipPlane.set(this.mirrorPlane.normal.x, this.mirrorPlane.normal.y,
      this.mirrorPlane.normal.z, this.mirrorPlane.constant);

    var q = new THREE.Vector4();
    var projectionMatrix = this.mirrorCamera.projectionMatrix;

    q.x = (Math.sign(this.clipPlane.x) + projectionMatrix.elements[8]) /
      projectionMatrix.elements[0];
    q.y = (Math.sign(this.clipPlane.y) + projectionMatrix.elements[9]) /
      projectionMatrix.elements[5];
    q.z = -1.0;
    q.w = (1.0 + projectionMatrix.elements[10]) / projectionMatrix.elements[14];

    // Calculate the scaled plane vector
    var c = new THREE.Vector4();
    c = this.clipPlane.multiplyScalar(2.0 / this.clipPlane.dot(q));

    // Replacing the third row of the projection matrix
    projectionMatrix.elements[2] = c.x;
    projectionMatrix.elements[6] = c.y;
    projectionMatrix.elements[10] = c.z + 1.0 - this.clipBias;
    projectionMatrix.elements[14] = c.w;
  };

  render() {
    if (this.matrixNeedsUpdate) {
      this.updateTextureMatrix();
    }
    this.matrixNeedsUpdate = true;

    this.material.uniforms.mirrorSampler.value = this.emptyTexture;

    this.renderer.render(this.scene, this.mirrorCamera, this.texture, true);
    this.composer.render();

    this.material.uniforms.mirrorSampler.value = this.texture;
  }

  resize(width, height) {
		this.mirrorCamera.aspect = width / height;
		this.mirrorCamera.updateProjectionMatrix();
	}
}

export default Mirror;
