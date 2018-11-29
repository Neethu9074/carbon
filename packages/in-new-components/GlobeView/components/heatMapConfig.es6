import { hexToRGBNormalized } from 'in-services/formatters/color';

export const heatMapColorScaleHex = ['#ffcc00', '#990000'];
export const heatMapColorScaleRgb = heatMapColorScaleHex.map(hexToRGBNormalized);
