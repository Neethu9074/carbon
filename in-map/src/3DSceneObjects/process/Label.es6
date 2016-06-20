import {getIconIdBySnapshot} from 'in-sdk/snapshot';
import {getColor} from 'in-sdk/color/color';

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
      additionalParams: { iconSize, type: undefined }
    };
  }

  getPositionHandler() {
    return this.fragment.contentProvider;
  }

  onSnapshotUpdated(snapshot) {
    const newColor = getColor(snapshot);
    const currentColor = this.fragment.contentProvider.contentProvider.color;

    currentColor.r = newColor.r;
    currentColor.g = newColor.g;
    currentColor.b = newColor.b;

    this.factory.removeFragment(this.id);
    this.fragment.additionalParams.type = getIconIdBySnapshot(snapshot);
    this.updateFragment();
  }
}
