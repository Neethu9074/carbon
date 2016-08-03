import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import {getSnapshot} from 'in-stores/snapshot';


export default class IconComponent extends SceneObjectComponent {

  constructor(sceneObject, alternativeId) {
    super(sceneObject, '_snapshot');

    this.addSubscription(getSnapshot(alternativeId ? alternativeId : sceneObject.id)
                           .subscribe(snapshot => this.emitToClient('snapshotChanged', snapshot))
    );
  }
}
