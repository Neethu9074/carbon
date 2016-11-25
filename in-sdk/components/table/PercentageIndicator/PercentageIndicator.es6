import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {getMetricForFocusedMoment} from 'in-stores/metric';

import './PercentageIndicator.less';

const block = 'in-table-view-percentage-indicator';

export default React.createClass({
  displayName: 'PercentageIndicator',

  mixins: [PureRenderMixin],

  propTypes: {
    snapshotId: React.PropTypes.string,
    /* eslint-disable react/no-unused-prop-types */
    createMetricValueStream: React.PropTypes.func,
    metric: React.PropTypes.string,
    /* eslint-enable react/no-unused-prop-types */
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
    const valuePresenter = this.value;
    const levelPresenter = this.level;

    valuePresenter.textContent = '';
    levelPresenter.style.width = '0';

    this.stream = stream;
    this.subscription = stream.subscribe(v => {
      valuePresenter.textContent = v == null ? '' : this.format(v);

      // if value grows larger than 100% (e.g. for cpu) prevent overflow
      if (v == null) {
        levelPresenter.style.width = '0px';
      } else {
        levelPresenter.style.width = `${Math.min(1, v) * 100}%`;
      }
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
             ref={node => this.level = node} />
        <span className={`${block}__value`}
              ref={node => this.value = node} />
      </div>
    );
  }
});
