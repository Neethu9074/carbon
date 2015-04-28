'use strict';

import './index.less';

import React from 'react/addons';
import {formatBytes} from 'instana-ui-services/converters';

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
        <div className="in-sticky-note__host-icon"></div>
        <div className="in-sticky-note__content">
          <h2 className="in-sticky-note__host-id">
            {this.props.snapshot.get('hostId')}
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
