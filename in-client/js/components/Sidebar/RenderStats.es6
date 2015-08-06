'use strict';

import React from 'react/addons';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {renderStatisticsStore} from 'in-services/stores/renderStatistics';

import './Metrics.less';

const block = 'in-sidebar-render-stats';

const RenderStats = React.createClass({
  mixins: [
    SubscriptionMixin
  ],

  getInitialState() {
    return {stats: null};
  },

  componentDidMount() {
    this.addSubscription(renderStatisticsStore.subscribe(stats => {
      this.setState({stats});
    }));
  },

  render() {
    const stats = this.state.stats;
    if(!stats) {
      return null;
    }

    return (
      <div className={block}>
        {stats.fps}
      </div>
    );
  }
});

export default RenderStats;
