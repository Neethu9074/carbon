'use strict';

import './Sidebar.less';

import React from 'react';
import invariant from 'invariant';

const Sidebar = React.createClass({
  propTypes: {
    snapshot: React.PropTypes.object.isRequired
  },

  render() {
    return (
      <div className="in-sidebar">
        <h1>
          {this.props.snapshot.get('hostId')}
          <small>
            {this.props.snapshot.get('steadyId')}
          </small>
        </h1>

        <dl>
          <dt>IPs</dt>
          <dd>{this.getIps()}</dd>

          <dt>Memory</dt>
          <dd>
            {this.props.snapshot.get('snapshot').get('memory.total')} bytes
          </dd>

          <dt>Operating System</dt>
          <dd>{this.getOs()}</dd>
        </dl>
      </div>
    );
  },

  getIps() {
    return JSON.parse(this.props.snapshot.get('snapshot').get('interfaces'))
    .reduce((agg, i) => agg.concat(i.ips), [])
    .join(', ');
  },

  getOs() {
    const snapshot = this.props.snapshot.get('snapshot');
    return `${snapshot.get('os.name')}
      ${snapshot.get('os.version')}
      (${snapshot.get('os.arch')})`;
  }
});

export default Sidebar;
