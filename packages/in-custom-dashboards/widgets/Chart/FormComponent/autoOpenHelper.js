let autoOpenState = null;

export function autoOpen(axisName, indexInAxis) {
  autoOpenState = {
    axisName,
    indexInAxis,
    time: Date.now()
  };
}

export function isInitiallyOpen(axisName, indexInAxis) {
  return (
    autoOpenState?.axisName === axisName &&
    autoOpenState?.indexInAxis === indexInAxis &&
    autoOpenState?.time + 500 >= Date.now()
  );
}
