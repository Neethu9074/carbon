export function roundToNearestTimeBlock(timeConfig) {
  if (timeConfig == null) {
    return null;
  }
  if (timeConfig.to == null) {
    return timeConfig;
  }
  return {
    ...timeConfig,
    to: Math.round(timeConfig.to / 5000) * 5000 + 5000,
    focusedMoment: Math.round(timeConfig.focusedMoment / 5000) * 5000 + 5000
  };
}
