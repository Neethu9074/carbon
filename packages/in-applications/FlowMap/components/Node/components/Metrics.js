import classNames from 'classnames';
import React from 'react';

import { number, meanLatency, percentage } from 'in-services/formatters/number';
import connectTo from 'in-hoc/connectTo';

import locals from './Metrics.mless';

export default connectTo(
  props => ({
    metrics: props.entity.events$.on('metricValues')
  }),
  function Metrics(props) {
    const { className, metrics = {} } = props;

    return (
      <div className={classNames(locals.metrics, className)}>
        <span>{metrics.calls != undefined ? number.compact(metrics.calls) : '--'}</span>
        <span>{metrics.latency != undefined ? meanLatency.detailed(metrics.latency) : '--'}</span>
        <span>{metrics.errors != undefined ? percentage.detailed(metrics.errors) : '--'}</span>
      </div>
    );
  }
);
