import irpt from 'react-immutable-proptypes';
import ReactDOM from 'react-dom';
import React from 'react';

import StickyNote from 'in-map/src/2DSceneObjects/stickyNotes/StickyNote';
import getForgeComponent from 'in-services/getForgeComponent';
import getSnapshot from 'in-hoc/getSnapshot';
import Jail from 'in-components/Jail';

import 'in-map/src/2DSceneObjects/stickyNotes/process/node/KPI/Metric.less';


const rpt = React.PropTypes;
const block = 'in-sticky-note-process-metric';

const Metric = getSnapshot(React.createClass({

  displayName: 'process node metric sticky',

  propTypes: {
    snapshotId: rpt.string.isRequired,
    getHeading: rpt.func.isRequired,
    snapshot: irpt.map
  },

  render() {
    const snapshot = this.props.snapshot;
    if (!snapshot) {
      return false;
    }

    return (
      <div>
        <div className={block + '__heading'}>
          {this.props.getHeading(snapshot)}
        </div>
        <div className={block + '__metrics'}>
          <Jail component={this.getForgeSpecificComponent('KPI')}
                props={{snapshot}}/>
        </div>
      </div>
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
      <Metric snapshotId={this.parent.id}
              getHeading={this.getHeading}/>,
      this.container
    );
  }
}
