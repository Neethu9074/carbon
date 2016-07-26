import irpt from 'react-immutable-proptypes';
import ReactDOM from 'react-dom';
import React from 'react';

import LabeledSparkChart from 'in-sdk/components/sidebar/LabeledSparkChart';
import StickyNote from 'in-map/src/2DSceneObjects/stickyNotes/StickyNote';
import getSnapshot from 'in-hoc/getSnapshot';
import KPIList from 'in-components/KPIList';
import {getKpis} from 'in-sdk/kpi';

import 'in-map/src/2DSceneObjects/stickyNotes/process/node/KPI/Metric.less';


const rpt = React.PropTypes;
const block = 'in-sticky-note-process-metric';

const Metric = getSnapshot(
  React.createClass({

    propTypes: {
      snapshotId: rpt.string.isRequired,
      getHeading: rpt.func.isRequired,
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

      let className = block + '__wrapper';
      if (this.state.isHighlighted) {
        className += ' ' + className + '--highlighted';
      }

      const kpis = getKpis(snapshot);
      return (
        <div className={className}>
          <div className={block + '__heading'}>
            {this.props.getHeading(snapshot)}
          </div>
          <div className={block + '__chart-wrapper'}
               onMouseEnter={() => this.setState({isHighlighted: true})}
               onMouseLeave={() => this.setState({isHighlighted: false})}>
            {this.state.isHighlighted ?
              kpis.map(kpi =>
                <LabeledSparkChart key={kpi.label}
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
      <Metric snapshotId={this.parent.id}
              getHeading={this.getHeading} />,
      this.container
    );
  }
}
