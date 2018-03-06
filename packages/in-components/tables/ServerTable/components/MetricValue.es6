import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';

import locals from './MetricValue.mless';

export default function MetricValue({ value, className }) {
  return <span className={joinClassNames(locals.metricValue, className)}>{value}</span>;
}
