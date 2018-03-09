import React from 'react';

import { number, millis, percentage } from 'in-services/formatters/number';
import { joinClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';

import locals from './MetricList.mless';

export default function MetricList({ metrics, className }) {
  metrics = metrics || {};
  return (
    <div className={joinClassNames(locals.metricList, className)}>
      <Metric type="change2" value={metrics.calls != undefined ? number.compact(metrics.calls) : '--'} />
      <Metric type="time" value={metrics.latency != undefined ? millis.detailed(metrics.latency) : '--'} />
      <Metric type="error" value={metrics.errors != undefined ? percentage.detailed(metrics.errors) : '--'} />
    </div>
  );
}

function Metric({ type, value }) {
  return (
    <div className={locals.metric}>
      <SvgIcon className={locals.metricIcon} type={type} height={11} color="#16363e" />
      {value}
    </div>
  );
}
