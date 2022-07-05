/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

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
// @ts-expect-error
import pie from 'in-components/Chart/renderer/pie';
import point from 'in-components/Chart/renderer/point';
import line from 'in-components/Chart/renderer/line';
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
