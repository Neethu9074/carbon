'use strict';

import React from 'react';
import {State, Navigation} from 'react-router';
import Immutable from 'immutable';
import {on} from 'reactive-observables';

import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import * as selectedSnapshotStore from 'instana-ui-services/stores/selectedSnapshot';
import * as timelineStore from 'instana-ui-services/stores/timeline';

import OSDetailPaneSidebar from './forge/OSDetailPaneSidebar';
import OSDetailPaneContent from './forge/OSDetailPaneContent';

import './index.less';

const block = 'in-detail-pane';

const DetailPane = React.createClass({
  mixins: [SubscriptionMixin, State, Navigation],

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
      timeframe: 0
    };
  },

  componentDidMount() {
    this.addSubscription(
      selectedSnapshotStore.selectedSnapshot.subscribe(snapshot => {
        this.setState({snapshot});
      })
    );

    this.addSubscription(
      timelineStore.timeframe.subscribe(timeframe => {
        this.setState({timeframe});
      })
    );
  },

  render() {
    return (
      <div className={block}>
        <button type='button'
                onClick={this.closeDashboard}
                className={block + '__close'}>
          x
        </button>
        <div className={block + '__content'}>
          {this.state.snapshot ?
            <OSDetailPaneContent snapshot={this.state.snapshot}
                                 timeframe={this.state.timeframe} />
          : <div>Loading...</div>}
        </div>

        <div className={block + '__sidebar'}>
          {this.state.snapshot ?
            <OSDetailPaneSidebar snapshot={this.state.snapshot}
                                 timeframe={this.state.timeframe} />
          : <div>Loading...</div>}
        </div>
      </div>
    );
  },

  closeDashboard() {
    this.transitionTo('map');
  }

});

export default DetailPane;
