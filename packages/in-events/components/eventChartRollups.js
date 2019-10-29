// export for testing
export const validRollups = [1000, 1000 * 5, 1000 * 60, 1000 * 60 * 5, 1000 * 60 * 60];

export function getNextValidRollup(granularity) {
  if (granularity < validRollups[0]) {
    return validRollups[0];
  } else if (granularity > validRollups[validRollups.length - 1]) {
    return validRollups[validRollups.length - 1];
  }

  for (let i = 0; i < validRollups.length; i++) {
    if (granularity < validRollups[i]) {
      return validRollups[i];
    } else if (granularity === validRollups[i]) {
      return granularity;
    }
  }
  return validRollups[validRollups.length - 1];
}
