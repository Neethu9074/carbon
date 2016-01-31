import {getIconIdBySnapshot} from 'in-sdk/snapshot';

import Label from './Label';

import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import PCP from '../../SingleMeshFactory/ContentProvider/PointContentProvider';


export default class PluginLabel extends Label {

  constructor(config) {
    super(config);
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
    this.fragment.additionalParams.type = getIconIdBySnapshot(snapshot);
    this.updateFragment();
  }
}
