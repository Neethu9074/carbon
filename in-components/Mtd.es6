import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';

import MetricValue from './MetricValue';

const rpt = React.PropTypes;
const Mtd = React.createClass({
  mixins: [SubscriptionMixin, React.addons.PureRenderMixin],

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
