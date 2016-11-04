/* global require:false */
import {
  SphereBufferGeometry,
  Mesh,
  Vector3,
  RawShaderMaterial} from 'in-map/3DLibProvider';

import fragmentShader from 'in-components/globeView/components/shader/globeFragmentShader.glsl';
import vertexShader from 'in-components/globeView/components/shader/globeVertexShader.glsl';


export default class Clouds {

  constructor(scene) {
    this.center = new Vector3();
    this.cameraPosition = new Vector3();

    const globe = this.globe = new Mesh(
      new SphereBufferGeometry(0.501, 100, 100),
      new RawShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        uniforms: {
          cameraDirection: {
            type: 'v3',
            value: new Vector3(0, 0, 1)
          }
        }
      })
    );

    globe.renderOrder = 12;
    scene.add(globe);
  }

  update(camera) {
    if (this.globe) {
      this.cameraPosition.setFromMatrixPosition(camera.matrixWorld);

      this.center.set(0, 0, 0);
      this.globe.material.uniforms.cameraDirection.value = this.center.sub(this.cameraPosition);
    }
  }

  dispose() {
    if (this.globe) {
      this.globe.material.dispose();
      this.globe.geometry.dispose();
      this.globe = null;
    }
  }
}
