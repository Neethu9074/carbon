import RoEmitter from 'roemitter';

import {addSceneObject, removeSceneObject} from 'in-map/stores/sceneStore';
import createCollection from 'in-map/stores/ObjectColletionStream';
import {updateAttribute} from 'in-map/services/geometryAttributes';
import {requestRendering} from 'in-map/stores/renderingStore';
import {BufferGeometry} from 'in-map/3DLibProvider';
import {FACTORY} from 'in-map/misc/TimingConfig';
import Subscriber from 'in-map/misc/Subscriber';


// the default color is (1, 1, 1), because 1 is the neutral value on multiplication
const DEFAULT_COLOR = {
  r: 1,
  g: 1,
  b: 1
};

export default class ASingleMeshFactory extends Subscriber {

  constructor(options = {}) {
    super();

    // stores all added fragments to create the global geometry
    this.fragments = createCollection();

    this.renderOrder = options.renderOrder || 2;
    this.useSceneObjectColors = options.useSceneObjectColors === undefined
      ? true
      : options.useSceneObjectColors;

    // represents the geometry for all combined fragments
    this.geometry = new BufferGeometry();
    this.geometry.dynamic = false;

    this.eventEmitter = new RoEmitter();
    this.addSubscription(this.eventEmitter.on('rebuild').throttle(FACTORY, {leading: false})
                                                        .subscribe(() => this.rebuild()));
  }

  init() {
    this.material = this.getMaterial();

    // a global mesh that stores global geometry
    const mesh = this.mesh = this.getMesh(this.geometry, this.material);
    mesh.renderOrder = this.renderOrder;
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
    // transform map to array
    const fragments = Object.keys(this.fragments.objects).map(key => this.fragments.objects[key]);

    if (fragments.length === 0) {
      if (this.isAddedToScene) {
        removeSceneObject(this.mesh);
        this.isAddedToScene = false;
      }
      return;
    }

    const vertices = [];
    const colors = [];

    let index = 0;
    for (let i = 0, length = fragments.length; i < length; i++) {
      const fragment = fragments[i];
      const transform = fragment.sceneObject.getComponent('transform');
      if (!transform) {
        continue;
      }

      // all it needs for positioning
      const fragmentVertices = fragment.contentProvider.getVertices();
      const position = transform.getPosition();
      const scale = transform.getScale();

      // all it needs for coloring
      const fragmentColors = fragment.contentProvider.getColors(fragmentVertices);

      // use the default color if the factory user denies the using of scene objects color
      const color = this.useSceneObjectColors
        ? fragment.sceneObject.getComponent('color').getColor()
        : DEFAULT_COLOR;

      for (let j = 0, numVertices = fragmentVertices.length; j < numVertices; j += 3) {
        vertices[index] = position.x + scale.x * fragmentVertices[j];
        vertices[index + 1] = position.y + scale.y * fragmentVertices[j + 1];
        vertices[index + 2] = position.z + scale.z * fragmentVertices[j + 2];

        colors[index] = fragmentColors[j] * color.r;
        colors[index + 1] = fragmentColors[j + 1] * color.g;
        colors[index + 2] = fragmentColors[j + 2] * color.b;

        index += 3;
      }
    }

    updateAttribute(this.geometry, 'position', vertices);
    updateAttribute(this.geometry, 'color', colors);

    // on startup or shutdown it can happen that there is a rebuild but the transform component was already disposed
    // or not created. Fragments are skipped then. Because of that it can happen, that there are no vertices on
    // that rebuild so check for array length to avoid prim_count = 0 warnings
    if (!this.isAddedToScene && vertices.length > 0) {
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
