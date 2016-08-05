import {getIconPath} from 'in-sdk/iconRegistry';

import BaseLabel from '../common/Label';

import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import PCP from '../../SingleMeshFactory/ContentProvider/PointContentProvider';


export default class Label extends BaseLabel {

  constructor(config) {
    super(config);

    this.addSubscription(this.eventEmitter.on('snapshotChanged').subscribe(this.onSnapshotUpdated.bind(this)));
  }

  getFragment(iconSize) {
    return {
      id: this.id,
      contentProvider: new PCM({
        contentProvider: new PCP()
      }),
      additionalParams: { iconSize, type: undefined }
    };
  }

  getPositionHandler() {
    return this.fragment.contentProvider;
  }

  onSnapshotUpdated(snapshot) {
    this.factory.removeFragment(this.id);
    this.fragment.additionalParams.type = getIconPath(snapshot);
    this.updateFragment();
  }
}
