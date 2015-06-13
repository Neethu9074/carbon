'use strict';

import React from 'react';
import d3 from 'd3';
import {State} from 'react-router';
import Immutable from 'immutable';

import LineChart from 'instana-ui-components/LineChart';
import {create} from 'instana-ui-services/conveyer';
import MetricWithHistoryConveyer from 'instana-ui-services/conveyer/MetricWithHistoryConveyer';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import {theme} from 'instana-ui-services/theme';
import {on} from 'reactive-observables';
import * as selectedSnapshotStore from 'instana-ui-services/stores/selectedSnapshot';

import ServerDetails from './ServerDetails';

import './index.less';

const block = 'in-detail-pane';
const commasFormatter = d3.format(',.0f');
const yAxisTickFormatter = d => commasFormatter(d * 100) + '%';

const DetailPane = React.createClass({
  mixins: [SubscriptionMixin, State],

  statics: {
    willTransitionTo(transition, params) {
      const snapshotId = Immutable.Map({
        steadyId: params.steadyId,
        pluginId: params.pluginId,
        hostId: params.hostId
      });
      selectedSnapshotStore.select(snapshotId);
    }
  },

  getInitialState() {
    return {
      snapshot: null,
      width: -1,
      datasources: null
    };
  },

  componentDidMount() {
    // we need to observe the available size in order to resize the chart
    this.addSubscription(
      on(window, 'resize')
        .debounce(500)
        .subscribe(() => {
          const width = this.calculateChartWidth();
          this.setState({width});
        })
    );

    // unfortunately the SubscriptionMixin alone is insufficient for this
    // component. The DetailPane needs to differentiate between the window
    // resize subscriptions and the snapshot related subscriptions, e.g.
    // metrics, that can change more frequently.
    this.snapshotRelatedSubscriptions = [];

    this.addSubscription(
      selectedSnapshotStore.selectedSnapshot
      .filter(snapshot => !!snapshot)
      .subscribe(snapshot => {
        this.snapshotRelatedSubscriptions.forEach(d => d.dispose());
        this.snapshotRelatedSubscriptions.length = 0;

        const metrics = [
          'cpu.total.user',
          'cpu.total.sys',
          'cpu.total.wait',
          'cpu.total.nice',
          'cpu.total.steal'
        ];
        const datasources = metrics.map(metric =>
          create(MetricWithHistoryConveyer, {
            snapshot: snapshot,
            metric,
            timeframe: 1000 * 60 * 5
          })
        );

        datasources.forEach((datasource, i) => {
          this.snapshotRelatedSubscriptions.push(
            datasource.subscribe(dataset => {
              const currentValue = dataset.values[dataset.values.length - 1][1];
              this.setState({
                [metrics[i]]: commasFormatter(currentValue * 100)
              });
            })
          );
        });

        this.setState({
          datasources,
          snapshot
        });
      })
    );
  },

  // Observe componentDidUpdate as componentDidMount does not necessarily
  // define the point in time at which the root HTML is available due to
  // async rendering.
  componentDidUpdate() {
    // We may only try to calculate the width once. Without this check, this
    // will result in an endless loop.
    if (this.state.width === -1) {
      const width = this.calculateChartWidth();
      if (width !== -1) {
        this.setState({width});
      }
    }
  },

  componentWillUnmount() {
    this.snapshotRelatedSubscriptions.forEach(d => d.dispose());
  },

  calculateChartWidth() {
    const domNode = React.findDOMNode(this.refs.content);
    if (domNode) {
      return parseInt(window.getComputedStyle(domNode).width, 10);
    }
    return -1;
  },

  render() {
    if (!this.state.snapshot) {
      // TODO show loading indicator?
      return null;
    }

    return (
      <div className={block}>
        <ServerDetails snapshot={this.state.snapshot} />

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
                      width={this.state.width === -1 ? 700 : this.state.width}
                      height={300}
                      yAxisTickFormatter={yAxisTickFormatter} />;
  }
});

export default DetailPane;
