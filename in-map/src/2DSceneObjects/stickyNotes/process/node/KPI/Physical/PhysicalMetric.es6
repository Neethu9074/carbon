import React from 'react';

import StickyNoteProcessMetric from 'in-map/src/2DSceneObjects/stickyNotes/process/node/KPI';
import {getIcon, getLabel} from 'in-sdk/snapshot';

import 'in-map/src/2DSceneObjects/stickyNotes/process/node/KPI/Physical/PhysicalMetric.less';


const block = 'in-sticky-note-process-metric__physical';

export default class StickyNoteProcessMetricCluster extends StickyNoteProcessMetric {

  constructor(parent) {
    super(parent);
  }

  getHeading(snapshot) {
    return (
      <div className={block + '__wrapper'}>
        <img src={getIcon(snapshot)}
              className={block + '__icon'}/>
        {getLabel(snapshot)}
      </div>
    );
  }
}
