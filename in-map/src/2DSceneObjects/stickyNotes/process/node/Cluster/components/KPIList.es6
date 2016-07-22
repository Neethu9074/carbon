import irpt from 'react-immutable-proptypes';
import React from 'react';

import HistoricMetricSparkChart from 'in-charts/SparkChart/HistoricMetricSparkChart';
import {timeframe$} from 'in-components/timeline/timelineStore';
import MetricValue from 'in-components/MetricValue';
import getSnapshot from 'in-hoc/getSnapshot';
import KPIList from 'in-components/KPIList';
import connectTo from 'in-hoc/connectTo';
import {getKpis} from 'in-sdk/kpi';

import 'in-map/src/2DSceneObjects/stickyNotes/process/node/Cluster/components/KPIList.less';


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
              <SparkChart key={kpi.label}
                          snapshotId={this.props.snapshotId}
                          title={kpi.label}
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

const SparkChart = connectTo({
  timeframe: timeframe$
}, function sparkChart({timeframe, snapshotId, metric, title, formatter, width = 130}) {
  return (
    <div className={block + '__chart'}>
      <HistoricMetricSparkChart width={width}
                                height={30}
                                timeframe={timeframe}
                                snapshotId={snapshotId}
                                design='dark'
                                metric={metric}
                                tooltipFormatter={formatter}/>
      <div className={block + '__description'}>
        <span className={block + '__title'}>
          {title}
        </span>
        <MetricValue snapshotId={snapshotId}
                     metric={metric}
                     className={block + '__value'}
                     formatter={formatter}/>
      </div>
    </div>
  );
});
