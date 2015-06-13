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

import OSDetailPaneSidebar from './forge/OSDetailPaneSidebar';
import OSDetailPaneContent from './forge/OSDetailPaneContent';

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
      width: 700
    };
  },

  componentDidMount() {
    // we need to observe the available size in order to resize the chart
    this.addSubscription(
      on(window, 'resize')
        .debounce(500)
        .subscribe(() => {
          this.setState({width: this.calculateChartWidth()});
        })
    );

    this.addSubscription(
      selectedSnapshotStore.selectedSnapshot.subscribe(snapshot => {
        this.setState({snapshot});
      })
    );

    this.setState({width: this.calculateChartWidth()});
  },

  calculateChartWidth() {
    const domNode = React.findDOMNode(this.refs.content);
    return parseInt(window.getComputedStyle(domNode).width, 10);
  },

  render() {
    return (
      <div className={block}>
        <div className={block + '__sidebar'}>
          {this.state.snapshot ?
            <OSDetailPaneSidebar snapshot={this.state.snapshot} />
          : <div>Loading...</div>}
        </div>


        <div className={block + '__content'} ref='content'>
          {this.state.snapshot ?
            <OSDetailPaneContent snapshot={this.state.snapshot}
                                 width={this.state.width}/>
          : <div>Loading...</div>}
        </div>
      </div>
    );
  }

});

export default DetailPane;
