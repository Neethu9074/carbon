export function findMetricName(metric, tree) {
  if (!tree) {
    return null;
  }

  let humanReadableMetricName = null;
  for (let i = 0; i < tree.length; i++) {
    const item = tree[i];
    if (item.type === 'category') {
      humanReadableMetricName = findMetricName(metric, item.children);
    }
    if (!humanReadableMetricName && item.metric === metric) {
      humanReadableMetricName = item.label;
    }
    if (humanReadableMetricName) {
      return humanReadableMetricName;
    }
  }
  return null;
}
