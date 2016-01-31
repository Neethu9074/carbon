import {getColorPool} from 'in-services/util/ColorGenerator';

import CMCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import PCP from '../../SingleMeshFactory/ContentProvider/PointContentProvider';

import PluginLabel from './PluginLabel';


export default class ColouredPluginLabel extends PluginLabel {

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

  onSnapshotUpdated(snapshot) {
    const newColor = getColorPool('processes').getColorRGB(snapshot.get('plugin'));
    const currentColor = this.fragment.contentProvider.contentProvider.color;

    currentColor.r = newColor.r;
    currentColor.g = newColor.g;
    currentColor.b = newColor.b;

    super.onSnapshotUpdated(snapshot);
  }
}
