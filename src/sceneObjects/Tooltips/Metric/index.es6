'use strict';

import React from 'react/addons';
import Tooltip from '../Tooltip';
import TooltipFrame from '../index';
import Heading from '../Heading';
import Content from '../Content';

import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import {activeMetric} from 'instana-ui-services/stores/metrics';
import {subscribeToMetric} from '../../../metricUtils';
import {getFormattedValue} from 'instana-ui-sdk/metrics';
import {theme} from 'instana-ui-services/theme';

import './index.less';


/*eslint-disable no-unused-vars*/
const StickyNoteRC = React.createClass({

  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    snapshot: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {values: [], metrics: []};
  },

  componentDidMount() {
    this.addSubscription(activeMetric.subscribe(metric => {
      if(!metric) {
        return;
      }
      const metrics = metric.get('metrics');
      this.setState({metrics});

      this.addSubscription(subscribeToMetric({
        metrics, snapshot: this.props.snapshot, fn: (values) => {
          this.setState({values: values.slice()});
        }
      }));
    }));
  },

  render() {
    const metrics = this.state.metrics.slice().reverse();
    const values = this.state.values.slice().reverse();
    if(values.length === 0 || metrics.size === 0) {
      return <div style={{height: 10}}></div>;
    }

    let colorIndex = 0;
    const colors = theme.chart.strokeColors.slice().reverse();
    const listItems = values.map((value, index) => {
      const color = colors[colorIndex];
      colorIndex++;
      if(colorIndex >= colors.length) {
        colorIndex = 0;
      }
      const style = {color};
      const metricName = metrics.getIn([index, 'name']);
      const metricLabel = metrics.getIn([index, 'label']);

      return (
        <li key={metricName} className='in-tooltip__node__li'>
          <div className='in-tooltip__node-li--wrapper'>
            <Heading
              className={'in-tooltip__node-li--metric-name'}
              style={style}>
              {metricLabel.toUpperCase()}
            </Heading>
            <Content className='in-tooltip__node-li--value'>
              {getFormattedValue(metricName, this.props.snapshot, value)}
            </Content>
          </div>
        </li>);
    });

    return (
      <TooltipFrame>
        <ul className='in-tooltip__node-ul'>
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
