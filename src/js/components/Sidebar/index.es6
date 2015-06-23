'use strict';

import React from 'react';
import * as metricsStore from 'instana-ui-services/stores/metrics';

import ServerListing from './ServerListing';
import FloatingFrame from './FloatingFrame';

import './index.less';

const Sidebar = React.createClass({

  render() {
    return (
      <div className='in-sidebar'>
        <FloatingFrame icon='menue' title='Details'>
          <ServerListing />
        </FloatingFrame>

        <FloatingFrame icon='stats' title='Metrics'>
          <button onClick={this.showCpuUsage}>
            Show CPU usage
          </button>
          <br />
          <button onClick={this.showCpuLoad}>
            Show CPU load
          </button>
          <br />
          <button onClick={this.showMemoryUsage}>
            Show Memory usage
          </button>
        </FloatingFrame>
      </div>
    );
  },

  showCpuUsage() {
    metricsStore.select([
      'cpu.total.user',
      'cpu.total.sys',
      'cpu.total.wait',
      'cpu.total.nice',
      'cpu.total.steal'
    ]);
  },

  showCpuLoad() {
    metricsStore.select(['load.1min']);
  },

  showMemoryUsage() {
    metricsStore.select(['memory.free']);
  }

});

export default Sidebar;
