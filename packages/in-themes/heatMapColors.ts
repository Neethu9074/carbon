/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { hexToRGBNormalized } from 'in-services/formatters/color';

export const neutralColorRgb = {
  r: 0.65,
  g: 0.7,
  b: 0.72
};

export const yellowToRedHex = ['#ffcc00', '#990000'];
export const yellowToRedRgb = yellowToRedHex.map(hexToRGBNormalized);

export const lightBlueToDarkBlueHex = ['#d2e1ed', '#2473ae'];
export const lightBlueToDarkBlueRgb = lightBlueToDarkBlueHex.map(hexToRGBNormalized);

export const lightGreenToDarkGreenHex = ['#E5E696', '#003700'];
export const lightGreenToDarkGreenRgb = lightGreenToDarkGreenHex.map(hexToRGBNormalized);

export default function getHeatMapColor(intensity = 0, colorPalette = yellowToRedRgb) {
  intensity = Math.min(1, Math.max(0, intensity)); // [0, 1]

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
