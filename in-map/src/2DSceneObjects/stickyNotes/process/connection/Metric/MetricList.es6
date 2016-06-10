import React from 'react';

import './MetricList.less';


const block = 'in-sticky-note-process-connection-metriclist';
const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'MetricList',

  propTypes: {
    snapshotId: rpt.string.isRequired,
    metricsAreActive: rpt.bool
  },

  render() {
    return (
      <div className={block}>
        {this.keyValuPair('Errors', '1.23%')}
        {this.keyValuPair('Errors', '1.23%')}
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
