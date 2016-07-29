import RoEmitter from 'roemitter';
import THREE from 'three';

import {addSceneObject, removeSceneObject} from 'in-map/stores/sceneStore';
import createCollection from 'in-map/stores/ObjectColletionStream';
import {requestRendering} from 'in-map/stores/renderingStore';
import Subscriber from 'in-map/misc/Subscriber';


const WHITE = {
  r: 1,
  g: 1,
  b: 1
}

export default class ASingleMeshFactory extends Subscriber {

  constructor() {
    super();

    // stores all added fragments to create the global geometry
    this.fragments = createCollection();

    // represents the geometry for all combined fragments
    this.geometry = new THREE.BufferGeometry();
    this.geometry.dynamic = false;

    this.eventEmitter = new RoEmitter();
    this.addSubscriptions([
      this.eventEmitter.on('rebuild').throttle(250).subscribe(shouldRebuild => {
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
      const fragmentVertices = fragment.contentProvider.getVertices();
      const transform = fragment.sceneObject.getComponent('transform');
      const position = transform.getPosition();
      const scale = transform.getScale();

      const fragmentColors = fragment.contentProvider.getColors();
      const colorComponent = fragment.sceneObject.getComponent('color');
      const color = colorComponent ? colorComponent.getColor() : WHITE;

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

    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;

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
