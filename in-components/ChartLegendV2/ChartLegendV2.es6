'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';
import _ from 'lodash';

import {isIdEqual} from 'in-services/util/snapshots';
import {create} from 'in-services/conveyer';
import MetricConveyer from 'in-services/conveyer/MetricConveyer';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {theme} from 'in-services/theme';

import './ChartLegendV2.less';

const rpt = React.PropTypes;
const block = 'in-chart-legend';

const axisConfigShape = rpt.shape({
  metrics: rpt.arrayOf(rpt.string).isRequired,
  labels: rpt.arrayOf(rpt.string).isRequired,
  formatter: rpt.func
});

const ChartLegend = React.createClass({
  mixins: [SubscriptionMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    y1: axisConfigShape.isRequired,
    y2: axisConfigShape
  },

  getInitialState() {
    return {};
  },

  componentDidMount() {
    this.subscribeToMetrics(this.props);
  },

  subscribeToMetrics(props) {
    this.disposeSubscriptions();

    props.y1.metrics.forEach(metric =>
      this.addSubscription(
        create(MetricConveyer, {
          snapshot: props.snapshot,
          metric
        })
        .subscribe(value => {
          this.setState({
            [metric]: value
          });
        })
      )
    );

    if (props.y2) {
      props.y2.metrics.forEach(metric =>
        this.addSubscription(
          create(MetricConveyer, {
            snapshot: props.snapshot,
            metric
          })
          .subscribe(value => {
            this.setState({
              [metric]: value
            });
          })
        )
      );
    }
  },

  componentWillReceiveProps(nextProps) {
    if (!isIdEqual(nextProps.snapshot, this.props.snapshot) ||
        !_.isEqual(nextProps.y1, this.props.y1) ||
        !_.isEqual(nextProps.y2, this.props.y2)) {
      this.subscribeToMetrics(nextProps);
    }
  },

  render() {
    return (
      <div className={block}>
        {this.renderList(this.props.y1, 'y1', 0)}
        {this.props.y2 ?
          this.renderList(this.props.y2, 'y2', this.props.y1.metrics.length)
        : null}
      </div>
    );
  },

  renderList(axis, modifier, themeMetricOffset) {
    const classname = block + '__metrics';
    return (
      <dl className={classname + ' ' + classname + '--' + modifier}>
        {axis.metrics.map((metric, i) =>
          <div className={block + '__metric'}
               key={metric}>
            <dt className={block + '__metric-label'}
                style={{color: theme.chart.strokeColors[themeMetricOffset + i]}}>
              {axis.labels[i]}
            </dt>
            <dt className={block + '__metric-value'}>
              {this.state[metric] === undefined ?
                '?'
              : this.formatValue(axis, this.state[metric])}
            </dt>
          </div>
        )}
      </dl>
    );
  },

  formatValue(axis, d) {
    if (axis.formatter) {
      return axis.formatter(d);
    } else {
      return d;
    }
  }
});

export default ChartLegend;
