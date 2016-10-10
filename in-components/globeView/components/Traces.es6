import {
  Mesh,
  Object3D,
  MeshBasicMaterial,
  DoubleSide
} from 'in-map/3DLibProvider';
import TraceBufferGeometry from 'in-components/globeView/components/TraceGeometry';
import {ZERO} from 'in-map/misc/fixedVectors';


const degToRad = Math.PI / 180;

export default class Traces {

  constructor(parent) {
    const wrapper = this.wrapper = new Object3D();
    wrapper.renderOrder = 1;
    parent.add(wrapper);

    const xOffset = -90;
    const yOffset = 0;
    wrapper.rotateX(xOffset * degToRad);
    wrapper.rotateY(yOffset * degToRad);


    // north pole
    this.addTrace({ latitude: 90.0, longitude: 0.0 });

    // south pole
    this.addTrace({ latitude: -90.0, longitude: 0.0 });

    // instana Solingen
    this.addTrace({ latitude: 51.1611, longitude: 7.010880000000043 });
  }

  addTrace({latitude, longitude}) {
    latitude *= degToRad;
    longitude *= degToRad;

    const rho = 0.5; // distance from the center
    const x = Math.cos(latitude) * Math.cos(longitude) * rho;
    const y = Math.cos(latitude) * Math.sin(longitude) * rho;
    const z = Math.sin(latitude) * rho; //  z is 'up'

    const cube = new Mesh(
      new TraceBufferGeometry(),
      new MeshBasicMaterial({
        side: DoubleSide
      })
    );
    cube.position.set(x, y, z);
    cube.scale.set(1, 1, -10);
    cube.lookAt(ZERO);

    this.wrapper.add(cube);
  }

  dispose() {
    for (let i = 0; i < this.wrapper.children.length; i++) {
      const mesh = this.wrapper.children[i];
      mesh.geometry.dispose();
      mesh.material.dispose();
    }
  }
}
