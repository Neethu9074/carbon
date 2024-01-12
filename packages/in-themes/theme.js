/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { chartColors, carbonAlert, carbonCategorical, outlineForColor, timeShift } from 'in-themes/chartColors';
import { lighten } from 'in-services/formatters/color';

/**
 * Deprecated! Use design tokens instead of these values:
 * See the replacement e.g. for N900Primary:
 *
 * import { themes } from '@instana/design-tokens';
 * themes.default.ids.color.option.neutral['900']
 *
 * More colors and details:
 * https://pages.github.ibm.com/instana/ui-foundation/?path=/docs/design-tokens-colors-ids--docs
 */
const oldThemeColors = {
  // black & white
  white: '#FFFFFF',
  black: '#000000',

  // neutral
  N050: '#FAFBFC',
  N100: '#F7F9FA',
  N200: '#F2F6F7',
  N300: '#DFE4E8',
  N400: '#D4D8DB',
  N500: '#6A7C8F',
  N600Light: '#637282',
  N700Medium: '#47525D',
  N800Dark: '#3C444D',
  N900Primary: '#1B2733',

  // chart
  pink800: '#E62E8A',
  purple800: '#BF73E6',
  deepPurple800: '#8257D9',
  indigo800: '#4D4DBF',
  blue800: '#2483B3',
  fadedBlue800: 'rgba(36,131,179,0.08)',

  lightBlue800: '#17A1E6',
  cyan800: '#00CCCC',
  fadedCyan800: 'rgba(0, 204, 204, 0.1)',
  teal800: '#00B3B3',
  fadedTeal800: 'rgba(0, 179, 179, 0.11)',
  green800: '#39BF7C',
  lime800: '#ADCC14',
  slushGreen800: '#4596A4',

  // Endpoint Colors
  batch: '#4FD3F8',
  database: '#EF914D',
  http: '#549EF8',
  messaging: '#69B116',
  rpc: '#93BEDC',
  event: '#69B116',

  // navy
  navy800: '#475E66',

  /** Deprecated! use design-tokens: The replacement of this value is
   *  themes.default.ids.color.option.navy['900']
   *  More colors and details:
   *  https://pages.github.ibm.com/instana/ui-foundation/?path=/docs/design-tokens-colors-ids--docs
   */
  navy900: '#031F29',

  // health
  yellow800: '#FFC600',
  orange800: '#FF8C19',
  red800: '#FF4040',

  transparent: 'rgba(255, 255, 255, 0)'
};

export default {
  /**
   * These are colors only used in the 3d map.
   */
  chart: {
    strokeColors: [
      '#5da6da',
      '#61bd68',
      '#decf3f',
      '#c39eff',
      '#ff57a8',
      '#ff9800',
      '#d03035',
      '#d0e035',
      '#9999cc',
      '#965742'
    ]
  },
  maxWidth: 1500,
  mainNavigationWidth: '4.5rem',
  grid: {
    gutter: 24,
    columns: 12
  },
  map: {
    colors: {
      cubeColorFalloffValues: {
        right: { r: 0.78, g: 0.84, b: 0.87 },
        top: { r: 0.957, g: 0.97, b: 0.98 }
      }
    }
  },

  zIndex: {
    stickyHeader: 124
  },

  lib: {
    /**
     * @deprecated import from 'in-theme/chartColors' if needed
     */
    carbonCategorical,
    /**
     * @deprecated import from 'in-theme/chartColors' if needed
     */
    carbonAlert,

    /**
     * Certain alert colors need outlines for visual accessibility
     * @deprecated import from 'in-theme/chartColors' if needed
     */
    outlineForColor,
    colors: {
      ...oldThemeColors,
      // primary
      primary1: oldThemeColors.teal800,
      primary2: oldThemeColors.blue800,

      // success & failure
      success: oldThemeColors.green800,
      failure: oldThemeColors.red800,
      warning: oldThemeColors.yellow800,

      // table
      tableRowSelectedOdd: oldThemeColors.fadedTeal800,
      tableRowSelectedEven: oldThemeColors.fadedCyan800,

      /**
       * @deprecated replace theme.lib.colors.chart... with chartColors...
       * from different module:
       * import { chartColors } from 'in-themes/chartColors';
       */
      chart: chartColors,

      timeShift,

      primary240: lighten(oldThemeColors.blue800, 0.4),
      lightPrimary240: lighten(oldThemeColors.lightBlue800, 0.4),
      success40: lighten(oldThemeColors.green800, 0.4),
      failure10: lighten(oldThemeColors.red800, 0.1)
    }
  }
};
