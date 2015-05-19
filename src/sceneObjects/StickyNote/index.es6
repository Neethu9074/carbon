'use strict';


import React from 'react/addons';
import {formatBytes} from 'instana-ui-services/converters';
import SnapshotIcon from 'instana-ui-components/SnapshotIcon';

import './index.less';

const rpt = React.PropTypes;

const StickyNote = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: rpt.object.isRequired
  },

  render() {
    const contents = this.props.snapshot.get('snapshot');
    return (
      <div>
        <SnapshotIcon className="in-sticky-note__host-icon"
                      snapshot={this.props.snapshot}/>
        <div className="in-sticky-note__content">
          <h2 className="in-sticky-note__host-id">
            {this.props.snapshot.getIn(['snapshot', 'hostname'])}
          </h2>
          <p className="in-sticky-note__details">
            {contents.get('os.name')} {contents.get('os.version')}<br/>
            {contents.get('cpu.count')}x{contents.get('cpu.model')}<br/>
            {formatBytes(contents.get('memory.total'))}
          </p>
        </div>
      </div>
    );
  }
});

export default StickyNote;
