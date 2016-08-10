import RoEmitter from 'roemitter';
import THREE from 'three';

import {addSceneObject, removeSceneObject} from 'in-map/stores/sceneStore';
import createCollection from 'in-map/stores/ObjectColletionStream';
import {updateAttribute} from 'in-map/services/geometryAttributes';
import {requestRendering} from 'in-map/stores/renderingStore';
import Subscriber from 'in-map/misc/Subscriber';


export default class ASingleMeshFactory extends Subscriber {

  constructor(renderOrder = 2) {
    super();

    // stores all added fragments to create the global geometry
    this.fragments = createCollection();

    this.renderOrder = renderOrder;

    // represents the geometry for all combined fragments
    this.geometry = new THREE.BufferGeometry();
    this.geometry.dynamic = false;

    this.eventEmitter = new RoEmitter();
    this.addSubscriptions([
      this.eventEmitter.on('rebuild').debounce(250).subscribe(shouldRebuild => {
        if (shouldRebuild) {
          this.rebuild();
        }
      })
    ]);
  }

  init() {
    this.material = this.getMaterial();

    // a global mesh that stores global geometry
    const mesh = this.mesh = this.getMesh(this.geometry, this.material);
    mesh.rotationAutoUpdate = false;
    mesh.matrixAutoUpdate = false;
    mesh.frustumCulled = false;
    mesh.renderOrder = this.renderOrder;
  }

  add(fragment) {
    this.fragments.add(fragment.id, fragment);
  }

  remove(id) {
    this.fragments.remove(id);
  }

  rebuild() {
    this.eventEmitter.emit('rebuild', false);

    // transform map to array
    const fragments = Object.keys(this.fragments.objects).map(key => this.fragments.objects[key]);

    if (fragments.length === 0) {
      if (this.isAddedToScene) {
        removeSceneObject(this.mesh);
        this.isAddedToScene = false;
        return;
      }
    }

    const vertices = [];
    const colors = [];

    let index = 0;
    for (let i = 0, length = fragments.length; i < length; i++) {
      const fragment = fragments[i];

      // all it needs for positioning
      const fragmentVertices = fragment.contentProvider.getVertices();
      const transform = fragment.sceneObject.getComponent('transform');
      const position = transform.getPosition();
      const scale = transform.getScale();

      // all it needs for coloring
      const fragmentColors = fragment.contentProvider.getColors(fragmentVertices);
      const color = fragment.sceneObject.getComponent('color').getColor();

      for (let j = 0, numVertices = fragmentVertices.length; j < numVertices; j += 3) {
        vertices[index] = position.x + (scale.x * fragmentVertices[j]);
        vertices[index + 1] = position.y + (scale.y * fragmentVertices[j + 1]);
        vertices[index + 2] = position.z + (scale.z * fragmentVertices[j + 2]);

        colors[index] = fragmentColors[j] * color.r;
        colors[index + 1] = fragmentColors[j + 1] * color.g;
        colors[index + 2] = fragmentColors[j + 2] * color.b;

        index += 3;
      }
    }

    const geometry = this.geometry;

    updateAttribute(geometry, 'position', vertices);
    updateAttribute(geometry, 'color', colors);

    if (vertices.length > 0 && !this.isAddedToScene) {
      addSceneObject(this.mesh);
      this.isAddedToScene = true;
    }

    requestRendering();
  }

  needsUpdate() {
    this.eventEmitter.emit('rebuild', true);
  }

  dispose() {
    super.dispose();

    removeSceneObject(this.mesh);

    this.eventEmitter.dispose();
    this.eventEmitter = null;
  }
}
