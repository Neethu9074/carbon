'use strict';

import React from 'react/addons';
import Tooltip from '../Tooltip';
import MetricConveyer from 'instana-ui-services/conveyer/MetricConveyer';
import TooltipFrame from '../index';
import Heading from '../Heading';
import Content from '../Content';
import {create} from 'instana-ui-services/conveyer';
import {activeMetric} from 'instana-ui-services/stores/metrics';
import {combineLatest} from 'reactive-observables';
import {theme} from 'instana-ui-services/theme';

import './index.less';


/*eslint-disable no-unused-vars*/
const StickyNoteRC = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {values: [], metricNames: []};
  },

  createSingleMetricSource(metric) {
    return create(MetricConveyer, {
      metric, frequency: 1000, snapshot: this.props.snapshot
    });
  },

  subscribeToSingle(metric) {
    this.metricSubscription = this.createSingleMetricSource(metric)
    .subscribe((value) => {
      this.setState({values: [value]});
    });
  },

  subscribeToMulti(metrics) {
    const tempSubscriptions = metrics.map(metric => {
      return this.createSingleMetricSource(metric);
    });

    this.metricSubscription = combineLatest(tempSubscriptions)
    .throttle(200)
    .subscribe((values) => {
      this.setState({values: values.slice()});
    });
  },

  disposeRxo(rxo) {
    if(rxo) {
      rxo.dispose();
    }
  },

  componentDidMount() {
    this.activeMetricSubscriptions = activeMetric.subscribe(metric => {
      if(!metric) {
        return;
      }
      const metrics = metric.get('metrics');
      this.disposeRxo(this.metricSubscription);
      this.setState({metricNames: metrics});

      if(metrics.length === 1) {
        this.subscribeToSingle(metrics[0]);
      } else {
        this.subscribeToMulti(metrics);
      }
    });
  },

  componentWillUnmount() {
    this.disposeRxo(this.metricSubscription);
    this.disposeRxo(this.activeMetricSubscriptions);
  },

  render() {
    if(this.state.values.length === 0 ||
      this.state.metricNames.length === 0) {
      return <div style={{height: 10}}></div>;
    }
    let colorIndex = 0;
    const colors = theme.chart.strokeColors.slice().reverse();
    const names = this.state.metricNames.slice().reverse();
    const listItems = this.state.values.slice().reverse()
    .map((value, index) => {
      const color = colors[colorIndex];
      colorIndex++;
      if(colorIndex >= colors.length) {
        colorIndex = 0;
      }
      const style = {color: color};
      const metricName = names[index];

      return (
        <li key={metricName} className='in-tooltip__node__li'>
          <Heading
            className={'in-tooltip__node__li__metric-name'}
            style={style}>
            {metricName.toUpperCase()}
          </Heading>
          <Content className='in-tooltip__node__li__value'>
            {value * 100 + '%'}
          </Content>
        </li>);
    });

    return (
      <TooltipFrame>
        <ul className='in-tooltip__node__ul'>
          {listItems}
        </ul>
      </TooltipFrame>
    );
  }
});
/*eslint-enable no-unused-vars*/

export default class TooltipMetric extends Tooltip {
  constructor(parent) {
    super(parent);
    this.render();
  }

  render() {
    React.render(
      <StickyNoteRC
        snapshot={this.parent.snapshot}
      />,
      this.stickyNoteContainer
    );
  }

  dispose() {
    super.dispose();
  }
}
