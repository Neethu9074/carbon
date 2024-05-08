/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-disable react/no-unused-prop-types */

import invariant from 'invariant';
import React from 'react';

import { Disposable, Observable } from '@instana/observables';
import { TimeConfig } from '@instana/types';

import { getMetricForFocusedMoment, getHistoricMetric, getTimeWindowBasedMetricAggregation } from 'in-stores/metric';
//@ts-expect-error Needs TS migration
import { showAggregations$ } from 'in-stores/metric/showAggregations';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import { FormatterFn } from 'in-stores/metric/formatters';

interface MetricValueProps {
  className?: string;
  createMetricValueStream?: (snapshotId: string) => Observable<any>;
  formatter: (v: number) => string;
  initialValue?: string;
  metric: string;
  optionalTimeWindowAggregation?: string;
  snapshotId: string;
  timeWindowAggregation?: string;
  timeConfig?: TimeConfig;
  time?: number;
  tooltipFormatter?: FormatterFn;
}
export default class extends React.PureComponent<MetricValueProps> {
  static displayName = 'MetricValue';
  node: HTMLElement | null = null;
  subscription: Disposable | null | undefined;
  stream: Observable<any> | undefined;
  componentDidMount() {
    this.establishSubscription(this.getStream(this.props));
  }
  getStream = (props: MetricValueProps) => {
    if (props.createMetricValueStream) {
      return props.createMetricValueStream(this.props.snapshotId).distinct();
    }

    if (__DEV__) {
      invariant(!!props.metric, 'A metric property or createMetricValueStream must be provided to MetricValue.');
    }

    if (props.timeWindowAggregation) {
      return getTimeWindowBasedMetricAggregation({
        snapshotId: props.snapshotId,
        metric: props.metric,
        timeWindowAggregation: props.timeWindowAggregation,
        timeConfig: props.timeConfig
      });
    }

    if (props.optionalTimeWindowAggregation) {
      return showAggregations$.flatMap((showAggregations: boolean) => {
        if (showAggregations) {
          return getTimeWindowBasedMetricAggregation({
            snapshotId: props.snapshotId,
            metric: props.metric,
            timeWindowAggregation: props.optionalTimeWindowAggregation
          }).distinct();
        }

        return getMetricForFocusedMoment({
          snapshotId: props.snapshotId,
          metric: props.metric
        })
          .map((v: [number, number]) => v[1])
          .distinct();
      });
    }

    if (props.time) {
      return getHistoricMetric({
        snapshotId: props.snapshotId,
        metric: props.metric,
        timeConfig: getTimeConfigAtMoment(props.time)
      })
        .map((v: [number, number]) => v[1])
        .distinct();
    }

    return getMetricForFocusedMoment({
      snapshotId: props.snapshotId,
      metric: props.metric
    })
      .map((v: [number, number]) => v[1])
      .distinct();
  };

  establishSubscription = (stream: Observable<any>) => {
    if (this.node) {
      if (this.props.initialValue) {
        this.node.textContent = this.props.initialValue;
      } else {
        this.node.textContent = valueMissingPlaceholder;
      }
    }

    this.stream = stream;
    this.subscription = stream.subscribe((v: number) => {
      if (this.node) {
        this.node.textContent = v == null ? this.props.initialValue || '' : this.format(v);
      }
    });
  };

  componentDidUpdate() {
    const nextStream = this.getStream(this.props);
    if (this.stream !== nextStream) {
      this.disposeSubscription();
      this.establishSubscription(nextStream);
    }
  }

  componentWillUnmount() {
    this.disposeSubscription();
  }

  disposeSubscription = () => {
    if (this.subscription) {
      this.subscription.dispose();
      this.subscription = null;
    }
  };

  format = (v: number): string => {
    if (v !== undefined && this.props.formatter) {
      return this.props.formatter(v);
    }
    return String(v);
  };

  render() {
    return <span className={this.props.className} ref={node => (this.node = node)} />;
  }
}
