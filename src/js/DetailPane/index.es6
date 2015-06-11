'use strict';

import React from 'react';
import d3 from 'd3';
import LineChart from 'instana-ui-components/LineChart';
import {create} from 'instana-ui-services/conveyer';
import MetricWithHistoryConveyer from 'instana-ui-services/conveyer/MetricWithHistoryConveyer';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import {on} from 'reactive-observables';

import ServerDetails from './ServerDetails';

import './index.less';

const block = 'in-detail-pane';
const commasFormatter = d3.format(',.0f');
const yAxisTickFormatter = d => commasFormatter(d * 100) + '%';

const DetailPane = React.createClass({
  mixins: [SubscriptionMixin],

  getInitialState() {
    return {
      width: 1200,
      datasources: null
    };
  },

  componentDidMount() {
    this.addSubscription(
      on(window, 'resize')
        .debounce(500)
        .subscribe(() => {
          const width = this.calculateChartWidth();
          this.setState({width});
        })
    );

    const metrics = ['cpu.total.user', 'cpu.total.sys'];
    const datasources = metrics.map(metric =>
      create(MetricWithHistoryConveyer, {
        snapshot: this.props.snapshot,
        metric,
        timeframe: 1000 * 60 * 5
      })
    );

    this.setState({
      width: this.calculateChartWidth(),
      datasources
    });
  },

  calculateChartWidth() {
    const domNode = React.findDOMNode(this.refs.content);
    return parseInt(window.getComputedStyle(domNode).width, 10);
  },

  render() {
    return (
      <div className={block}>
        {this.props.sidebarVisible ?
          <ServerDetails snapshot={this.props.snapshot} />
        : null}

        <div className={block + '__content'} ref='content'>
          {this.renderLineChart()}
        </div>
      </div>
    );
  },

  renderLineChart() {
    if (this.state.datasources === null) {
      return null;
    }

    return <LineChart datasources={this.state.datasources}
                      width={this.state.width}
                      height={300}
                      yAxisTickFormatter={yAxisTickFormatter} />;
  }
});

export default DetailPane;
