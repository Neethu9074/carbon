import * as constants from 'in-forge/constants';

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
    let type = snapshot.get('plugin');

    const osPlugin = constants.plugins.os;
    if (type === osPlugin) {
      const os = snapshot.getIn(['data', 'os.name']);
      type = osPlugin + '_linux'; // linux as default

      if (os) {
        if (os.match(/linux/i)) {
          type = osPlugin + '_linux';
        } else if (os.match(/windows/i)) {
          type = osPlugin + '_windows';
        } else if (os.match(/mac/i)) {
          type = osPlugin + '_apple';
        }
      }
    }

    this.fragment.additionalParams.type = type;
    this.updateFragment();
  }
}
