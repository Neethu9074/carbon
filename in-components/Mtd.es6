import irpt from 'react-immutable-proptypes';
import rpt from 'prop-types';
import React from 'react';

import MetricValue from './MetricValue';

const Mtd = React.createClass({
  propTypes: {
    snapshot: irpt.map.isRequired,
    metric: rpt.string.isRequired,
    formatter: rpt.func,
    createMetricValueStream: rpt.func
  },

  render() {
    return (
      <td>
        <MetricValue {...this.props} snapshotId={this.props.snapshot.get('id')} />
      </td>
    );
  }
});

export default Mtd;
