import PCP from 'in-map/singleMeshFactories/ContentProvider/PointContentProvider';
import createFragment from 'in-map/singleMeshFactories/Fragment';

import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import { getFactory } from 'in-map/stores/factoriesStore';
import { ZERO } from 'in-map/misc/fixedVectors';

export default class IconComponent extends SceneObjectComponent {
  constructor(sceneObject, iconSize, getIconPosition) {
    super(sceneObject, '_icon');

    this.getIconPositionCallback = getIconPosition;

    this.factory = getFactory('icons');
    this.fragment = createFragment(this.id, sceneObject, PCP, {
      positionOffset: ZERO.clone(),
      type: undefined,
      iconSize
    });
    this.factory.add(this.fragment);
  }

  initEvents() {
    const sceneObject = this.sceneObject;
    const transformationChangedCallback = this.transformationChanged.bind(this);

    this.addSubscription(sceneObject.eventEmitter.on('transformationChanged').subscribe(transformationChangedCallback));
  }

  transformationChanged(transform) {
    this.fragment.additionalParams.positionOffset.copy(
      this.getIconPositionCallback(transform.position, transform.scale)
    );
    this.factory.needsUpdate();
  }

  dispose() {
    super.dispose();

    this.factory.remove(this.id);
    this.factory.needsUpdate();

    this.fragment = null;
    this.factory = null;
  }
}
