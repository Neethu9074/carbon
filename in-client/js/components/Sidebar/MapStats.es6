'use strict';

/*eslint-disable react/no-multi-comp */
import React from 'react/addons';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {mapStatisticsStore} from 'in-services/stores/mapStatistics';

import './MapStats.less';

const block = 'in-sidebar-map-stats';

const MapStat = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.number.isRequired
  },

  render() {
    return (
      <div className={block + '__stat'}>
        <div className={block + '__name'}>{this.props.name}</div>
        <div className={block + '__value'}>{this.props.value}</div>
      </div>
    );
  }
});

const MapStats = React.createClass({
  mixins: [
    SubscriptionMixin
  ],

  getInitialState() {
    return {stats: null};
  },

  componentDidMount() {
    this.addSubscription(mapStatisticsStore.subscribe(stats => {
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
        {Object.keys(stats).map((key) => {
          return <MapStat key={key} name={key} value={stats[key]} />;
        })}
      </div>
    );
  }
});

export default MapStats;
