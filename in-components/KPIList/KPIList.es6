import irpt from 'react-immutable-proptypes';
import React from 'react';

import KPI from 'in-components/KPIList/components/KPI';


const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'KPIList',

  propTypes: {
    snapshot: irpt.map.isRequired,
    kpis: rpt.array.isRequired
  },

  render() {
    const kpis = this.props.kpis;

    return (
      <div>
        {kpis.map(metric => <KPI key={metric}
                                 metric={metric}
                                 snapshot={this.props.snapshot}/>)}
      </div>
    );
  }
});
