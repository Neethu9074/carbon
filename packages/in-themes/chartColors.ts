/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error no typescript definitions exist yet
import * as carbonColors from '@carbon/colors';

import { themes } from '@instana/design-tokens';

import { lighten } from 'in-services/formatters/color';

// Easier access - and our import-sort would remove any @ts-expect-error comment
const {
  red60,
  green50,
  orange40,
  orange60,
  yellow30,
  yellow60,
  blue70,
  purple50,
  gray60,
  purple70,
  cyan50,
  teal70,
  magenta70,
  red50,
  red90,
  green60,
  blue80,
  magenta50,
  yellow50,
  teal50,
  cyan90,
  orange70
} = carbonColors;

export const carbonCategorical = {
  purple70,
  cyan50,
  teal70,
  magenta70,
  red50,
  red90,
  green60,
  blue80,
  magenta50,
  yellow50,
  teal50,
  cyan90,
  orange70,
  purple50
} as const;

export const carbonAlert = {
  red60,
  green50,
  orange40,
  orange60,
  yellow30,
  yellow60,
  blue70,
  purple50,
  gray60
};

// carbon three color palette
const threeColorPalette = [magenta50, cyan50, purple70] as const;

// carbon four color palette
const fourColorPalette = [purple70, cyan90, teal50, magenta50] as const;

// carbon five color palette
const fiveColorPalette = [purple70, cyan50, teal70, magenta70, red90] as const;

// stroke colors
const strokeColors100 = [
  cyan50,
  teal70,
  purple70,
  magenta70,
  red50,
  red90,
  green60,
  blue80,
  magenta50,
  yellow50,
  teal50,
  cyan90,
  orange70,
  purple50,
  '#93BEDC', // replaced lib.colors.rpc
  '#69B116', // replaced lib.colors.event
  red60
] as const;

export const chartColors = {
  // carbon three color palette
  threeColorPalette,

  // carbon four color palette
  fourColorPalette,

  // carbon five color palette
  fiveColorPalette,

  // stroke colors
  strokeColors100,

  strokeColors25: strokeColors100.map(hex => lighten(hex, 0.05)),
  strokeColors50: strokeColors100.map(hex => lighten(hex, 0.15)),
  // self

  // replaced lib.colors.N500,
  self100: themes.default.ids.color.option.neutral['500'],

  // replaced lighten(lib.colors.N500, 0.05)
  self25: lighten(themes.default.ids.color.option.neutral['500'], 0.05)
} as const;

/** This should only be used in the Chart rendering in the block-renderer */
export const outlineForColor = {
  [carbonAlert.orange40]: carbonAlert.orange60,
  [carbonAlert.yellow30]: carbonAlert.yellow60
} as const;

/**
 * This is only used rarely in the Chart highlighting and in HistogramChartOverlay.
 * Don't use it in other places without checking with design team.
 */
export const chartSelection = 'rgba(75, 165, 210, 0.2)';

/**
 * This is only used rarely. Don't use it in other places without checking with design team.
 */
export const timeShift = gray60;
