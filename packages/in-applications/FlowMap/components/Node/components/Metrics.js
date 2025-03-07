/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { useObservable } from '@instana/hooks';

import { number, meanLatency, percentage } from 'in-services/formatters/number';

import locals from './Metrics.mless';

export default function Metrics(props) {
  const { className, entity } = props;
  const metrics = useObservable(entity.events$.on('metricValues'), [entity]) ?? {};
  return (
    <div className={classNames(locals.metrics, className)}>
      <span>{metrics.calls != undefined ? number.compact(metrics.calls) : '--'}</span>
      <span>{metrics.latency != undefined ? meanLatency.detailed(metrics.latency) : '--'}</span>
      <span>{metrics.errors != undefined ? percentage.detailed(metrics.errors) : '--'}</span>
    </div>
  );
}
