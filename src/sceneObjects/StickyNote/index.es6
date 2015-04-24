'use strict';

import './index.less';

import React from 'react/addons';
import {formatBytes} from 'instana-ui-services/converters';

import serverIpIconPath from './server_ip_icon.png';

const rpt = React.PropTypes;

const StickyNote = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: rpt.object.isRequired,
    zoomLevel: rpt.number.isRequired,
    hostNumber: rpt.number.isRequired
  },

  render() {
    const contents = this.props.snapshot.get('snapshot');
    return (
      <div>
        <div className="host-number">
          {this.props.hostNumber}
        </div>
        {this.props.zoomLevel < 100 ?
          <div className="inline">
            <img src={serverIpIconPath} alt="Server" />
            <h2>
              {this.props.snapshot.get('hostId')}
            </h2>
          </div>
        : null}
        {this.props.zoomLevel < 85 ?
          <p>
            {contents.get('os.name')} {contents.get('os.version')}<br/>
            {contents.get('cpu.count')}x{contents.get('cpu.model')}<br/>
            {formatBytes(contents.get('memory.total'))}
          </p>
        : null}

      </div>
    );
  }
});

export default StickyNote;
