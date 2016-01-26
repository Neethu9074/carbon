import ProcessConnection from '../../SceneObjects/Connections/ProcessConnection';
import ConnectionsHandlerComponent from './ConnectionsHandlerComponent';


export default class ProcessConnectionsHandlerComponent extends ConnectionsHandlerComponent {
  constructor({sceneObject}) {
    super({sceneObject, id: '_processConnectionsHandler'});
  }

  createNewConnection(config) {
    return new ProcessConnection(config);
  }

  dispose() {
    super.dispose();
  }
}
