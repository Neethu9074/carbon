import {combineLatest} from 'reactive-observables';

import PCP from 'in-map/singleMeshFactories/ContentProvider/PointContentProvider';
import createFragment from 'in-map/singleMeshFactories/Fragment';

import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent/SceneObjectComponent';
import {getFactory} from 'in-map/misc/Factories';
import {getIconPath} from 'in-sdk/iconRegistry';
import {ZERO} from 'in-map/misc/fixedVectors';


export default class IconComponent extends SceneObjectComponent {

  constructor(sceneObject, iconSize = 1) {
    super(sceneObject, '_icon');

    this.factory = getFactory('icons');
    this.fragment = createFragment(this.id,
                                   sceneObject,
                                   PCP,
                                   {
                                     positionOffset: ZERO.clone(),
                                     type: undefined,
                                     iconSize
                                   });
    this.factory.add(this.fragment);

    this.addSubscription(
      sceneObject.eventEmitter.on('snapshotChanged').subscribe(snapshot => {
        this.fragment.additionalParams.type = getIconPath(snapshot);
        this.factory.needsUpdate();
      }),

      combineLatest([
        sceneObject.eventEmitter.on('positionChanged'),
        sceneObject.eventEmitter.on('scaleChanged')
      ]).subscribe(params => {
        const scale = params[1];
        this.fragment.additionalParams.positionOffset.set(scale.x / 2, scale.y + 0.25, -scale.z / 2);
        this.factory.needsUpdate();
      })
    );
  }

  dispose() {
    super.dispose();

    this.factory.remove(this.id);
    this.factory.needsUpdate();

    this.fragment = null;
    this.factory = null;
  }
}
