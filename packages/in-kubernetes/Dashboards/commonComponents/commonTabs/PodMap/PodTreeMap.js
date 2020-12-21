import { just, combineLatest } from '@instana/observables';
import { compose, withProps } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import {
  getNamespaceDashboard,
  getDeploymentDashboard,
  getServiceDashboard,
  getNodeDashboard
} from 'in-kubernetes/navigation/paths';
import DeplayedGroupTooltip from 'in-kubernetes/Dashboards/commonComponents/commonTabs/PodMap/GroupTooltip';
import DeplayedPodTooltip from 'in-kubernetes/Dashboards/commonComponents/commonTabs/PodMap/PodTooltip';
import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import getEntitiesHealthInfo from 'in-subscription/kubernetes/getEntitiesHealthInfo';
import { getTimeWindowBasedMetricAggregation } from 'in-stores/metric';
import { createColorPool } from 'in-services/util/ColorGenerator';
import { getPodDashboard } from 'in-kubernetes/navigation/paths';
import { settings$ } from 'in-services/settings/settings';
import { siPrefix } from 'in-services/formatters/number';
import { lighten } from 'in-services/formatters/color';
import TreeMap from 'in-new-components/TreeMap';
import connect from 'in-hoc/connectTo';
import theme from 'in-themes';

export default compose(
  withProps(() => ({
    colorPool: createColorPool(
      'podTreeMapColors',
      theme.lib.colors.chart.strokeColors100.length,
      theme.lib.colors.chart.strokeColors100
    )
  })),
  connect(getObservables)
)(PodTreeMap);

function PodTreeMap(props) {
  const { timeConfig, showHealth, grouping, colorPool } = props;

  return (
    <FullHeightWrapper
      render={height => (
        <TreeMap
          data={mapTreeMapData(props)}
          customHeight={height}
          groupProps={{
            renderTooltip: renderGroupTooltip.bind(null, timeConfig, grouping),
            getHref$: group => (group.data.id === 'unknown' ? null : getHref$ByGrouping(grouping, group.data.id))
          }}
          nodeProps={{
            getColor: n => getColorForTreeNode(n, showHealth, colorPool),
            renderTooltip: renderNodeTooltip.bind(null, grouping, timeConfig),
            getHref$: node => getPodDashboard(node.data.id)
          }}
        />
      )}
    />
  );
}

function getObservables({ showHealth, timeConfig, data, sizeMetricConfig }) {
  const podIds = data.ids[1]; // level 0 = groups, level 1 = pods, level 2 = container
  const observables = {
    showUngroupedPods: settings$.map(settings => get(settings, ['kubernetes_ungrouped_pods_enabled'], true))
  };

  if (podIds.length === 0) {
    return observables;
  }

  if (showHealth) {
    observables.entitiesHealthInfo = getEntitiesHealthInfo({
      timeConfig,
      ids: podIds
    }).map(result => result.data);
  }

  // the number of containers is an information we already have so we don't have to subscribe against anything here
  if (sizeMetricConfig.value !== 'containers') {
    observables.metricValues = combineLatest(
      podIds.map(id =>
        getTimeWindowBasedMetricAggregation({
          snapshotId: id,
          metric: sizeMetricConfig.value,
          timeWindowAggregation: 'mean',
          timeConfig
        }).map(data => ({ id, value: data }))
      )
    )
      .debounce(250) // if metrics arrive during multiple frames in live mode, we want to avoid a lot of updates. Therefore we batch the results in 250ms bunches
      .map(metrics => mapMetricResult(metrics, sizeMetricConfig));
  } else {
    // transform the already available information into a metric result so we don't have a special handling for this case when consuming the data
    observables.metricValues = just(
      mapMetricResult(gatherContainersAsMetricValues(data.root.children), sizeMetricConfig)
    );
  }

  return observables;
}

function gatherContainersAsMetricValues(groups) {
  const metrics = [];
  for (let iG = 0; iG < groups.length; iG++) {
    const group = groups[iG];
    for (let iN = 0; iN < group.children.length; iN++) {
      const pod = group.children[iN];
      metrics.push({ id: pod.id, value: pod.children.length });
    }
  }
  return metrics;
}

function mapMetricResult(metrics, sizeMetricConfig) {
  const metricsAsMap = {
    metricName: sizeMetricConfig.value
  };
  let minValue = Number.MAX_VALUE;
  let maxValue = 0;
  for (let i = 0; i < metrics.length; i++) {
    const id = metrics[i].id;
    let value = metrics[i].value;
    // for metrics used here the backend returns -1 if it's not set. -1 is no real metric value, just a signal
    if (value < 0) {
      value = 0;
    }
    metricsAsMap[id] = { value, format: sizeMetricConfig.format };
    minValue = Math.min(minValue, value);
    maxValue = Math.max(maxValue, value);
  }
  metricsAsMap.minValue = minValue;
  metricsAsMap.maxValue = maxValue;
  return metricsAsMap;
}

function renderNodeTooltip(grouping, timeConfig, node) {
  return <DeplayedPodTooltip grouping={grouping} timeConfig={timeConfig} node={node} />;
}

function renderGroupTooltip(timeConfig, grouping, group, isMetricValuePresented) {
  return (
    <DeplayedGroupTooltip
      timeConfig={timeConfig}
      grouping={grouping}
      isMetricValuePresented={isMetricValuePresented}
      group={group}
    />
  );
}

function mapTreeMapData({ data, sizeMetricConfig, metricValues, entitiesHealthInfo, showUngroupedPods }) {
  entitiesHealthInfo = entitiesHealthInfo || {};

  const minValue = metricValues ? metricValues.minValue : 0;
  const maxValue = metricValues ? metricValues.maxValue : 0;
  const fullDomain = maxValue - minValue || 1; // avoid devide by zero

  const root = {
    root: {
      id: data.root.id,
      children: data.root.children
        .filter(group => showUngroupedPods || group.id !== 'unknown')
        .map(({ id, label, children }) => {
          const mappedGroup = {
            id,
            label,
            children: children.map(pod => {
              const value = get(metricValues, [pod.id, 'value'], 1);
              let label = 'Loading';
              let valueLabel = null;
              if (metricValues && metricValues.metricName !== sizeMetricConfig.value) {
                label = 'Loading';
              } else if (metricValues && metricValues[pod.id]) {
                const metricValue = metricValues[pod.id];
                valueLabel = metricValue.format(value);
                label = pod.label;
              }

              const power = 0.1 + ((value - minValue) / fullDomain) * 0.9;
              return {
                groupId: id,
                id: pod.id,
                value: power,
                rawValue: value,
                label,
                valueLabel,
                numberOfContainer: get(pod, ['children', 'length'], 0),
                health: entitiesHealthInfo[pod.id]
              };
            })
          };
          mappedGroup.valueLabel = getGroupValueLabel(mappedGroup.children, metricValues);
          const powers = mappedGroup.children.map(node => node.value);
          mappedGroup.minPower = powers.reduce((a, b) => Math.min(a, b), 0);
          mappedGroup.maxPower = powers.reduce((a, b) => Math.max(a, b), 0);
          return mappedGroup;
        })
    }
  };
  return root;
}

function getGroupValueLabel(pods, metricValues) {
  if (!pods || pods.length === 0) {
    return;
  }

  const summedMetricValue = pods.map(p => p.rawValue).reduce((v1, v2) => v1 + v2, 0);
  return metricValues?.[pods[0].id]?.format(summedMetricValue) ?? siPrefix.compact(summedMetricValue);
}

function getColorForTreeNode(node, showHealth, colorPool) {
  if (node.health) {
    if (node.health.maxSeverity > 5) {
      return theme.lib.colors.failure;
    }
    if (node.health.maxSeverity > 0) {
      return theme.lib.colors.warning;
    }
  }
  if (showHealth) {
    return lighten(theme.lib.colors.lightBlue800, 0.2);
  }

  const minPowerInGroup = node.parent.data.minPower;
  const maxPowerInGroup = node.parent.data.maxPower;
  const relativePowerInGroup = (node.value - minPowerInGroup) / (maxPowerInGroup - minPowerInGroup);
  return lighten(colorPool.getColorHex(node.data.groupId), 0.2 + relativePowerInGroup * 0.3); // set the interval to [0.2, 0.5]
}

function getHref$ByGrouping(_grouping, _groupId) {
  if (_grouping.value === 'DEPLOYMENT') {
    return getDeploymentDashboard(_groupId);
  }
  if (_grouping.value === 'SERVICE') {
    return getServiceDashboard(_groupId);
  }
  if (_grouping.value === 'NODE') {
    return getNodeDashboard(_groupId);
  }
  if (_grouping.value === 'NAMESPACE') {
    return getNamespaceDashboard(_groupId);
  }
}
