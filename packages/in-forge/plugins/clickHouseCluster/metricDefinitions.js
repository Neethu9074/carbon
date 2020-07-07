import metrics from 'in-forge/plugins/clickHouseCluster/Dashboard/metrics';

export default metrics.map(({ metric, formatter }) => ({
  metric,
  label: metric,
  formatter,
  min: 0
}));
