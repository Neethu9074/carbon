import irpt from 'react-immutable-proptypes';
import React from 'react';

import KPI from 'in-components/KPIList/components/KPI';


const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'KPIList',

  propTypes: {
    formatters: rpt.array.isRequired,
    snapshot: irpt.map.isRequired,
    metrics: rpt.array.isRequired,
    labels: rpt.array.isRequired
  },

  render() {
    const formatters = this.props.formatters;
    const metrics = this.props.metrics;
    const labels = this.props.labels;

    return (
      <div>
        {metrics.map((metric, index) => <KPI key={labels[index]}
                                             metric={metric}
                                             label={labels[index]}
                                             formatter={formatters[index]}
                                             snapshot={this.props.snapshot}/>)}
      </div>
    );
  }
});
