import THREE from 'three';

import NodesGeometry from 'in-components/graphView/components/NodesGeometry';
import EdgesGeometry from 'in-components/graphView/components/EdgesGeometry';


export default class GraphScene {
  constructor() {
    this.camera = new THREE.PerspectiveCamera(75, 1, 1, 1000);
    this.camera.position.z = 100;
    const scene = this.scene = new THREE.Scene();

    this.nodesGeometry = new NodesGeometry();
    scene.add(this.nodesGeometry.renderableGeometry());

    this.edgesGeometry = new EdgesGeometry();
    scene.add(this.edgesGeometry.renderableGeometry());
  }

  resize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  render(renderer) {
    renderer.render(this.scene, this.camera);
  }

  update(graph) {
    this.edgesGeometry.update(graph);
  }

  dispose() {
    this.nodesGeometry.dispose();
    this.edgesGeometry.dispose();
  }
}
