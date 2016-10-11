import {
  Mesh,
  Color,
  Object3D,
  MeshBasicMaterial,
  DoubleSide
} from 'in-map/3DLibProvider';
import TraceBufferGeometry from 'in-components/globeView/components/TraceGeometry';
import {ZERO} from 'in-map/misc/fixedVectors';


const sizeForMaxColor = 100;
const fromColor = { r: 0, g: 0.5, b: 1 };
const toColor = { r: 1, g: 0.5, b: 0 };
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

    for (let i = 0; i < 20; i++) {
      this.addTrace({
        latitude: -90 + Math.random() * 180,
        longitude: -180 + Math.random() * 360,
        size: Math.random() * 100
      });
    }
  }

  addTrace({latitude, longitude, size = 10}) {
    latitude *= degToRad;
    longitude *= degToRad;

    const rho = 0.5; // distance from the center
    const x = Math.cos(latitude) * Math.cos(longitude) * rho;
    const y = Math.cos(latitude) * Math.sin(longitude) * rho;
    const z = Math.sin(latitude) * rho; //  z is 'up'

    const color = this.getColorFromSize(size);
    const cube = new Mesh(
      new TraceBufferGeometry(),
      new MeshBasicMaterial({
        color: new Color(color.r, color.g, color.b),
        side: DoubleSide
      })
    );
    cube.renderOrder = 2;
    cube.position.set(x, y, z);
    cube.scale.set(1, 1, -size);
    cube.lookAt(ZERO);

    this.wrapper.add(cube);
  }

  getColorFromSize(size) {
    const multiplier = Math.min(1, size / sizeForMaxColor);
    return {
      r: fromColor.r + (toColor.r - fromColor.r) * multiplier,
      g: fromColor.g + (toColor.g - fromColor.g) * multiplier,
      b: fromColor.b + (toColor.b - fromColor.b) * multiplier
    };
  }

  dispose() {
    for (let i = 0; i < this.wrapper.children.length; i++) {
      const mesh = this.wrapper.children[i];
      mesh.geometry.dispose();
      mesh.material.dispose();
    }
  }
}
