import irpt from 'react-immutable-proptypes';
import React from 'react';

import LabeledSparkChart from 'in-sdk/components/sidebar/LabeledSparkChart';
import getSnapshot from 'in-hoc/getSnapshot';
import KPIList from 'in-components/KPIList';
import {getKpis} from 'in-sdk/kpi';

import 'in-map/components/stickyNotes/logical/Service/components/KPIList.less';


const rpt = React.PropTypes;
const block = 'in-sticky-note-process-kpi-list';

export default getSnapshot(
  React.createClass({

    displayName: 'Metric',

    propTypes: {
      snapshotId: rpt.string.isRequired,
      snapshot: irpt.map
    },

    getInitialState() {
      return {
        isHighlighted: false
      };
    },

    render() {
      const snapshot = this.props.snapshot;
      if (!snapshot) {
        return false;
      }

      let className = block;
      if (this.state.isHighlighted) {
        className += ' ' + className + '--highlighted';
      }

      const kpis = getKpis(snapshot);
      return (
        <div className={className}
             onMouseEnter={() => this.setState({isHighlighted: true})}
             onMouseLeave={() => this.setState({isHighlighted: false})}>
          {this.state.isHighlighted ?
            kpis.map(kpi =>
              <LabeledSparkChart className={block + '__spark-chart'}
                          key={kpi.label}
                          snapshotId={this.props.snapshotId}
                          label={kpi.label}
                          design='dark'
                          metric={kpi.metric}
                          formatter={kpi.formatter} />
            ) :
            <KPIList snapshot={snapshot}
                     metrics={kpis.map(kpi => kpi.metric)}
                     labels={kpis.map(kpi => kpi.label)}
                     formatters={kpis.map(kpi => kpi.valueOnlyFormatter)} />
          }
        </div>
      );
    }
  })
);
