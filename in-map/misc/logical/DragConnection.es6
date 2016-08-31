import fragmentShader from 'in-map/singleMeshFactories/basicFragmentShader.glsl';
import vertexShader from 'in-map/singleMeshFactories/basicVertexShader.glsl';

import {RawShaderMaterial, BufferGeometry, Line} from 'in-map/3DLibProvider';
import {addSceneObject, removeSceneObject} from 'in-map/stores/sceneStore';
import {updateAttribute} from 'in-map/services/geometryAttributes';
import {eventBus} from 'in-map/services/eventBus';


const GHOST_MATERIAL = new RawShaderMaterial({
  fragmentShader: fragmentShader,
  vertexShader: vertexShader,
  linewidth: navigator.platform.indexOf('Win') < 0 ? 2 : 1,
  transparent: true,
  uniforms: {
    opacity: {
      type: 'f',
      value: 0.2
    }
  }
});

export default class DragConnection {
  constructor(fromPosition) {
    const geometry = new BufferGeometry();
    const sceneObject = this.sceneObject = new Line(geometry, GHOST_MATERIAL);

    addSceneObject(sceneObject);

    this.dragObjectSubscription =  eventBus.on('dragObject').subscribe(newPos =>
      updateAttribute(geometry, 'position', [
        fromPosition.x, fromPosition.y, fromPosition.z,
        newPos.x, newPos.y, newPos.z
      ])
    );
  }

  dispose() {
    this.dragObjectSubscription.dispose();

    removeSceneObject(this.sceneObject);

    this.sceneObject.geometry.dispose();
    this.sceneObject = null;
  }
}
