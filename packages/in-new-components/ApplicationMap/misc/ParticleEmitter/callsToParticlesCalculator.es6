export default function calculate(calls) {
  if (!calls || calls < 0) {
    return 0;
  }

  return Math.log2(calls);
}
