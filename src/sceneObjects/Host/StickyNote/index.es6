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
    const data = this.props.snapshot.get('data');
    return (
      <div>
        <div className="in-sticky-note__line"></div>
        <div className="in-sticky-after_line">
          <SnapshotIcon className="in-sticky-note__host-icon"
                        snapshot={this.props.snapshot}/>
          <div className="in-sticky-note__content">
            <h2 className="in-sticky-note__host-id">
              {data.get('hostname')}
            </h2>
            <p className="in-sticky-note__details">
              {data.get('os.name')} {data.get('os.version')}<br/>
              {data.get('cpu.count')}x{data.get('cpu.model')}<br/>
              {formatBytes(data.get('memory.total'))}
            </p>
          </div>
        </div>
      </div>
    );
  }
});

export default StickyNote;
