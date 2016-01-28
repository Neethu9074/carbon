import {combineLatest} from 'reactive-observables';

import {getColorPool} from 'in-services/util/ColorGenerator';
import {getSnapshot} from 'in-stores/snapshot';

import CLCP from '../../SingleMeshFactory/ContentProvider/ColoredLineContentProvider';
import BaseConnection from './BaseConnection';


export const allConnections = [];

export default class ProcessConnection extends BaseConnection {

  constructor(params) {
    super(params);

    this.addSubscription(
       combineLatest([getSnapshot(this.sourceNode.id), getSnapshot(this.destinationNode.id)])
      .subscribe(snapshots => this.setColorFromSnapshots(snapshots[0], snapshots[1]))
    );
  }

  setupGeometry() {
    this.fragment = {
      id: this.id,
      contentProvider: new CLCP()
    };
  }

  updateGeometry() {
    const lines = this.getLineVertices(this.sourceNode, this.destinationNode);
    this.fragment.contentProvider.setLines(lines);
    this.fragment.contentProvider.setColor([0, 0, 0, 0, 0, 0]);

    this.scene.lineFactory.addFragment(this.fragment);
  }

  calculatePath(fromPos, toPos) {
    fromPos.x -= 0.5;
    fromPos.z += 0.5;
    toPos.x -= 0.5;
    toPos.z += 0.5;

    return [fromPos, toPos];
  }

  postProPath(path) {
    return path;
  }

  setColorFromSnapshots(sourceSnapshot, destinationSnapshot) {
    const colorPool = getColorPool('processes');
    const sourceColor = colorPool.getColorRGB(sourceSnapshot.get('plugin'));
    const destinationColor = colorPool.getColorRGB(destinationSnapshot.get('plugin'));

    this.fragment.contentProvider.setColor([
      sourceColor.r, sourceColor.g, sourceColor.b,
      destinationColor.r, destinationColor.g, destinationColor.b
    ]);
    this.scene.lineFactory.addFragment(this.fragment);
  }

  dispose() {
    this.scene.lineFactory.removeFragment(this.id);
    super.dispose();
  }
}
