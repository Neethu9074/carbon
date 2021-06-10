/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export function getTickStyle(tick, isVertical, align, offset = 0, labelOffset = 0) {
  const labelHeight = 14;
  if (isVertical) {
    if (align === 'right') {
      return {
        top: tick.range - labelHeight,
        right: 0,
        textAlign: 'end',
        width: 200
      };
    }
    return {
      top: tick.range - labelHeight,
      left: 0,
      textAlign: 'start'
    };
  }

  return {
    top: align === 'bottom' && offset,
    left: tick.range - labelOffset,
    bottom: align === 'top' && offset
  };
}
