import irpt from 'react-immutable-proptypes';
import React from 'react';

import LabeledSparkChart from 'in-sdk/components/sidebar/LabeledSparkChart';
import getSnapshot from 'in-hoc/getSnapshot';
import SvgIcon from 'in-components/SvgIcon';
import KPIList from 'in-components/KPIList';
import {getKpis} from 'in-sdk/kpi';

import 'in-map/components/stickyNotes/logical/Service/components/KPIList.less';


const rpt = React.PropTypes;
const block = 'in-sticky-note-process-kpi-list';

export default getSnapshot(
  React.createClass({

    displayName: 'KPIList',

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

      const isHighlighted = this.state.isHighlighted;

      let className = block;
      if (isHighlighted) {
        className += ' ' + className + '--highlighted';
      }

      const kpis = getKpis(snapshot);
      return (
        <div className={className}>
          <div className={`${block}__icon-wrapper`}
               onClick={() => this.setState({isHighlighted: !isHighlighted})}>
            <SvgIcon className={`${block}__expand-icon`}
                     type={isHighlighted ? 'timeline_close' : 'timeline_open'}
                     height={14}
                     width={14}
                     color='#7b8e96' />
          </div>

          <div className={`${block}__kpi-wrapper`}>
            {isHighlighted ?
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
        </div>
      );
    }
  })
);
