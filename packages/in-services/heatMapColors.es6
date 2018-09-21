import { hexToRGBNormalized } from 'in-services/formatters/color';

export const DEFAULT_COLOR = {
  r: 0.65,
  g: 0.7,
  b: 0.72
};

export let ERROR_COLORS;
export let CALLS_COLORS;
export let LATENCY_COLORS;

function getColorPalette(heatMapMetric) {
  if (heatMapMetric === 'errors') {
    if (!ERROR_COLORS) {
      ERROR_COLORS = [
        hexToRGBNormalized('#e3e2b8'),
        hexToRGBNormalized('#eae18a'),
        hexToRGBNormalized('#f1e05c'),
        hexToRGBNormalized('#f8df2e'),
        hexToRGBNormalized('#ffde00'),
        hexToRGBNormalized('#ffbf08'),
        hexToRGBNormalized('#ffa010'),
        hexToRGBNormalized('#ff8019'),
        hexToRGBNormalized('#ff6121'),
        hexToRGBNormalized('#ff4229')
      ];
    }
    return ERROR_COLORS;
  }
  if (heatMapMetric === 'calls') {
    if (!CALLS_COLORS) {
      CALLS_COLORS = [
        hexToRGBNormalized('#e3e2b8'),
        hexToRGBNormalized('#eae18a'),
        hexToRGBNormalized('#f1e05c'),
        hexToRGBNormalized('#f8df2e'),
        hexToRGBNormalized('#ffde00'),
        hexToRGBNormalized('#ffbf08'),
        hexToRGBNormalized('#ffa010'),
        hexToRGBNormalized('#ff8019'),
        hexToRGBNormalized('#ff6121'),
        hexToRGBNormalized('#ff4229')
      ];
    }
    return CALLS_COLORS;
  }
  if (heatMapMetric === 'latency') {
    if (!LATENCY_COLORS) {
      LATENCY_COLORS = [
        hexToRGBNormalized('#e3e2b8'),
        hexToRGBNormalized('#eae18a'),
        hexToRGBNormalized('#f1e05c'),
        hexToRGBNormalized('#f8df2e'),
        hexToRGBNormalized('#ffde00'),
        hexToRGBNormalized('#ffbf08'),
        hexToRGBNormalized('#ffa010'),
        hexToRGBNormalized('#ff8019'),
        hexToRGBNormalized('#ff6121'),
        hexToRGBNormalized('#ff4229')
      ];
    }
    return LATENCY_COLORS;
  }
}

export default function getHeatMapColor(heatMapMetric, intensity = 0, colorPalette) {
  intensity = Math.min(1, Math.max(0, intensity)); // [0, 1]

  colorPalette = colorPalette || getColorPalette(heatMapMetric);
  const indexInBetween = intensity * (colorPalette.length - 1);
  const fromColor = colorPalette[Math.floor(indexInBetween)];
  const toColor = colorPalette[Math.ceil(indexInBetween)];
  const interpolationFactor = indexInBetween % 1;

  return {
    r: fromColor.r + interpolationFactor * (toColor.r - fromColor.r),
    g: fromColor.g + interpolationFactor * (toColor.g - fromColor.g),
    b: fromColor.b + interpolationFactor * (toColor.b - fromColor.b)
  };
}
