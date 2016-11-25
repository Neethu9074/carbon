import irpt from 'react-immutable-proptypes';
import React from 'react';

import MetricValue from './MetricValue';

const rpt = React.PropTypes;
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
        <MetricValue {...this.props}
                     snapshotId={this.props.snapshot.get('id')} />
      </td>
    );
  }

});

export default Mtd;
