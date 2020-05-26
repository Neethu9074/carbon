export function getAggregationText(aggregation) {
  switch (aggregation.toUpperCase()) {
    case 'P25':
      return '25th';
    case 'P50':
      return '50th';
    case 'P75':
      return '75th';
    case 'P90':
      return '90th';
    case 'P95':
      return '95th';
    case 'P98':
      return '98th';
    case 'P99':
      return '99th';
    default:
      return aggregation.toLowerCase();
  }
}
