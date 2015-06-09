'use strict';

import React from 'react';
import d3 from 'd3';
import LineChart from 'instana-ui-components/LineChart';
import {create} from 'instana-ui-services/conveyer';
import MetricWithHistoryConveyer from 'instana-ui-services/conveyer/MetricWithHistoryConveyer';

import ServerDetails from './ServerDetails';

import './index.less';

const block = 'in-detail-pane';
const commasFormatter = d3.format(',.0f');
const yAxisTickFormatter = d => commasFormatter(d * 100) + '%';

const DetailPane = React.createClass({
  render() {
    return (
      <div className={block}>
        {this.props.sidebarVisible ?
          <ServerDetails snapshot={this.props.snapshot} />
        : null}

        <div className={block + '__content'}>
          {this.renderLineChart()}
        </div>
      </div>
    );
  },

  renderLineChart() {
    // TODO Ben move date calculation logic to the backend
    // TODO Ben remove old data points
    const since = new Date().getTime() - 1000 * 60 * 5 * 1;
    const metrics = ['cpu.total.user.5000.mean', 'cpu.total.sys.5000.mean'];
    const datasources = metrics.map(metric =>
      create(MetricWithHistoryConveyer, {
        snapshot: this.props.snapshot,
        metric,
        since
      })
    );

    return <LineChart datasources={datasources}
                      width={1200}
                      height={300}
                      yAxisTickFormatter={yAxisTickFormatter} />;
  }
});

export default DetailPane;
