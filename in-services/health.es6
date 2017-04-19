const health = [
  '#ffffff',
  '#e3e2b8',
  '#eae18a',
  '#f1e05c',
  '#f8df2e',
  '#ffde00',
  '#ffbf08',
  '#ffa010',
  '#ff8019',
  '#ff6121',
  '#ff4229'
];

export function getHealthColorBySeverity(severity) {
  if (severity > 0 && severity <= 1) {
    // 0.51 -> 5.1
    severity = severity * 10;
  }
  // 5.1 -> 5
  return health[severity | 0];
}
