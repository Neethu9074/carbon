'use strict';

import React from 'react/addons';

import * as metricsStore from 'instana-ui-services/stores/metrics';

const block = 'in-sidebar-metrics';

const Metrics = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render() {
    return (
      <div className={block}>
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

export default Metrics;
