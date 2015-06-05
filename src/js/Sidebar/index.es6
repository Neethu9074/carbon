'use strict';

import React from 'react';
import {Tabs, Tab} from 'instana-ui-components/Tabs';
import ServerListing from './ServerListing';
import eventBus from 'instana-ui-services/eventbus';

import './index.less';

const Sidebar = React.createClass({

  render() {
    return (
      <Tabs blockIdentifier="in-sidebar">

        <Tab title="Overview">
          <ServerListing />
        </Tab>

        <Tab title="CPU">
          <button onClick={this.showCpuUsage}>
            Show CPU usage
          </button>
        </Tab>

        <Tab title="CPU Load">
          <button onClick={this.showCpuLoad}>
            Show CPU load
          </button>
        </Tab>

        <Tab title="Memory">
          <button onClick={this.showMemoryUsage}>
            Show Memory usage
          </button>
        </Tab>

        <Tab title="Tags">
          Tags?
        </Tab>

      </Tabs>
    );
  },

  showCpuUsage() {
    eventBus.emit('showMetrics', {
      metrics: [
        'cpu.total.user',
        'cpu.total.sys',
        'cpu.total.wait',
        'cpu.total.nice',
        'cpu.total.steal'
      ]
    });
  },

  showCpuLoad() {
    eventBus.emit('showMetrics', {
      metrics: ['load.1min']
    });
  },

  showMemoryUsage() {
    eventBus.emit('showMetrics', {
      metrics: ['memory.free']
    });
  }
});

export default Sidebar;
