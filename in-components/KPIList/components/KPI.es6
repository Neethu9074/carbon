import irpt from 'react-immutable-proptypes';
import React from 'react';

import 'in-components/KPIList/components/KPI.less';
import {getLiveMetrics} from 'in-stores/metric';


const block = 'in-kpi';
const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'KPI',

  propTypes: {
    snapshot: irpt.map.isRequired,
    metric: rpt.string.isRequired
  },

  getInitialState() {
    return {
      value: '?'
    };
  },

  componentDidMount() {
    this.metricSubscription = getLiveMetrics({snapshotId: this.props.snapshot.get('id')})
                                .subscribe(value => this.setState({value}));
  },

  componentWillUnmount() {
    this.metricSubscription.dispose();
  },

  render() {
    const metric = this.props.metric;

    return (
      <div className={block}>
        <div className={block + '__value'}>
          {this.state.value}
        </div>
        <span className={block + '__label'}>
          {metric}
        </span>
      </div>
    );
  }
});
