/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { themes } from '@instana/design-tokens';

import { hexToRGB, rgbToHex } from 'in-services/formatters/color';

function buildMapper(fromHex, toHex) {
  const fromRgb = hexToRGB(fromHex);
  const toRgb = hexToRGB(toHex);
  const deltaRgb = {
    r: toRgb.r - fromRgb.r,
    g: toRgb.g - fromRgb.g,
    b: toRgb.b - fromRgb.b
  };
  return v => {
    return rgbToHex(fromRgb.r + deltaRgb.r * v, fromRgb.g + deltaRgb.g * v, fromRgb.b + deltaRgb.b * v);
  };
}

export const cpuColorMapper = buildMapper(
  themes.default.ids.color.option.yellow['500'],
  themes.default.ids.color.option.red['500']
);
export const memColorMapper = buildMapper('#e0d7ff', '#835cff');
export const timeColorMapper = buildMapper('#b9dcfe', '#2a8cea');
