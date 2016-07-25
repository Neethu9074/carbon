import {getIconIdBySnapshot} from 'in-sdk/snapshot';

import CMCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import PCP from '../../SingleMeshFactory/ContentProvider/PointContentProvider';

import BaseLabel from '../common/Label';


export default class Label extends BaseLabel {

  constructor(config) {
    super(config);
  }

  getFragment(iconSize) {
    return {
      id: this.id,
      contentProvider: new PCM({
        contentProvider: new CMCM({
          contentProvider: new PCP()
        })
      }),
      additionalParams: { iconSize, type: 'unknown' }
    };
  }

  getPositionHandler() {
    return this.fragment.contentProvider;
  }

  onSnapshotUpdated(snapshot) {
    this.factory.removeFragment(this.id);
    this.fragment.additionalParams.type = getIconIdBySnapshot(snapshot);
    this.updateFragment();
  }
}
