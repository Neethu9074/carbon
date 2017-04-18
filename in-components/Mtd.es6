import irpt from 'react-immutable-proptypes';
import rpt from 'prop-types';
import React from 'react';

import MetricValue from './MetricValue';

class Mtd extends React.Component {
  static propTypes = {
    snapshot: irpt.map.isRequired,
    metric: rpt.string.isRequired,
    formatter: rpt.func,
    createMetricValueStream: rpt.func
  };

  render() {
    return (
      <td>
        <MetricValue {...this.props} snapshotId={this.props.snapshot.get('id')} />
      </td>
    );
  }
}

export default Mtd;
