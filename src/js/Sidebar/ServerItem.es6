'use strict';

import './ServerItem.less';

import React from 'react/addons';

import {formatBytes} from 'instana-ui-services/converters';

const cx = React.addons.classSet;

const ServerItem = React.createClass({
  getInitialState() {
    return {
      open: false
    };
  },

  render() {
    const snap = this.props.snapshot.get('snapshot');

    const liClasses = cx({
      'in-sidebar-server-listing__snapshot': true,
      'in-sidebar-server-listing__snapshot--open': this.state.open
    });


    return (
      <li className={liClasses}>
        <h2 className="in-sidebar-server-listing__snapshot-label"
            onClick={this.toggle}>
          {this.props.snapshot.get('hostId')}
        </h2>

        <dl className="in-sidebar-server-listing__listing">
          <dt>OS</dt>
          <dd>
            {snap.get('os.name')} {snap.get('os.version')}
          </dd>

          <dt>CPU</dt>
          <dd>
            {snap.get('cpu.count')}x{snap.get('cpu.model')}
          </dd>

          <dt>MEM</dt>
          <dd>
            {formatBytes(snap.get('memory.total'))}
          </dd>
        </dl>
      </li>
    );
  },

  toggle() {
    this.setState({
      open: !this.state.open
    });
  }
});

export default ServerItem;
