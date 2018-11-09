import { hexToRGBNormalized } from 'in-services/formatters/color';

export const heatMapColorScaleHex = ['#000003', '#4c186b', '#fcfca8'];
export const heatMapColorScaleRgb = heatMapColorScaleHex.map(hexToRGBNormalized);
