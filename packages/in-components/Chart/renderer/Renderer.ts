/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { TimeConfig } from '@instana/types';

// @ts-expect-error
import barOverlapping from 'in-components/Chart/renderer/barOverlapping';
// @ts-expect-error
import stackedArea from 'in-components/Chart/renderer/stackedArea';
// @ts-expect-error
import stackedBar from 'in-components/Chart/renderer/stackedBar';
// @ts-expect-error
import integral from 'in-components/Chart/renderer/integral';
// @ts-expect-error
import area from 'in-components/Chart/renderer/area';
// @ts-expect-error
import bar from 'in-components/Chart/renderer/bar';
import point from 'in-components/Chart/renderer/point';
import line from 'in-components/Chart/renderer/line';
import pie from 'in-components/Chart/renderer/pie';
import { Renderer } from './types';

export default {
  area: area as Renderer,
  bar: bar as Renderer,
  barOverlapping: barOverlapping as Renderer,
  integral: integral as Renderer,
  line,
  point,
  stackedArea: stackedArea as Renderer,
  stackedBar: stackedBar as Renderer,
  pie: pie as Renderer
};
// Extend the windowSize by one bucket, because the bar renderer will render the bars around the timestamp instead of behind it
// and the chart will start the time scale right at the first bucket instead of ahead of it.
// Which results in the front half of the bars being cut off
export function extendTimeConfigForBarRenderer(timeConfig: TimeConfig, granularity: number): TimeConfig {
  return {
    ...timeConfig,
    windowSize: timeConfig.windowSize + granularity
  };
}
