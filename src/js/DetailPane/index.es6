'use strict';

import React from 'react';
import d3 from 'd3';
import LineChart from 'instana-ui-components/LineChart';
import {create} from 'instana-ui-services/conveyer';
import MetricWithHistoryConveyer from 'instana-ui-services/conveyer/MetricWithHistoryConveyer';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import {theme} from 'instana-ui-services/theme';
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
      datasources: null,
      cpuUsageUser: 0,
      cpuUsageSystem: 0,
      cpuUsageIdle: 0
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

    const metrics = [
      'cpu.total.user',
      'cpu.total.sys',
      'cpu.total.wait',
      'cpu.total.nice',
      'cpu.total.steal'
    ];
    const datasources = metrics.map(metric =>
      create(MetricWithHistoryConveyer, {
        snapshot: this.props.snapshot,
        metric,
        timeframe: 1000 * 60 * 5
      })
    );

    datasources.forEach((datasource, i) => {
      this.addSubscription(
        datasource.subscribe(dataset => {
          const currentValue = dataset.values[dataset.values.length - 1][1];
          this.setState({
            [metrics[i]]: commasFormatter(currentValue * 100)
          });
        })
      );
    });

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
          {this.state.datasources !== null ?
            <div className={block + '__chart'}>

              <div className={block + '__chart-heading'}>
                <h1 className={block + '__chart-title'}>
                  CPU Usage
                </h1>

                <dl className={block + '__chart-metrics'}>
                  <div className={block + '__chart-metric'}>
                    <dt className={block + '__chart-metric-title'}
                        style={{color: theme.chart.strokeColors[0]}}>
                      User
                    </dt>
                    <dd className={block + '__chart-metric-value'}>
                      {this.state['cpu.total.user']}
                      <span className={block + '__chart-metric-percentage'}>
                        %
                      </span>
                    </dd>
                  </div>

                  <div className={block + '__chart-metric'}>
                    <dt className={block + '__chart-metric-title'}
                        style={{color: theme.chart.strokeColors[1]}}>
                      System
                    </dt>
                    <dd className={block + '__chart-metric-value'}>
                      {this.state['cpu.total.sys']}
                      <span className={block + '__chart-metric-percentage'}>
                        %
                      </span>
                    </dd>
                  </div>

                  <div className={block + '__chart-metric'}>
                    <dt className={block + '__chart-metric-title'}
                        style={{color: theme.chart.strokeColors[2]}}>
                      Wait
                    </dt>
                    <dd className={block + '__chart-metric-value'}>
                      {this.state['cpu.total.wait']}
                      <span className={block + '__chart-metric-percentage'}>
                        %
                      </span>
                    </dd>
                  </div>

                  <div className={block + '__chart-metric'}>
                    <dt className={block + '__chart-metric-title'}
                        style={{color: theme.chart.strokeColors[3]}}>
                      Nice
                    </dt>
                    <dd className={block + '__chart-metric-value'}>
                      {this.state['cpu.total.nice']}
                      <span className={block + '__chart-metric-percentage'}>
                        %
                      </span>
                    </dd>
                  </div>

                  <div className={block + '__chart-metric'}>
                    <dt className={block + '__chart-metric-title'}
                        style={{color: theme.chart.strokeColors[4]}}>
                      Steal
                    </dt>
                    <dd className={block + '__chart-metric-value'}>
                      {this.state['cpu.total.steal']}
                      <span className={block + '__chart-metric-percentage'}>
                        %
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              {this.renderLineChart()}
            </div>
          : null}
        </div>
      </div>
    );
  },

  renderLineChart() {
    return <LineChart datasources={this.state.datasources}
                      width={this.state.width}
                      height={300}
                      yAxisTickFormatter={yAxisTickFormatter} />;
  }
});

export default DetailPane;
