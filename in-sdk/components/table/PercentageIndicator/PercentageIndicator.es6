import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import ReactDOM from 'react-dom';

import {getMetricForFocusedMoment} from 'in-stores/metric';

import './PercentageIndicator.less';

const block = 'in-table-view-percentage-indicator';

export default React.createClass({
  displayName: 'PercentageIndicator',

  mixins: [PureRenderMixin],

  propTypes: {
    snapshotId: React.PropTypes.string,
    createMetricValueStream: React.PropTypes.func,
    metric: React.PropTypes.string,
    formatter: React.PropTypes.func
  },

  componentDidMount() {
    this.establishSubscription(this.getStream(this.props));
  },

  getStream(props) {
    if (props.createMetricValueStream) {
      return props.createMetricValueStream(this.props.snapshotId)
        .distinct();
    }

    return getMetricForFocusedMoment({
      snapshotId: props.snapshotId,
      metric: props.metric
    })
    .map(v => v[1])
    .distinct();
  },

  establishSubscription(stream) {
    const valuePresenter = ReactDOM.findDOMNode(this.refs.value);
    const levelPresenter = ReactDOM.findDOMNode(this.refs.level);

    valuePresenter.textContent = '';
    levelPresenter.style.width = '0';

    this.stream = stream;
    this.subscription = stream.subscribe(v => {
      valuePresenter.textContent = this.format(v);
      // if value grows larger than 100% (e.g. for cpu) prevent overflow
      levelPresenter.style.width = `${Math.min(1, v) * 100}%`;
    });
  },

  componentWillReceiveProps(nextProps) {
    const nextStream = this.getStream(nextProps);
    if (this.stream !== nextStream) {
      this.disposeSubscription();
      this.establishSubscription(nextStream);
    }
  },

  componentWillUnmount() {
    this.disposeSubscription();
  },

  disposeSubscription() {
    if (this.subscription) {
      this.subscription.dispose();
      this.subscription = null;
    }
  },

  format(v) {
    if (v !== undefined && this.props.formatter) {
      return this.props.formatter(v);
    }
    return v;
  },

  render() {
    return (
      <div className={block}>
        <div className={`${block}__level`}
             ref='level'/>
        <span className={`${block}__value`}
              ref='value'/>
      </div>
    );
  }
});
