/*eslint-disable react/no-multi-comp */
import React from 'react/addons';

import Collapsible from 'in-components/Collapsible';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {mapStatisticsStore} from 'in-services/stores/mapStatistics';

import './MapStats.less';


const block = 'in-sidebar-map-stats';

const MapStat = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.any.isRequired
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

  renderStat(stats, key) {
    const stat = stats[key];
    const statChildren = Object.keys(stat);
    if(typeof stat === 'string' || statChildren.length === 0) {
      return <MapStat key={key} name={key} value={stats[key]} />;
    }

    return (
      <Collapsible key={key}>
        <Collapsible.Header>
          {key}
        </Collapsible.Header>
        <Collapsible.Content>
          {statChildren.map(child => this.renderStat(stat, child))}
        </Collapsible.Content>
      </Collapsible>
    );
  },

  render() {
    const stats = this.state.stats;
    if(!stats) {
      return null;
    }

    return (
      <div className={block}>
        {Object.keys(stats).map(key => this.renderStat(stats, key))}
      </div>
    );
  }
});

export default MapStats;
