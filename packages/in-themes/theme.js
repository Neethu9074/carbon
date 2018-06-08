/* eslint-env node */
/* eslint-disable strict */

'use strict';

let zIndex = 1;

module.exports = {
  zIndex: {
    stickyHeader: (zIndex += 20),
    timeline: zIndex++,
    detailPopupPresenter: zIndex++,
    graphView: zIndex++,
    tooltips: zIndex++,
    overlays: zIndex++,
    dialog: zIndex++,
    subMenu: zIndex++,
    messageFlyout: zIndex++
  },
  fontColor: '#222627',
  fontFamilySansSerif:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  fontFamilyMonospace: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  links: {
    decoration: 'none',
    hover: {
      decoration: 'underline'
    }
  },
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
  maxWidth: 1400,
  grid: {
    gutter: 24,
    columns: 12
  },
  footer: {
    height: 36,
    heightExpanded: 97,
    heightOpen: 171
  },
  footerTimelineEvents20: {
    height: 36,
    heightExpanded: 73,
    heightOpen: 147
  },
  header: {
    height: 88
  },
  map: {
    colors: {
      cubeColorFalloffValues: {
        right: { r: 0.78, g: 0.84, b: 0.87 },
        top: { r: 0.957, g: 0.97, b: 0.98 }
      }
    }
  },

  lib: buildLib()
};

function buildLib() {
  const lib = {
    colors: {
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
      lightBlue800: '#17A1E6',
      cyan800: '#00CCCC',
      teal800: '#00B3B3',
      green800: '#39BF7C',
      lime800: '#ADCC14',

      // navy
      navy800: '#475E66',
      navy900: '#031F29',

      // health
      yellow800: '#FFC600',
      orange800: '#FF8C19',
      red800: '#FF4040',

      chart: {}
    },

    shapes: {
      radius_small: '2px',
      radius_medium: '3px',
      radius_large: '5px',
      radius_round: '50%'
    },

    shadows: {
      subtle: '0px 1px 4px 0px rgba(0, 0, 0, 0.16)',
      pronounced: '0px 2px 5px 0px rgba(0, 0, 0, 0.24)',
      strong: '0px 3px 10px 0px rgba(0, 0, 0, 0.24)'
    },

    typography: {
      h900: {
        fontSize: '5.375rem',
        fontWeight: 300
      },
      h800: {
        fontSize: '3.5rem',
        fontWeight: 400
      },
      h700: {
        fontSize: '2.375rem',
        fontWeight: 300
      },
      h600: {
        fontSize: '2.125rem',
        fontWeight: 300
      },
      h500: {
        fontSize: '1.625rem',
        fontWeight: 200
      },
      h400: {
        fontSize: '1.5rem',
        fontWeight: 500
      },
      h300: {
        fontSize: '1.375rem'
      },
      h200: {
        fontSize: '1rem'
      },
      h100: {
        fontSize: '0.75rem'
      },
      bodyLarge: {
        fontSize: '1rem'
      },
      bodyBold: {
        fontSize: '0.875rem',
        fontWeight: 'bold'
      },
      body: {
        fontSize: '0.875rem'
      },
      bodySmall: {
        fontSize: '0.75rem'
      },
      button: {
        fontSize: '0.875rem',
        fontWeight: 500
      }
    }
  };

  // primary
  lib.colors.primary1 = lib.colors.teal800;
  lib.colors.primary2 = lib.colors.blue800;

  // success & failure
  lib.colors.success = lib.colors.green800;
  lib.colors.failure = lib.colors.red800;

  // stroke colors
  lib.colors.chart.strokeColors100 = [
    lib.colors.lightBlue800,
    lib.colors.green800,
    lib.colors.orange800,
    lib.colors.deepPurple800,
    lib.colors.cyan800,
    lib.colors.lime800,
    lib.colors.pink800,
    lib.colors.teal800,
    lib.colors.purple800,
    lib.colors.indigo800
  ];
  lib.colors.chart.strokeColors25 = lib.colors.chart.strokeColors100.map(hex => addTransparency(hex, 0.05));

  return lib;
}

function addTransparency(hex, opacity) {
  const rgb = hexToRGB(hex);
  rgb.r = 255 * (1 - opacity) + rgb.r * opacity;
  rgb.g = 255 * (1 - opacity) + rgb.g * opacity;
  rgb.b = 255 * (1 - opacity) + rgb.b * opacity;
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

function rgbToHex(r, g, b) {
  const hex = (r << 16) ^ (g << 8) ^ (b << 0);
  return '#' + ('000000' + hex.toString(16)).slice(-6);
}

function hexToRGB(style) {
  const color = /^\#([0-9a-f]{6})$/i.exec(style);
  let hex = parseInt(color[1], 16);

  hex = Math.floor(hex);

  const r = (hex >> 16) & 255;
  const g = (hex >> 8) & 255;
  const b = hex & 255;
  return { r, g, b };
}
