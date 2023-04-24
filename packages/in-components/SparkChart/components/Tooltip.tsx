/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { clamp, isEqual } from 'lodash';
import React from 'react';

import { Disposable, on } from '@instana/observables';
import { TimeConfig } from '@instana/types';

import { MetricDataPoint, MetricDataSeries } from 'in-components/Chart/types';
import { FormatterFn } from 'in-stores/metric/formatters';
import createScale from 'in-services/scale';
import { Nullish } from 'in-types';

import locals from './Tooltip.mless';

const tooltipToFocusedMomentMargin = 10;

interface HighlightedMoment {
  y: number;
  x: number;
  xDomain: number;
}

interface Props {
  timeConfig: TimeConfig;
  width: number;
  metrics: MetricDataSeries;
  tooltipFormatter: FormatterFn;
}

interface State {
  highlightedMoment: HighlightedMoment | null;
}

export default class Tooltip extends React.Component<Props, State> {
  onMouseMoveSubscription?: Disposable | null;
  onMouseLeaveSubscription?: Disposable | null;
  glassPane?: HTMLElement | Nullish;

  xScale = createScale();

  state: State = {
    highlightedMoment: null
  };

  componentDidMount() {
    this.updateScaleFromProps(this.props);
    this.onMouseMoveSubscription = on(this.glassPane!, 'mousemove').subscribe(this.onMouseMove as (e: Event) => void);
    this.onMouseLeaveSubscription = on(this.glassPane!, 'mouseleave').subscribe(this.onMouseLeave);
  }

  componentDidUpdate(prevProps: Props) {
    if (!isEqual(prevProps, this.props)) {
      this.updateScaleFromProps(this.props);
    }
  }

  componentWillUnmount() {
    this.onMouseMoveSubscription?.dispose();
    this.onMouseMoveSubscription = null;
    this.onMouseLeaveSubscription?.dispose();
    this.onMouseLeaveSubscription = null;
  }

  render() {
    const nearestDataPoint = this.calculateNearestDataPoint();
    let xPositionOnCanvas: number | null = null;
    let tooltipStyle: React.CSSProperties | undefined;
    if (nearestDataPoint) {
      xPositionOnCanvas = this.xScale.getRange(nearestDataPoint[0]);

      if (this.cursorHasCrossedHalfOfTheCanvas(xPositionOnCanvas)) {
        tooltipStyle = {
          // We clamp between -9 and 1 to make sure the tooltip doesn't clip through the boundary of the Li element
          top: clamp(this.state.highlightedMoment!.y, -9, 1),
          right: this.props.width - xPositionOnCanvas + tooltipToFocusedMomentMargin
        };
      } else {
        tooltipStyle = {
          // We clamp between -9 and 1 to make sure the tooltip doesn't clip through the boundary of the Li element
          top: clamp(this.state.highlightedMoment!.y, -9, 1),
          left: xPositionOnCanvas + tooltipToFocusedMomentMargin
        };
      }
    }

    return (
      <div>
        <div className={locals.tooltip} style={tooltipStyle}>
          {nearestDataPoint ? (
            <div className={locals.value}>{this.props.tooltipFormatter(nearestDataPoint[1])}</div>
          ) : null}
        </div>

        <div
          className={locals.glassPane}
          ref={glassPane => {
            this.glassPane = glassPane;
          }}
        >
          {nearestDataPoint ? <div className={locals.line} style={{ left: xPositionOnCanvas! }} /> : null}
        </div>
      </div>
    );
  }

  updateScaleFromProps({ timeConfig, width }: Props): void {
    this.xScale.setRangeFrom(2);
    this.xScale.setRangeTo(width - 2);
    const to = timeConfig.to ?? 0;
    this.xScale.setDomainFrom(to - timeConfig.windowSize);
    this.xScale.setDomainTo(to);
  }

  calculateNearestDataPoint() {
    if (!this.state.highlightedMoment) {
      return null;
    }
    return this.getNearestDataPointForXPosition(this.state.highlightedMoment.x);
  }

  onMouseMove = (e: MouseEvent) => {
    if (e.offsetX < this.xScale.getRangeFrom() || e.offsetX > this.xScale.getRangeTo()) {
      return;
    }

    this.setState({
      highlightedMoment: {
        x: e.offsetX,
        xDomain: this.xScale.getDomain(e.offsetX),
        y: e.offsetY - 14
      }
    });
  };

  onMouseLeave = () => {
    this.setState({
      highlightedMoment: null
    });
  };

  getNearestDataPointForXPosition = (xPositionOnCanvas: number): MetricDataPoint | null => {
    const metrics = this.props.metrics;
    if (metrics.length === 0) {
      return null;
    }

    const xPositionOnCanvasAsDomain = this.xScale.getDomain(xPositionOnCanvas);
    let distanceToNearestDataPoint = Number.MAX_VALUE;
    let nearestDataPoint = null;

    for (let i = 0; i < metrics.length; i++) {
      const dataPoint = metrics[i];
      const distanceToDataPoint = Math.abs(xPositionOnCanvasAsDomain - dataPoint[0]);
      if (distanceToDataPoint < distanceToNearestDataPoint) {
        nearestDataPoint = dataPoint;
        distanceToNearestDataPoint = distanceToDataPoint;
      }
    }

    return nearestDataPoint;
  };

  cursorHasCrossedHalfOfTheCanvas(cursorXPosition: number): boolean {
    const fullWidth = this.xScale.getRangeTo() - this.xScale.getRangeFrom();
    return cursorXPosition > fullWidth / 2;
  }
}
