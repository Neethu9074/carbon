import metrics from 'in-forge/plugins/clickHouseDatabase/Dashboard/metrics';

export default metrics.map(({ metric, formatter }) => ({
  metric,
  label: metric,
  formatter,
  min: 0
}));
