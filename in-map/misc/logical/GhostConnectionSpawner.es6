import DragConnection from 'in-map/misc/logical/DragConnection';
import ghosts from 'in-map/stores/logical/ghostsStore';

export default class GhostEdgeSpawnerComponent {
  constructor(sceneObject) {
    this.ghostConnection = null;
    this.sourceNode = sceneObject.sourceNode;
    this.destinationNode = sceneObject.destinationNode;
  }

  initEvents() {
    this.activeGhostNodesSubscribtion = ghosts.stream.subscribe(activeGhosts => {
      const sourcePosition = this.sourceNode.getPosition();
      const destinationPosition = this.destinationNode.getPosition();
      if (!sourcePosition || !destinationPosition) {
        return;
      }

      const source = activeGhosts[this.sourceNode.id];
      const destination = activeGhosts[this.destinationNode.id];

      // if there is a new ghost node which is a ghost of one of this connections endpoints
      if (source || destination) {
        this.ghostConnection = new DragConnection(source ? destinationPosition : sourcePosition);
      } else {
        this.disposeGhostConnection();
      }
    });
  }

  disposeGhostConnection() {
    if (this.ghostConnection) {
      this.ghostConnection.dispose();
      this.ghostConnection = null;
    }
  }

  dispose() {
    // it can happen, that this.initEvents is never called. This edgecase happens, when source or destination node are marked as disposed.
    // ghost connections are therefore just created and disposed directly without beeing initialized
    if (this.activeGhostNodesSubscribtion) {
      this.activeGhostNodesSubscribtion.dispose();
      this.activeGhostNodesSubscribtion = null;
    }

    this.disposeGhostConnection();

    this.destinationNode = null;
    this.sourceNode = null;
  }
}
