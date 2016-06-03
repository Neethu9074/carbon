import THREE from 'three';

import NodesGeometry from 'in-components/graphView/components/NodesGeometry';
import EdgesGeometry from 'in-components/graphView/components/EdgesGeometry';
import 'in-components/graphView/components/OrbitControls';


export default class GraphScene {
  constructor(renderer) {
    this.camera = new THREE.PerspectiveCamera(75, 1, 1, 1000);
    this.camera.position.z = 100;
    const scene = this.scene = new THREE.Scene();

    this.nodesGeometry = new NodesGeometry();
    scene.add(this.nodesGeometry.renderableGeometry());

    this.edgesGeometry = new EdgesGeometry();
    scene.add(this.edgesGeometry.renderableGeometry());

    const controls = this.controls = new THREE.OrbitControls(this.camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
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

  realtimeUpdate() {
    this.controls.update();
  }

  dispose() {
    this.nodesGeometry.dispose();
    this.edgesGeometry.dispose();

    // TODO dispose controls
  }
}
