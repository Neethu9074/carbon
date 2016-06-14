import irpt from 'react-immutable-proptypes';
import ReactDOM from 'react-dom';
import React from 'react';

import StickyNote from 'in-map/src/2DSceneObjects/stickyNotes/StickyNote';
import getForgeComponent from 'in-services/getForgeComponent';
import getSnapshot from 'in-hoc/getSnapshot';
import Jail from 'in-components/Jail';

import './Metric.less';


const rpt = React.PropTypes;
const block = 'in-sticky-connection-process-metric';

const ProcessCluster = getSnapshot(React.createClass({

  displayName: 'process connection metric sticky',

  propTypes: {
    snapshotId: rpt.string.isRequired,
    snapshot: irpt.map
  },

  render() {
    const snapshot = this.props.snapshot;
    if (!snapshot) {
      return false;
    }

    return (
      <Jail component={this.getForgeSpecificComponent('KPI')}
            props={{snapshot}}/>
    );
  },

  getForgeSpecificComponent(name) {
    const plugin = this.props.snapshot.get('plugin');
    return getForgeComponent('./' + plugin + '/' + name + '.es6');
  }
}));

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
