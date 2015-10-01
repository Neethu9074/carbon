import irpt from 'react-immutable-proptypes';
import React from 'react';

import MetricValue from './MetricValue';

const rpt = React.PropTypes;
const Mtd = React.createClass({

  propTypes: {
    snapshot: irpt.map,
    metric: rpt.string,
    createMetricValueStream: rpt.func,
    formatter: rpt.func
  },

  render() {
    return (
      <td>
        <MetricValue {...this.props} />
      </td>
    );
  }

});

export default Mtd;
