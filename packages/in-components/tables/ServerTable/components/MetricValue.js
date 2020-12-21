import React from 'react';

import classNames from 'classnames';

import locals from './MetricValue.mless';

export default function MetricValue({ value, className }) {
  return <span className={classNames(locals.metricValue, className)}>{value}</span>;
}
