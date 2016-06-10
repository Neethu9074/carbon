import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getColorPool} from 'in-services/util/ColorGenerator';

import './MetricList.less';


const block = 'in-sticky-note-process-metriclist';
const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'MetricList',

  propTypes: {
    snapshot: irpt.map.isRequired,
    metricsAreActive: rpt.bool
  },

  render() {
    const color = getColorPool('processes').getColorHex(this.props.snapshot.get('plugin'));

    return (
      <div className={block}>
        <div className={block + '__heading-line'}
              style={{ backgroundColor: color }} />
        {this.keyValuPair('Sessions', 95)}
        {this.keyValuPair('Calls/s', 213)}
        {this.keyValuPair('Latency', '65ms')}
        {this.keyValuPair('Errors', '1.23%')}
      </div>
    );
  },

  keyValuPair(k, v) {
    const className = block + '__metric';

    return (
      <div className={className}>
        <span>
          {v}
        </span>
        <br/>
        <span className={className + '__label'}>
          {k}
        </span>
      </div>
    );
  }
});
