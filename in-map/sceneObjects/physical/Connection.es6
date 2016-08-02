import LCP from 'in-map/singleMeshFactories/ContentProvider/LineContentProvider';
import MeshComponent from 'in-map/sceneObjectComponents/MeshComponent';

import {
  shortenPathAtSourceAndDestination,
  addArrowToDestination,
  getManhattanPath,
  flatten
} from 'in-map/misc/Connections';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import {emptyArray} from 'in-services/fixedObjects';
import nodes from 'in-map/stores/physical/nodes';


export default class Connection extends SceneObject {

  constructor(params) {
    super(params.id);

    this.destinationId = params.destinationId;
    this.sourceId = params.sourceId;
    this.destinationNode = null;
    this.sourceNode = null;
  }

  initComponents() {
    super.initComponents();

    this.lineContentProvider = new LCP(this.getVertices.bind(this), this.getColors.bind(this));
  }

  initEvents() {
    super.initEvents();

    this.addSubscriptions([
      nodes.stream.subscribe(_nodes => {
        this.sourceNode = _nodes.objects[this.sourceId];
        this.destinationNode = _nodes.objects[this.destinationId];
        this.eventEmitter.emit('nodesAreAvailableChanged', this.sourceNode && this.destinationNode);
      }),

      this.eventEmitter.on('nodesAreAvailableChanged').distinct().subscribe(nodesAreAvailable => {
        if (nodesAreAvailable) {
          this.addComponent('mesh', new MeshComponent(this, this.lineContentProvider, 'connections'));
        } else {
          this.removeComponent('mesh');
        }
      })
    ]);
  }

  getVertices() {
    const fromTransform = this.sourceNode.getComponent('transform');
    const toTransform = this.destinationNode.getComponent('transform');
    if (!fromTransform || !toTransform) {
      return emptyArray;
    }
    const from = fromTransform.getPosition();
    const to = toTransform.getPosition();
    return flatten(
           addArrowToDestination(
           shortenPathAtSourceAndDestination(
           getManhattanPath(from.x, from.z, to.x, to.z))));
  }

  getColors(vertices) {
    const colors = [];
    for (let i = 0, length = vertices.length; i < length; i++) {
      colors.push(1);
    }
    return colors;
  }

  dispose() {
    super.dispose();

    this.lineContentProvider = null;
    this.destinationNode = null;
    this.destinationId = null;
    this.sourceNode = null;
    this.sourceId = null;
  }
}
