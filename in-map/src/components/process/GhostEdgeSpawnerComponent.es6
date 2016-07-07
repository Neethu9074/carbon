import DragConnection from 'in-map/src/3DSceneObjects/process/DragConnection';
import Component from 'in-map/src/components/common/Component/Component';
import {activeGhosts$} from 'in-map/src/stores/process/activeGhosts';


export default class GhostEdgeSpawnerComponent extends Component {
  constructor({sceneObject}) {
    super(sceneObject, '_ghostEdgeSpawner');

    this.ghostConnection = null;

    this.activeGhostNodesSubscribtion = activeGhosts$.subscribe(activeGhosts => {
      const nodeA = activeGhosts[sceneObject.sourceNode.id];
      const nodeB = activeGhosts[sceneObject.destinationNode.id];

      // if there is a new ghost node which is a ghost of one of this connections endpoints
      if (nodeA || nodeB) {
        this.ghostConnection = new DragConnection(
          nodeA ?
            sceneObject.destinationNode.getComponent('position').getPosition() :
            sceneObject.sourceNode.getComponent('position').getPosition()
        );
      } else {
        this.disposeGhostConnection();
      }
    });

    this.initialized();
  }

  update() {
    this.needsUpdate = false;
  }

  disposeGhostConnection() {
    if (this.ghostConnection) {
      this.ghostConnection.dispose();
      this.ghostConnection = null;
    }
  }

  dispose() {
    super.dispose();

    this.disposeGhostConnection();

    this.activeGhostNodesSubscribtion.dispose();
    this.activeGhostNodesSubscribtion = null;
  }
}
