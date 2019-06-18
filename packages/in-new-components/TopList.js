import { compose } from 'recompose';

import { track, TOPLIST_ROW_NAVIGATION } from 'in-services/tracking/tracking';
import withPropDependingState from 'in-hoc/withPropDependingState';
import connect from 'in-hoc/connectTo';

// Sample Usage
// <TopList metrics={['latency', 'selfLatency', 'calls', 'errors']}
//          labels={['Elapsed Latency', 'Self Latency', 'Calls', 'Errors']}
//          aggregations={['MEAN', 'MEAN', 'SUM', 'MEAN']}
//          formatters={[ms.compact, ms.compact, number.compact, percentage.compact]}
//          getList={()}
//          render={({result, selectedMetric, selectedMetricFormatter}) => <span />}/>

export const trackTopListNavigation = () => track(TOPLIST_ROW_NAVIGATION);

export default compose(
  withPropDependingState({
    getInitialState,

    resets: [
      {
        getResettingProps: () => ['metrics', 'formatters', 'aggregations'],
        onReset: getInitialState
      }
    ],

    reducerName: 'onChangeMetric',
    reducer: (prevSelectedMetric, newSelectedMetric, { metrics, formatters, aggregations }) => {
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

function getInitialState({ metrics, formatters, aggregations }) {
  return {
    selectedMetric: metrics[0],
    selectedMetricFormatter: formatters[0],
    selectedMetricAggregation: aggregations[0]
  };
}

function TopList(props) {
  return props.render(props);
}
