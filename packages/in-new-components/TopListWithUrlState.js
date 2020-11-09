import invariant from 'invariant';

import { track, TOPLIST_ROW_NAVIGATION } from 'in-services/tracking/tracking';
import { pendingResult } from 'in-services/fixedObjects';
import { isNotBlank } from 'in-services/util/string';
import useObservable from 'in-hooks/useObservable';
import { noop } from 'in-services/fixedObjects';
import useUrlState from 'in-hooks/useUrlState';

export const trackTopListNavigation = () => track(TOPLIST_ROW_NAVIGATION);

export function TopListWithUrlState(props) {
  const {
    metrics,
    formatters,
    aggregations,
    companionMetrics,
    companionFormatters,
    companionAggregations,
    colors,
    urlMatrixParamConfig
  } = props;

  if (__DEV__) {
    invariant(
      metrics.length == 1 || (metrics.length > 1 && isNotBlank(urlMatrixParamConfig?.path) && isNotBlank(urlMatrixParamConfig?.paramTab)),
      'URL matrix param configuration is required, when more than one metric is specified.'
    );
  }

  // Default to a valid dummy configuration to be nice to the 'useUrlState' hook. However, we will make
  // sure that the url state will only ever be used, when 'urlMatrixParamConfig' is specified.
  const { path, paramTab } = urlMatrixParamConfig ?? { paramTab: 'dummy' };

  const urlStateDefinition = {
    bind: [
      {
        path: path,
        name: paramTab,
        as: paramTab
      }
    ]
  };

  const [{ [paramTab]: selectedMetric }, setUrlState] = useUrlState(urlStateDefinition);

  let i = urlMatrixParamConfig && selectedMetric != null ? metrics.indexOf(selectedMetric) : 0;
  if (i === -1) {
    i = 0;
  }

  const newProps = {
    ...props,
    selectedMetric: metrics[i],
    selectedMetricFormatter: formatters[i],
    selectedMetricAggregation: aggregations && aggregations[i],
    selectedCompanionMetric: companionMetrics && companionMetrics[i],
    selectedCompanionMetricFormatter: companionFormatters && companionFormatters[i],
    selectedCompanionMetricAggregation: companionAggregations && companionAggregations[i],
    selectedMetricColor: colors && colors[i],
    onChangeMetric: urlMatrixParamConfig == null ? noop : metric => setUrlState({ [paramTab]: metric })
  };

  const result =
    useObservable(props.getList(newProps), [...Object.values(props), newProps.selectedMetric]) ?? pendingResult;

  return props.render({ ...newProps, result: result });
}
