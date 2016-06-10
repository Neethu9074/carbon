import ReactDOM from 'react-dom';
import React from 'react';

import MetricList from 'in-map/src/2DSceneObjects/stickyNotes/process/connection/Metric/MetricList';
import {connectionMetricsAreActive$} from 'in-map/src/3DSceneObjects/process/processViewStores';
import StickyNote from 'in-map/src/2DSceneObjects/stickyNotes/StickyNote';
import connectTo from 'in-hoc/connectTo';

import './Metric.less';


const rpt = React.PropTypes;
const block = 'in-sticky-note-process-connection-metric';

const ProcessCluster = connectTo({
  connectionMetricsAreActive: connectionMetricsAreActive$
}, React.createClass({

    displayName: 'process metric sticky',

    propTypes: {
      snapshotId: rpt.string.isRequired,
      connectionMetricsAreActive: rpt.bool
    },

    render() {
      const connectionMetricsAreActive = this.props.connectionMetricsAreActive;
      if (!connectionMetricsAreActive) {
        return false;
      }

      return (
        <div className={block}>
          <MetricList snapshotId={this.props.snapshotId}/>
        </div>
      );
    }
  })
);

export default class StickyNoteProcessMetric extends StickyNote {
  constructor(parent) {
    super({parent, cssClass: block});

    this.render();
  }

  render() {
    ReactDOM.render(
      <ProcessCluster snapshotId={this.parent.id}/>,
      this.container
    );
  }
}
