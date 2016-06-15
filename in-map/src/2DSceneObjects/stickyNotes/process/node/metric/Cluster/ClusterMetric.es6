import StickyNoteProcessMetric from 'in-map/src/2DSceneObjects/stickyNotes/process/node/metric/Metric';
import {getLabel} from 'in-sdk/snapshot';


export default class StickyNoteProcessMetricCluster extends StickyNoteProcessMetric {

  constructor(parent) {
    super(parent);
  }

  getHeading(snapshot) {
    return getLabel(snapshot);
  }
}
