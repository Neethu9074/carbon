export function getTickStyle(tick, isVertical, align, offset = 0, labelOffset = 0) {
  if (isVertical) {
    return {
      top: tick.range - labelOffset,
      left: align === 'right' && offset,
      right: align === 'left' && offset
    };
  }

  return {
    top: align === 'bottom' && offset,
    left: tick.range - labelOffset,
    bottom: align === 'top' && offset
  };
}
