import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {activeMetric} from 'in-services/stores/metrics';
import TooltipFrame from 'in-components/Tooltips/Frame';
import {emptyList} from 'in-services/fixedImmutables';
import Heading from 'in-components/Tooltips/Heading';
import Content from 'in-components/Tooltips/Content';
import MetricValue from 'in-components/MetricValue';
import {getFormattedValue} from 'in-sdk/metrics';
import getSnapshot from 'in-hoc/getSnapshot';
import {theme} from 'in-services/theme';

import Tooltip from '../../Tooltip';

import './Metric.less';


const block = 'in-tooltip-metric';

const MetricTooltipReactClass = getSnapshot(React.createClass({

  displayName: 'metric tooltip',

  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    snapshotId: React.PropTypes.string.isRequired,
    snapshot: irpt.map
  },

  getInitialState() {
    return {
      metrics: emptyList
    };
  },

  componentDidMount() {
    this.addSubscription(activeMetric.subscribe(metric =>
      this.setState({ metrics: metric.get('metrics') })
    ));
  },

  render() {
    const snapshot = this.props.snapshot;
    if (!snapshot) {
      return null;
    }

    const metrics = this.state.metrics.reverse();
    const colors = theme.chart.strokeColors.slice(0, metrics.size).reverse();
    let colorIndex = 0;

    const listItems = metrics.map(metric => {
      const label = metric.get('label');
      const name = metric.get('name');

      // rotate colors max colors are used
      const color = colors[colorIndex++];
      if (colorIndex >= colors.length) {
        colorIndex = 0;
      }

      return (
        <li key={label} className={block + '__li'}>
          <div className={block + '__item'}>
            <Heading className={block + '__name'}
                     style={{color}}>
              {label}
            </Heading>
            <Content className={block + '__value'}>
              <MetricValue snapshotId={this.props.snapshotId}
                           metric={name}
                           initialValue={'?'}
                           formatter={getFormattedValue.bind(this, name, snapshot)}/>
            </Content>
          </div>
        </li>);
    });

    return (
      <TooltipFrame>
        <ul className={block + '__ul'}>
          {listItems}
        </ul>
      </TooltipFrame>
    );
  }
}));


export default class TooltipMetric extends Tooltip {
  constructor(parent) {
    super(parent);
  }

  render() {
    React.render(
      <MetricTooltipReactClass snapshotId={this.parent.id} />,
      this.stickyNoteContainer
    );
  }

  dispose() {
    super.dispose();
  }
}
