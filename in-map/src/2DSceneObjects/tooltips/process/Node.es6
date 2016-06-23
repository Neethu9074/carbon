import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import ReactDOM from 'react-dom';
import React from 'react';

import {withSiPrefixTwoDecimalPlaces, bytesTwoDecimalPlaces} from 'in-services/formatters/number';
import HistoricMetricSparkChart from 'in-charts/SparkChart/HistoricMetricSparkChart';
import {timeframe$} from 'in-components/timeline/timelineStore';
import TooltipFrame from 'in-components/Tooltips/Frame';
import MetricValue from 'in-components/MetricValue';
import {timeframeShape} from 'in-stores/timeline';
import getSnapshot from 'in-hoc/getSnapshot';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import 'in-map/src/2DSceneObjects/tooltips/process/Node.less';

import Tooltip from '../Tooltip.es6';


const block = 'in-tooltip-process-node';
const rpt = React.PropTypes;

const NodeTooltip = connectTo({
    timeframe: timeframe$
  }, getSnapshot(React.createClass({

    displayName: 'process node tootlip',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      timeframe: timeframeShape.isRequired,
      snapshotId: rpt.string.isRequired,
      snapshot: irpt.map
    },

    render() {
      const snapshot = this.props.snapshot;

      return (
        <TooltipFrame>
          {snapshot ? getLabel(snapshot) : null}
          <div className={block}>
            {this.sparkChart('METRIC_NAME_HERE', 'Calls/s', withSiPrefixTwoDecimalPlaces)}
            {this.sparkChart('METRIC_NAME_HERE', 'Latency', withSiPrefixTwoDecimalPlaces)}
            {this.sparkChart('METRIC_NAME_HERE', 'Errors', withSiPrefixTwoDecimalPlaces)}
            {this.sparkChart('METRIC_NAME_HERE', 'Sessions', bytesTwoDecimalPlaces)}
          </div>
        </TooltipFrame>
      );
    },

    sparkChart(metric, title, formatter, width = 130) {
      const snapshotId = this.props.snapshotId;
      const timeframe = this.props.timeframe;

      return (
        <div className={block + '__chart'}>
          <HistoricMetricSparkChart width={width}
                                    height={30}
                                    timeframe={timeframe}
                                    snapshotId={snapshotId}
                                    design='dark'
                                    metric={metric} />
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
    }
  }))
);

export default class TooltipNode extends Tooltip {
  constructor(parent) {
    super({parent});
  }

  render() {
    ReactDOM.render(
      <NodeTooltip snapshotId={this.parent.id}/>,
      this.container
    );
  }
}
