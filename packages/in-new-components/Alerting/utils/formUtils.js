/**
 * Converts the threshold-type to its proper form when sent to the backend.
 */
export function getThresholdWithFixedType(threshold) {
  if (threshold.type.startsWith('historicBaseline.')) {
    threshold.type = 'historicBaseline';
  }
  return threshold;
}
