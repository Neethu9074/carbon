import irpt from 'react-immutable-proptypes';
import React from 'react';

import 'in-components/KPIList/components/KPI.less';
import {getLiveMetrics} from 'in-stores/metric';


const block = 'in-kpi';
const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'KPI',

  propTypes: {
    formatter: rpt.func.isRequired,
    snapshot: irpt.map.isRequired,
    metric: rpt.string.isRequired,
    label: rpt.string.isRequired
  },

  getInitialState() {
    return {
      value: '?'
    };
  },

  componentDidMount() {
    this.metricSubscription = getLiveMetrics({snapshotId: this.props.snapshot.get('id')}).subscribe(value =>
      this.setState({value}));
  },

  componentWillUnmount() {
    this.metricSubscription.dispose();
  },

  render() {
    return (
      <div className={block}>
        <div className={block + '__value'}>
          {this.props.formatter(this.state.value)}
        </div>
        <span className={block + '__label'}>
          {this.props.label}
        </span>
      </div>
    );
  }
});
