import THREE from 'three';

import NodesGeometry from 'in-components/graphView/components/NodesGeometry';
import EdgesGeometry from 'in-components/graphView/components/EdgesGeometry';
import createControls from 'in-components/graphView/components/Controls';


export default class GraphScene {
  constructor(renderer) {
    this.camera = new THREE.PerspectiveCamera(75, 1, 1, 1000);
    const scene = this.scene = new THREE.Scene();

    this.nodesGeometry = new NodesGeometry();
    scene.add(this.nodesGeometry.renderableGeometry());

    this.edgesGeometry = new EdgesGeometry();
    scene.add(this.edgesGeometry.renderableGeometry());

    this.controls = createControls(
      renderer.domElement,
      this.camera,
      {
        cameraMoveSpeed: 1,
        startingWorldDistance: 0,
        startingZoomDistance: 30,
        zoomSpeed: 5
      }
    );
  }

  resize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  render(renderer) {
    renderer.render(this.scene, this.camera);
  }

  updateGeometry(graph) {
    this.edgesGeometry.updateGeometry(graph);
    this.nodesGeometry.updateGeometry(graph);
  }

  realtimeUpdate() {
    this.edgesGeometry.update();
    this.nodesGeometry.update();
    this.controls.update();
  }

  dispose() {
    this.controls.dispose();
    this.nodesGeometry.dispose();
    this.edgesGeometry.dispose();
  }
}
