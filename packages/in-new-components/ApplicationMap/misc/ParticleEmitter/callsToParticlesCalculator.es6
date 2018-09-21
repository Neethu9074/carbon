const MIN_PARTICLES_PER_SECOND = 0.5;

export default function calculate(calls) {
  if (!calls || calls <= 0) {
    return 0;
  }

  calls = Math.log2(calls);
  calls = Math.max(MIN_PARTICLES_PER_SECOND, calls);
  return calls;
}
