/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { get } from 'lodash';
import React from 'react';

import { just, combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import {
  useNamespaceDashboard,
  useServiceDashboard,
  useNodeDashboard,
  useDeploymentDashboard
} from 'in-kubernetes/navigation/paths';
import DeplayedGroupTooltip from 'in-kubernetes/Dashboards/commonComponents/commonTabs/PodMap/GroupTooltip';
import DeplayedPodTooltip from 'in-kubernetes/Dashboards/commonComponents/commonTabs/PodMap/PodTooltip';
import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import getEntitiesHealthInfo from 'in-kubernetes/subscriptions/getEntitiesHealthInfo';
import { usePodDashboard as getPodDashboard } from 'in-kubernetes/navigation/paths';
import { getTimeWindowBasedMetricAggregation } from 'in-stores/metric';
import { createColorPool } from 'in-services/util/ColorGenerator';
import { settings$ } from 'in-services/settings/settings';
import { siPrefix } from 'in-services/formatters/number';
import { lighten } from 'in-services/formatters/color';
import TreeMap from 'in-components/TreeMap';
import theme from 'in-themes';
import { t } from 'in-i18n';

const { strokeColors100 } = theme.lib.colors.chart;

export default function PodTreeMap(props) {
  const { timeConfig, showHealth, grouping, sizeMetricConfig, data } = props;

  const colorPool = createColorPool('podTreeMapColors', strokeColors100.length, strokeColors100);

  const entitiesHealthInfo = getEntitiesHealthInfoData({ showHealth, timeConfig, data });

  const metricValues = useObservable(
    () => getMetricValues({ sizeMetricConfig, data, timeConfig }),
    [sizeMetricConfig, data, timeConfig]
  );

  const showUngroupedPods = useObservable(
    () => settings$.map(settings => get(settings, ['kubernetes_ungrouped_pods_enabled'], true)),
    [settings$]
  );

  const treeMapDataProps = {
    ...props,
    colorPool,
    metricValues,
    showUngroupedPods,
    entitiesHealthInfo
  };

  return (
    <FullHeightWrapper
      render={height => (
        <TreeMap
          data={mapTreeMapData(treeMapDataProps)}
          customHeight={height}
          groupProps={{
            renderTooltip: renderGroupTooltip.bind(null, timeConfig, grouping),
            getHref: group => <TreeMapHref group={group} grouping={grouping} />
          }}
          nodeProps={{
            getColor: n => getColorForTreeNode(n, showHealth, colorPool),
            renderTooltip: renderNodeTooltip.bind(null, grouping, timeConfig),
            getHref: node => getPodDashboard(node.data.id)
          }}
        />
      )}
    />
  );
}

function getEntitiesHealthInfoData({ showHealth, timeConfig, data }) {
  const podIds = data.ids[1]; // level 0 = groups, level 1 = pods, level 2 = container

  if (podIds.length == 0 || !showHealth) {
    return;
  }

  return getEntitiesHealthInfo({
    timeConfig,
    ids: podIds
  }).map(result => result.data);
}

function getMetricValues({ sizeMetricConfig, data, timeConfig }) {
  const podIds = data.ids[1]; // level 0 = groups, level 1 = pods, level 2 = container

  if (podIds.length == 0) {
    return;
  }

  let metricValues;

  // the number of containers is an information we already have so we don't have to subscribe against anything here
  if (sizeMetricConfig.value !== 'containers') {
    metricValues = combineLatest(
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
    metricValues = just(mapMetricResult(gatherContainersAsMetricValues(data.root.children), sizeMetricConfig));
  }

  return metricValues;
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
              let label = t('in-kubernetes:dashboards.loading');
              let valueLabel = null;
              if (metricValues && metricValues.metricName !== sizeMetricConfig.value) {
                label = t('in-kubernetes:dashboards.loading');
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

function useHrefByGrouping(_grouping, _groupId) {
  const deploymentDashboardHref = useDeploymentDashboard(_groupId);
  const serviceDashboardHref = useServiceDashboard(_groupId);
  const nodeDashboardHref = useNodeDashboard(_groupId);
  const namespaceDashboardHref = useNamespaceDashboard(_groupId);

  if (_grouping.value === 'DEPLOYMENT') {
    return deploymentDashboardHref;
  }
  if (_grouping.value === 'SERVICE') {
    return serviceDashboardHref;
  }
  if (_grouping.value === 'NODE') {
    return nodeDashboardHref;
  }

  if (_grouping.value === 'NAMESPACE') {
    return namespaceDashboardHref;
  }
}

function TreeMapHref({ group, grouping }) {
  const href = useHrefByGrouping(grouping, group.data.id);

  if (group.data.id === 'unknown') {
    return null;
  }

  return href;
}
