import irpt from 'react-immutable-proptypes';
import ReactDOM from 'react-dom';
import React from 'react';

import LabeledSparkChart from 'in-sdk/components/sidebar/LabeledSparkChart';
import StickyNote from 'in-map/src/2DSceneObjects/stickyNotes/StickyNote';
import getSnapshot from 'in-hoc/getSnapshot';
import KPIList from 'in-components/KPIList';
import {getKpis} from 'in-sdk/kpi';

import 'in-map/src/2DSceneObjects/stickyNotes/process/connection/KPI/Metric.less';


const rpt = React.PropTypes;
const block = 'in-sticky-connection-process-metric';

const Metric = getSnapshot(
  React.createClass({

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

      const kpis = getKpis(snapshot);
      let className = block + '__wrapper';
      if (this.state.isHighlighted) {
        className += ' ' + className + '--highlighted';
      }

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
                     formatters={kpis.map(kpi => kpi.valueOnlyFormatter)}/>
          }
        </div>
      );
    }
  })
);


export default class StickyNoteProcessMetric extends StickyNote {
  constructor(parent) {
    super({parent, cssClass: block});

    this.render();
  }

  render() {
    ReactDOM.render(
      <Metric snapshotId={this.parent.id} />,
      this.container
    );
  }
}
