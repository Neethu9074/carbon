import THREE from 'three';

import AbstractMeshCreationFactory from './AbstractMeshCreationFactory';

let index = 0;


export default class LineFactory extends AbstractMeshCreationFactory {

  constructor({scene}) {
    super({scene});

    this.numElementPerVertex = 3; //x, y, z

    this.setMaterial(new THREE.LineBasicMaterial({
      vertexColors: THREE.VertexColors
    }));

    if(navigator.platform.indexOf('Win') < 0) {
      this.material.linewidth = 2;
    }

    const mesh = this.globalMesh = new THREE.Line(
      this.globalGeometry,
      this.material,
      THREE.LinePieces
    );
    mesh.matrixAutoUpdate = false;
    mesh.frustumCulled = false;
    mesh.renderOrder = 2;
  }

  addFragment({id, contentProvider, enabled=true}) {
    const match = this.getFragment(id);
    if(match) {
      match.contentProvider = contentProvider;

    } else {
      super.addFragment({id, contentProvider, enabled});
    }

    //rebuild on property change
    this.rebuildGlobalMesh = true;
  }

  rebuild() {
    //reset index
    index = 0;

    //get all fragments that are enabled
    const frags = this.getLegalFragments();
    const vertices = [];
    const colors = [];

    for (let i = 0; i < frags.length; i++) {
      const fragment = frags[i];
      this.copyLineAttributesToGlobalArray(vertices, colors, fragment);
    }

    this.createGlobalMesh(new Float32Array(vertices), new Float32Array(colors));
  }

  copyLineAttributesToGlobalArray(vertices, colors, fragment){
    const points = fragment.contentProvider.getVertices();
    const color = fragment.contentProvider.getColors();

    for (let i = 0; i < points.length; i++) {
      colors[index] = color[i];
      vertices[index++] = points[i];
    }
  }

  createGlobalMesh(vertices, colors) {
    this.scene.removeSceneObject(this.globalMesh);

    this.globalGeometry.addAttribute('position',
      new THREE.BufferAttribute(vertices, this.numElementPerVertex));

    this.globalGeometry.addAttribute('color',
      new THREE.BufferAttribute(colors, this.numElementPerVertex));

    this.scene.addSceneObject(this.globalMesh);
  }
}
