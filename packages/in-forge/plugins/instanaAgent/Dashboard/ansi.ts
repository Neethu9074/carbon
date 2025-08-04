/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// @ts-expect-error no typescript definitions exist yet
// eslint-disable-next-line no-restricted-imports
import * as carbonColors from '@carbon/colors';
import Convert from 'ansi-to-html';

export function ansiToHtml(ansi: string): string {
  // Map colors to the ones used in the carbon design system
  const options = {
    bg: carbonColors.white,
    fg: carbonColors.cyan100,
    colors: {
      0: carbonColors.cyan100, // black
      1: carbonColors.magenta70, // red
      //2: default green
      //3: default yellow
      //4: default blue
      5: carbonColors.purple70, // magenta
      6: carbonColors.teal70, // cyan
      7: carbonColors.white // white
    }
  };
  return new Convert(options).toHtml(ansi);
}
