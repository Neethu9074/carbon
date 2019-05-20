export default function calculate(calls) {
  if (!calls || calls < 0) {
    return 0;
  }

  return Math.log10(calls);
}
