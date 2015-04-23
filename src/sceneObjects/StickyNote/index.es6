'use strict';

import './index.less';

import React from 'react';
import {formatBytes} from 'instana-ui-services/converters';

import serverIpIconPath from './server_ip_icon.png';

const rpt = React.PropTypes;

const StickyNote = React.createClass({

  propTypes: {
    snapshot: rpt.object.isRequired
  },

  render() {
    const contents = this.props.snapshot.get('snapshot');
    return (
      <div>
        <img src={serverIpIconPath} alt="Server" />
        <h2>
          {this.props.snapshot.get('hostId')}
        </h2>
        <p>
          {contents.get('os.name')} {contents.get('os.version')}<br/>
          {contents.get('cpu.count')}x{contents.get('cpu.model')}<br/>
          {formatBytes(contents.get('memory.total'))}
        </p>
      </div>
    );
  }
});

export default StickyNote;
