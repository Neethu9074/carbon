import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import ReactDOM from 'react-dom';
import React from 'react';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import TooltipFrame from 'in-components/Tooltips/Frame';
import {emptyList} from 'in-services/fixedImmutables';
import Heading from 'in-components/Tooltips/Heading';
import Content from 'in-components/Tooltips/Content';
import MetricValue from 'in-components/MetricValue';
import {getFormattedValue} from 'in-sdk/metrics';
import {activeMetric$} from 'in-stores/metric';
import getSnapshot from 'in-hoc/getSnapshot';
import {getLabel} from 'in-sdk/snapshot';
import {theme} from 'in-services/theme';

import Tooltip from '../../Tooltip';

import './Metric.less';


const block = 'in-tooltip-metric';

const MetricTooltipReactClass = getSnapshot(React.createClass({

  displayName: 'metric tooltip',

  mixins: [
    PureRenderMixin,
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
    this.addSubscription(activeMetric$.subscribe(metric =>
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
        <p className={block + '__label'}>
          {snapshot ? getLabel(snapshot, snapshot.getIn(['data', 'hostname'])) : null}
        </p>
        <ul className={block + '__ul'}>
          {listItems}
        </ul>
      </TooltipFrame>
    );
  }
}));


export default class TooltipMetric extends Tooltip {
  constructor(parent) {
    super({parent});
  }

  render() {
    ReactDOM.render(
      <MetricTooltipReactClass snapshotId={this.parent.id} />,
      this.container
    );
  }
}
