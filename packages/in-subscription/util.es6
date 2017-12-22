export function roundToNearestTimeBlock(time) {
  if (time == null) {
    return null;
  }
  return Math.round(time / 5000) * 5000 + 5000;
}
