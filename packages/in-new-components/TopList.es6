import { compose } from 'recompose';

import withPropDependingState from 'in-hoc/withPropDependingState';
import connect from 'in-hoc/connectTo';

// TODO Use in-new-components/TopList everywhere and delete this! There is no 1.0 TopList.

// Sample Usage
// <TopList metrics={['latency', 'selfLatency', 'calls', 'errors']}
//          labels={['Elapsed Latency', 'Self Latency', 'Calls', 'Errors']}
//          aggregations={['MEAN', 'MEAN', 'SUM', 'MEAN']}
//          formatters={[ms.compact, ms.compact, number.compact, percentage.compact]}
//          getList={()}
//          render={({result, selectedMetric, selectedMetricFormatter}) => <span />}/>

export default compose(
  withPropDependingState({
    withPropDependingState: ['metrics', 'formatters', 'aggregations'],
    onReset: ({ metrics, formatters, aggregations }) => ({
      selectedMetric: metrics[0],
      selectedMetricFormatter: formatters[0],
      selectedMetricAggregation: aggregations[0]
    }),
    reducerName: 'onChangeMetric',
    reducer: (prevState, newSelectedMetric, { metrics, formatters, aggregations }) => {
      let i = metrics.indexOf(newSelectedMetric);
      if (i === -1) {
        i = 0;
      }
      return {
        selectedMetric: metrics[i],
        selectedMetricFormatter: formatters[i],
        selectedMetricAggregation: aggregations[i]
      };
    }
  }),
  connect(props => ({
    result: props.getList(props)
  }))
)(TopList);

function TopList(props) {
  return props.render(props);
}
