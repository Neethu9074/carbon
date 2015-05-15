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
        'cpu.total.user.5000.mean',
        'cpu.total.sys.5000.mean',
        'cpu.total.idle.5000.mean',
        'cpu.total.wait.5000.mean',
        'cpu.total.nice.5000.mean',
        'cpu.total.steal.5000.mean'
      ]
    });
  },

  showMemoryUsage() {
    eventBus.emit('showMetrics', {
      metrics: ['memory.free.5000.mean']
    });
  }
});

export default Performance;
