'use strict';

import React from 'react';
import eventBus from 'instana-ui-services/eventbus';

import {Tabs, Tab} from 'instana-ui-components/Tabs';

const Performance = React.createClass({

  render() {
    return (
      <Tabs>
        <Tab title="CPU">
          <button onClick={this.showCpuUsage}>
            Show CPU usage
          </button>
          <button onClick={this.showCpuLoad}>
            Show CPU load
          </button>
        </Tab>
        <Tab title="Memory">
          <button onClick={this.showMemoryUsage}>
            Show Memory usage
          </button>
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

export default Performance;
