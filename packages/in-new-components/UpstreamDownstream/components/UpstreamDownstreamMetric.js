/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import locals from './UpstreamDownstreamMetric.mless';

export default function UpstreamDownstreamMetric({ metrics, selectedMetric, onChangeMetric }) {
  return (
    <div className={locals.wrapper}>
      <label className={locals.label} htmlFor="metricSelect">
        {t('in-new-components:upstreamDownstream.labelMetric')}
      </label>
      <select
        className={locals.select}
        name="metrics"
        id="metricSelect"
        onChange={event => onChangeMetric(event.target.value)}
        value={selectedMetric}
      >
        {metrics.map(metric => (
          <option value={metric.key} key={metric.key}>
            {metric.text}
          </option>
        ))}
      </select>
    </div>
  );
}
